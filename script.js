window.addEventListener("DOMContentLoaded", function () {
  const loadingEl = document.getElementById("loading");
  const hasLoaded = sessionStorage.getItem("hasLoadedOnce");

  if (!hasLoaded) {
    // 처음 방문한 경우 → 인트로 표시 후 5초 후 숨기기
    loadingEl.style.display = "flex"; // 먼저 보이게
    setTimeout(() => {
      loadingEl.classList.add("hidden");
      sessionStorage.setItem("hasLoadedOnce", "true");
    }, 5000);
  } else {
    // 새로고침(F5) 등 재방문 시 → 아예 보여주지 않음
    loadingEl.remove(); // DOM에서 제거
  }
});

 const items = document.querySelectorAll('.nav-item');

  items.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
      items.forEach((el, i) => {
        el.classList.remove('left', 'right', 'active');
        if (i < index) el.classList.add('left');
        else if (i > index) el.classList.add('right');
        else el.classList.add('active'); // 현재 hover 중인 아이템
      });
    });

    item.addEventListener('mouseleave', () => {
      items.forEach(el => el.classList.remove('left', 'right', 'active'));
    });
  });


document.addEventListener('DOMContentLoaded', function () {
  const modal = document.getElementById('storyModal');
  if (!modal) return;

  const imgEl = modal.querySelector('.modal-img');
  const nameEl = modal.querySelector('.modal-name');

  // .story 중에서 .create(스토리 만들기) 제외
  document.querySelectorAll('.story:not(.create)').forEach(story => {
    story.addEventListener('click', () => {
      // 스토리 안의 "첫 번째 이미지"를 크게 표시
      const firstImg = story.querySelector('img');
      const src = firstImg ? firstImg.getAttribute('src') : '';
      const alt = firstImg ? (firstImg.getAttribute('alt') || '') : '';
      const nameNode = story.querySelector('.name');
      const name = nameNode ? nameNode.textContent.trim() : '';

      imgEl.src = src;
      imgEl.alt = alt || name || 'photo';
      nameEl.textContent = name;

      openModal();
    });
  });

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden'; // 배경 스크롤 잠금
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow = '';
    // imgEl.src = ''; // 필요 시 초기화
  }

  // 배경/닫기 버튼
  modal.addEventListener('click', (e) => {
    if (e.target.dataset.close === 'true') closeModal();
  });

  // ESC로 닫기
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('open')) {
      closeModal();
    }
  });
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


