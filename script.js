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
        modalImg.style.objectPosition = data.photo && data.photo.includes('현성') ? '50% 50%' : '50% 30%';
      }
      if (nameEl) nameEl.textContent = `NAME: ${data.name || ''}`;
      if (mbtiEl) mbtiEl.textContent = `MBTI: ${data.mbti || ''}`;
      if (likeEl) likeEl.textContent = `Like: ${data.like || ''}`;
      if (reviewEl) reviewEl.innerHTML = data.review || ''; 
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

/* ================== 다크 모드 토글 기능 ================== */

// 다크 모드 초기화 함수
function initDarkMode() {
  const savedDarkMode = localStorage.getItem('darkMode');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  const shouldEnableDarkMode = savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode);
  
  if (shouldEnableDarkMode) {
    document.body.classList.add('dark-mode');
  }
  
  updateToggleButton();
}

// 다크 모드 토글 함수
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  
  localStorage.setItem('darkMode', isDarkMode);
  updateToggleButton();
  
  document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
  setTimeout(() => {
    document.body.style.transition = '';
  }, 300);
}

// 토글 버튼 상태 업데이트
function updateToggleButton() {
  const toggleButton = document.getElementById('darkModeToggle');
  const isDarkMode = document.body.classList.contains('dark-mode');
  
  if (toggleButton) {
    const icon = toggleButton.querySelector('i');
    if (isDarkMode) {
      icon.className = 'fas fa-sun';
      toggleButton.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fas fa-moon';
      toggleButton.setAttribute('title', 'Switch to Dark Mode');
    }
  }
}

// 시스템 테마 변경 감지
function watchSystemTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addListener((e) => {
    if (!localStorage.getItem('darkMode')) {
      if (e.matches) {
        document.body.classList.add('dark-mode');
      } else {
        document.body.classList.remove('dark-mode');
      }
      updateToggleButton();
    }
  });
}

// 헤더 로드 후 다크 모드 버튼 이벤트 등록
function initDarkModeToggle() {
  const toggleButton = document.getElementById('darkModeToggle');
  if (toggleButton) {
    toggleButton.addEventListener('click', toggleDarkMode);
    updateToggleButton();
  }
}

/* ================== 통합 검색 기능 ================== */

// 범용 포스트 그룹 생성 함수
function makePostGroup(data) {
  let html = '';

  data.forEach(item => {
    html += `
      <div class="post-group">
        <div class="post">
          <div class="post-top">
            <div class="dp"><img src="./images/logo.png" alt="logo"></div>
            <div class="post-info">
              <p class="name">布施啓</p>
            </div>
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="post-content">
            ${item.post}
          </div>
          <div class="post-bottom">
            <div class="action"><i class="far fa-thumbs-up"></i></div>
          </div>
        </div>
    `;

    if (item.qna && Array.isArray(item.qna)) {
      item.qna.forEach(qa => {
        if (qa.q) {
          html += `
        <div class="post qna">
          <div class="post-top">
            <div class="dp"><img src="./images/logo.png" alt="logo"></div>
            <div class="post-info">
              <p class="name">질문자</p>
            </div>
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="post-content">
            <p>${qa.q}</p>
          </div>
          <div class="post-bottom">
            <div class="action"><i class="far fa-thumbs-up"></i></div>
          </div>
        </div>
      `;
        }

        if (qa.a) {
          html += `
        <div class="post qna answer">
          <div class="post-top">
            <div class="dp"><img src="./images/logo.png" alt="logo"></div>
            <div class="post-info">
              <p class="name">布施啓</p>
            </div>
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="post-content">
            <p>${qa.a}</p>
          </div>
          <div class="post-bottom">
            <div class="action"><i class="far fa-thumbs-up"></i></div>
          </div>
        </div>
      `;
        }
      });
    }

    html += '</div>';
  });

  return html;
}

