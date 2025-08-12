/* ================== 1) 로딩 스플래시 ================== */
document.addEventListener('DOMContentLoaded', () => {
  const loadingEl = document.getElementById('loading');
  if (loadingEl) {
    const hasLoaded = sessionStorage.getItem('hasLoadedOnce');
    if (!hasLoaded) {
      loadingEl.style.display = 'flex';
      setTimeout(() => {
        loadingEl.classList.add('hidden');
        sessionStorage.setItem('hasLoadedOnce', 'true');
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
    const nameEl     = modal.querySelector('.modal-name');
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

    /* ✅ 헤더 로드 후 검색 버튼 이벤트 등록 */
    initSearchFeature();
  });
});

/* ================== 5) 검색 기능 추가 ================== */
function initSearchFeature() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener('click', () => {
    removeHighlights(document.body);

    const keyword = searchInput.value.trim();
    if (!keyword) return;

    const pages = ['index.html', 'company.html', 'life.html', 'advice.html'];
    const currentPage = location.pathname.split("/").pop() || "index.html";

    let targetPage = null;

    Promise.all(
      pages.map(page =>
        fetch(page)
          .then(res => res.text())
          .then(html => {
            if (!targetPage && html.includes(keyword)) {
              targetPage = page;
            }
          })
          .catch(err => console.error(`Failed to fetch ${page}:`, err))
      )
    ).then(() => {
      if (targetPage) {
        if (targetPage === currentPage) {
          // 현재 페이지이면 페이지 이동 없이 바로 강조 + 스크롤
          highlightText(document.body, keyword);
          scrollToFirstHighlight();
        } else {
          // 다른 페이지면 localStorage 저장 후 페이지 이동
          localStorage.setItem('searchKeyword', keyword);
          window.location.href = targetPage + '#searchResult';
        }
      } else {
        alert('검색 결과가 없습니다.');
      }
    });
  });

  // 페이지 로드 시 localStorage에 검색어가 있으면 강조 + 스크롤
  const storedKeyword = localStorage.getItem('searchKeyword');
  if (storedKeyword) {
    highlightText(document.body, storedKeyword);
    scrollToFirstHighlight();
    localStorage.removeItem('searchKeyword');
  }
}

function highlightText(element, keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi');
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null, false);
  const nodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue.match(regex)) {
      nodes.push(walker.currentNode);
    }
  }
  nodes.forEach(node => {
    const span = document.createElement('span');
    span.innerHTML = node.nodeValue.replace(regex, `<mark>$1</mark>`);
    node.parentNode.replaceChild(span, node);
  });
}

// ✅ 첫 번째 <mark> 위치로 스크롤
function scrollToFirstHighlight() {
  const firstMark = document.querySelector('mark');
  if (firstMark) {
    firstMark.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

function removeHighlights(element) {
  const marks = element.querySelectorAll('mark');
  marks.forEach(mark => {
    mark.replaceWith(document.createTextNode(mark.textContent));
  });
}
