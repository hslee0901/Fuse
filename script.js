/* ================== 1) 로딩 스플래시 ================== */
document.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    const hasLoaded = sessionStorage.getItem('hasLoadedOnce');
    if (!hasLoaded) {
      loadingEl.style.display = 'flex';
      setTimeout(() => {
        loadingEl.classList.add('hidden'); // opacity 트랜지션용 클래스
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
        modalImg.style.objectPosition = data.photo.includes('현성') ? '50% 50%' : '50% 30%';
      }
      if (nameEl) nameEl.textContent = `NAME: ${data.name || ''}`;
      if (mbtiEl) mbtiEl.textContent = `MBTI: ${data.mbti || ''}`;
      if (likeEl) likeEl.textContent = `Like: ${data.like || ''}`;
      if (reviewEl) reviewEl.textContent = data.review || '';
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    const storyTargets = document.querySelectorAll('.story');
    if (storyTargets.length) {
      storyTargets.forEach(target => {
        target.addEventListener('click', () => {
          const dataset = target.dataset;
          const data = {
            name: dataset.name || '',
            photo: dataset.photo || '',
            mbti: dataset.mbti || '',
            like: dataset.like || '',
            review: dataset.review || ''
          };
          fillModal(data);
        });
      });
    }

    modal.addEventListener('click', (e) => {
      if (e.target.dataset.close === 'true') closeModal();
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeModal();
    });
  }
});
/* ================== 3) 헤더 내 .nav-item 호버 ================== */
const initNavHover = () => {
  const items = document.querySelectorAll('.nav-item');
  if (!items.length) return;
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
};

/* ================== 4) 헤더 로드 및 아이콘 변경 로직 ================== */
$(function () {
  $("#header-container").load("header.html", function () {
    // 헤더 로드 완료 후, 호버 기능 초기화
    initNavHover();

    const currentPage = location.pathname.split("/").pop() || "index.html";
    const navItems = document.querySelectorAll("#header-container .nav-item");

    navItems.forEach(item => {
      const link = item.getAttribute("href");
      if (link && ((link === currentPage) || (currentPage === "index.html" && (link === "./" || link === "/")))) {
        item.classList.add("active-page");
        const img = item.querySelector("img.custom-icon");
        if (img) {
          const srcUrl = new URL(img.src);
          const filename = srcUrl.pathname.split("/").pop().replace("_Black", "");
          const newSrc = srcUrl.origin + srcUrl.pathname.replace(srcUrl.pathname.split("/").pop(), filename);
          img.src = newSrc;
        }
      }
    });
  });
});