// 통합 검색 실행 함수
async function performUnifiedSearch() {
  const searchInput = document.getElementById('searchInput');
  const query = searchInput.value.trim().toLowerCase();
  
  if (!query) {
    alert('검색어를 입력해주세요.');
    return;
  }

  let mainContainer = document.getElementById('interview-container');
  
  if (!mainContainer) {
    mainContainer = document.querySelector('.middle-panel');
  }
  
  if (!mainContainer) {
    console.error("검색 결과를 표시할 컨테이너를 찾을 수 없습니다.");
    return;
  }

  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'flex';
  
  removeHighlights(document.body);
  
  try {
    const [adviceResponse, companyResponse, lifeResponse] = await Promise.all([
      fetch('./advice.json').catch(() => ({ json: () => [] })),
      fetch('./company.json').catch(() => ({ json: () => [] })),
      fetch('./life.json').catch(() => ({ json: () => [] }))
    ]);

    const adviceData = await adviceResponse.json?.() || [];
    const companyData = await companyResponse.json?.() || [];
    const lifeData = await lifeResponse.json?.() || [];

    const allData = [...adviceData, ...companyData, ...lifeData];

    const indexPosts = [
      {
        post: "はじめまして！ 名前： 布施　啓 年齢： 55才 干支： 戌年 MBTI： ENFJ 出身地： 千葉県市川市 好きな食べ物：あん類 嫌いな食べ物：홍어회（フォンオフェ） 座右の銘： 楽をする、楽しむ為の努力は惜しまない 継続こそが成功の秘訣"
      },
      {
        post: "家族： 妻1人、16才の娘、11才と8才の息子、私の両親の7人家族で生活していました。私が蔚山に単身赴任しているので、日本では、今は6人で生活しています。"
      },
      {
        post: "趣味： ロードバイク　今は、蔚山のテファガンを往復で50km位走っています。TVドラマ鑑賞　最近のお気に入り（ホットスポット、イグナイト、なんで私が神説教)"
      }
    ];

    const combinedData = [...allData, ...indexPosts];

    const filteredData = combinedData.filter(item => {
      const postMatch = item.post?.toLowerCase().includes(query);
      const qnaMatch = item.qna?.some(qnaItem =>
        qnaItem.q?.toLowerCase().includes(query) ||
        qnaItem.a?.toLowerCase().includes(query)
      );
      return postMatch || qnaMatch;
    });

    let resultsHtml = '';
    if (filteredData.length > 0) {
      resultsHtml = `<div class="search-results">
        <h2>"${query}" 검색 결과: ${filteredData.length}개</h2>
        ${makePostGroup(filteredData)}
      </div>`;
      
      setTimeout(() => {
        highlightText(document.body, query);
      }, 100);
    } else {
      resultsHtml = `<div class="search-results">
        <h2>"${query}"에 대한 검색 결과가 없습니다.</h2>
        <p>다른 검색어를 시도해보세요.</p>
      </div>`;
    }

    if (window.location.pathname.includes('Profile.html') || window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
      const existingContent = mainContainer.querySelectorAll('.post, .story-section, .fb-profile-block, .search-container');
      existingContent.forEach(el => el.remove());
      
      const searchContainer = document.createElement('div');
      searchContainer.className = 'search-container';
      searchContainer.innerHTML = resultsHtml;
      mainContainer.appendChild(searchContainer);
    } else {
      mainContainer.innerHTML = resultsHtml;
    }
    
    mainContainer.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    const errorHtml = `<div class="search-results">
      <h2>검색 중 오류가 발생했습니다.</h2>
      <p>잠시 후 다시 시도해주세요.</p>
    </div>`;
    
    if (window.location.pathname.includes('Profile.html') || window.location.pathname === '/' || window.location.pathname.includes('index.html')) {
      const searchContainer = document.createElement('div');
      searchContainer.className = 'search-container';
      searchContainer.innerHTML = errorHtml;
      mainContainer.appendChild(searchContainer);
    } else {
      mainContainer.innerHTML = errorHtml;
    }
  } finally {
    if (loading) loading.style.display = 'none';
  }
}

// 검색 초기화 함수 추가
function resetSearch() {
  const searchContainers = document.querySelectorAll('.search-container');
  searchContainers.forEach(container => container.remove());
  
  const hiddenContent = document.querySelectorAll('.post, .story-section, .fb-profile-block');
  hiddenContent.forEach(el => el.style.display = '');
  
  removeHighlights(document.body);
  
  const searchInput = document.getElementById('searchInput');
  if (searchInput) searchInput.value = '';
}

