// 한 번만 실행되는 안전한 초기화
document.addEventListener('DOMContentLoaded', () => {
  /* ================== 1) 로딩 스플래시 ================== */
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    const hasLoaded = sessionStorage.getItem('hasLoadedOnce');
    if (!hasLoaded) {
      loadingEl.style.display = 'flex';
      setTimeout(() => {
        loadingEl.classList.add('hidden');              // opacity 트랜지션용 클래스
        sessionStorage.setItem('hasLoadedOnce', 'true');
        // 트랜지션 끝난 뒤 DOM에서 제거(0.5s 정도 여유)
        setTimeout(() => { loadingEl.remove(); }, 600);
      }, 5000);
    } else {
      loadingEl.remove();
    }
  }

  /* ================== 2) 모달(스토리) ================== */
  const modal = document.getElementById('storyModal');
  if (modal) {
    const modalImg   = modal.querySelector('.modal-img');
    const nameEl     = modal.querySelector('.modal-name');       // "NAME: xxx"
    const mbtiEl     = modal.querySelector('.modal-mbti');
    const likeEl     = modal.querySelector('.modal-like');
    const reviewEl   = modal.querySelector('.modal-review-text');

    const fillModal = (data) => {
      if (modalImg) {
        modalImg.src = data.photo || '';
        modalImg.alt = data.name ? `${data.name} photo` : 'photo';
      }
      if (nameEl)   nameEl.textContent   = `NAME: ${data.name || ''}`;
      if (mbtiEl)   mbtiEl.textContent   = `MBTI: ${data.mbti || ''}`;
      if (likeEl)   likeEl.textContent   = `Like: ${data.like  || ''}`;
      if (reviewEl) reviewEl.textContent = data.review || '';
    };

    const openModal = (data) => {
      if (data) fillModal(data);
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.documentElement.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.documentElement.style.overflow = '';
    };

    // 스토리 영역 클릭 위임
    const storySection = document.querySelector('.story-section');
    if (storySection) {
      storySection.addEventListener('click', (e) => {
        const card = e.target.closest('.story');
        if (!card || card.classList.contains('create')) return;

        // data-* 기본, 없으면 자식에서 fallback
        const data = {
          name:   card.dataset.name  || (card.querySelector('.name')?.textContent.trim() || ''),
          photo:  card.dataset.photo || (card.querySelector('img')?.getAttribute('src') || ''),
          mbti:   card.dataset.mbti  || '',
          like:   card.dataset.like  || '',
          review: card.dataset.review|| ''
        };
        openModal(data);
      });
    }

    // 배경/닫기 버튼, ESC로 닫기
    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close === 'true') closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }

  /* ================== 3) 헤더 내 .nav-item 호버 ================== */
  const initNavHover = () => {
    const items = document.querySelectorAll('.nav-item');
    if (!items.length) return false;
    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        items.forEach((el, i) => {
          el.classList.remove('left', 'right', 'active');
          if (i < index) el.classList.add('left');
          else if (i > index) el.classList.add('right');
          else el.classList.add('active');
        });
      });
      item.addEventListener('mouseleave', () => {
        items.forEach(el => el.classList.remove('left', 'right', 'active'));
      });
    });
    return true;
  };

  // 이미 로드됐으면 즉시, 아니면 header-container 변화 감지 후 바인딩
  if (!initNavHover()) {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer && 'MutationObserver' in window) {
      const mo = new MutationObserver(() => {
        if (initNavHover()) mo.disconnect();
      });
      mo.observe(headerContainer, { childList: true, subtree: true });
    }
  }
});
//아이콘 색 인식 기능
$(function () {
  $("#header-container").load("header.html", function () {
    const currentPage = location.pathname.split("/").pop() || "index.html";

    const navItems = document.querySelectorAll("#header-container .nav-item");
    console.log("navItems count:", navItems.length);

    navItems.forEach(item => {
      const link = item.getAttribute("href");
      console.log("Checking link:", link);

      if (link && ((link === currentPage) || (currentPage === "index.html" && (link === "./" || link === "/")))) {
        item.classList.add("active-page");
        console.log("Added active-page to:", link);

        const img = item.querySelector("img.custom-icon");
        if (img) {
          const srcUrl = new URL(img.src);
          const filename = srcUrl.pathname.split("/").pop().replace("_Black", "");
          const newSrc = srcUrl.origin + srcUrl.pathname.replace(srcUrl.pathname.split("/").pop(), filename) + "?t=" + Date.now();
          img.src = newSrc;
          console.log("Changed img src to:", newSrc);
        }
      }
    });

    // 기존 hover 이벤트 등 유지
    const items = document.querySelectorAll("#header-container .nav-item");
    items.forEach((item, index) => {
      item.addEventListener("mouseenter", () => {
        items.forEach((el, i) => {
          el.classList.remove("left", "right", "active");
          if (i < index) el.classList.add("left");
          else if (i > index) el.classList.add("right");
          else el.classList.add("active");
        });
      });
      item.addEventListener("mouseleave", () => {
        items.forEach(el => el.classList.remove("left", "right", "active"));
      });
    });
  });
});