// 텍스트 하이라이트 함수
function highlightText(element, keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi');
  const walker = document.createTreeWalker(
    element, 
    NodeFilter.SHOW_TEXT, 
    {
      acceptNode: function(node) {
        if (node.parentNode.tagName === 'SCRIPT' || node.parentNode.tagName === 'STYLE') {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    }, 
    false
  );
  
  const nodes = [];
  while (walker.nextNode()) {
    if (walker.currentNode.nodeValue && walker.currentNode.nodeValue.match(regex)) {
      nodes.push(walker.currentNode);
    }
  }
  
  nodes.forEach(node => {
    if (node.nodeValue && node.nodeValue.trim()) {
      const span = document.createElement('span');
      span.innerHTML = node.nodeValue.replace(regex, `<mark class="search-highlight">$1</mark>`);
      node.parentNode.replaceChild(span, node);
    }
  });
}

// 하이라이트 제거 함수
function removeHighlights(element) {
  const marks = element.querySelectorAll('mark.search-highlight');
  marks.forEach(mark => {
    const parent = mark.parentNode;
    parent.replaceChild(document.createTextNode(mark.textContent), mark);
    parent.normalize();
  });
}

// 첫 번째 하이라이트로 스크롤
function scrollToFirstHighlight() {
  const firstMark = document.querySelector('mark.search-highlight');
  if (firstMark) {
    firstMark.scrollIntoView({
      behavior: 'smooth',
      block: 'center'
    });
  }
}

// 검색 기능 초기화
function initSearchFeature() {
  const searchBtn = document.getElementById('searchBtn');
  const searchInput = document.getElementById('searchInput');

  if (!searchBtn || !searchInput) return;

  searchBtn.addEventListener('click', performUnifiedSearch);
  
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performUnifiedSearch();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      resetSearch();
    }
  });

  const storedKeyword = localStorage.getItem('searchKeyword');
  if (storedKeyword) {
    searchInput.value = storedKeyword;
    setTimeout(() => {
      highlightText(document.body, storedKeyword);
      scrollToFirstHighlight();
      localStorage.removeItem('searchKeyword');
    }, 500);
  }
}

// ✅ 헤더 로드 로직과 활성화 아이콘 로직을 하나로 통합
$(function () {
  $("#header-container").load("header.html", function () {
    initNavHover();
    
    // 현재 URL의 파일명 가져오기
    let currentPage = location.pathname.split("/").pop();
    if (currentPage === '' || currentPage === 'index.html') {
      currentPage = 'Profile.html'; // 루트 또는 index.html일 경우 Profile.html을 현재 페이지로 간주
    }

    const navItems = document.querySelectorAll("#header-container .nav-item");

    navItems.forEach(item => {
      const link = item.getAttribute("href").split("/").pop(); // 링크의 파일명만 가져오기
      if (link && link === currentPage) {
        item.classList.add("active-page");
      }
    });

    // 헤더 로드 후 기능 초기화
    initSearchFeature();
    initDarkModeToggle();
    const scrollBtn = document.getElementById("scrollBottom");
    if (scrollBtn) {
      scrollBtn.addEventListener("click", () => {
        window.scrollTo({
          top: document.body.scrollHeight,
          behavior: "smooth"
        });
      });
    }
  });
});

// DOM 로드 완료 후 다크 모드 초기화
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  watchSystemTheme();
});

// 맨 위로 스크롤 버튼
const scrollTopBtn = document.getElementById("scrollTop");

// 스크롤 시 버튼 표시/숨김
window.addEventListener("scroll", () => {
  if (window.scrollY > 0) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

// 버튼 클릭 시 맨 위로 이동
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

});


// aside 부드러운 이동
document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault(); // 기본 점프 이동 막기
    const targetId = this.getAttribute('href'); 
    const targetElement = document.querySelector(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth', // 부드럽게 이동
        block: 'start'      // 상단에 맞춤
      });
    }
  });
});

