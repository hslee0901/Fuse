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

/* ================== 다크 모드 토글 기능 ================== */

// 다크 모드 초기화 함수
function initDarkMode() {
  // 저장된 다크 모드 설정 확인
  const savedDarkMode = localStorage.getItem('darkMode');
  const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  
  // 저장된 설정이 있으면 우선, 없으면 시스템 설정 따라감
  const shouldEnableDarkMode = savedDarkMode === 'true' || (savedDarkMode === null && prefersDarkMode);
  
  if (shouldEnableDarkMode) {
    document.body.classList.add('dark-mode');
  }
  
  // 토글 버튼 상태 업데이트
  updateToggleButton();
}

// 다크 모드 토글 함수
function toggleDarkMode() {
  const isDarkMode = document.body.classList.toggle('dark-mode');
  
  // localStorage에 설정 저장
  localStorage.setItem('darkMode', isDarkMode);
  
  // 토글 버튼 상태 업데이트
  updateToggleButton();
  
  // 부드러운 전환 효과
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
      icon.className = 'fas fa-sun'; // 다크 모드일 때 해 아이콘
      toggleButton.setAttribute('title', 'Switch to Light Mode');
    } else {
      icon.className = 'fas fa-moon'; // 라이트 모드일 때 달 아이콘
      toggleButton.setAttribute('title', 'Switch to Dark Mode');
    }
  }
}

// 시스템 테마 변경 감지
function watchSystemTheme() {
  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
  mediaQuery.addListener((e) => {
    // 사용자가 수동으로 설정한 적이 없다면 시스템 테마를 따라감
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
        if (qa.q) { // 질문이 있을 때만 출력
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

        if (qa.a) { // 답변이 있을 때만 출력
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

  // ✅ index.html용 검색 결과 표시 컨테이너를 명확하게 지정
  let mainContainer = document.getElementById('interview-container');
  
  // interview-container가 없으면 (index.html에서) middle-panel 사용
  if (!mainContainer) {
    mainContainer = document.querySelector('.middle-panel');
  }
  
  if (!mainContainer) {
    console.error("검색 결과를 표시할 컨테이너를 찾을 수 없습니다.");
    return;
  }

  // 로딩 표시
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'flex';
  
  // 기존 하이라이트 제거
  removeHighlights(document.body);
  
  try {
    // 모든 JSON 데이터 로드
    const [adviceResponse, companyResponse, lifeResponse] = await Promise.all([
      fetch('./advice.json').catch(() => ({ json: () => [] })),
      fetch('./company.json').catch(() => ({ json: () => [] })),
      fetch('./life.json').catch(() => ({ json: () => [] }))
    ]);

    const adviceData = await adviceResponse.json?.() || [];
    const companyData = await companyResponse.json?.() || [];
    const lifeData = await lifeResponse.json?.() || [];

    // 모든 데이터 합치기
    const allData = [...adviceData, ...companyData, ...lifeData];

    // ✅ index.html의 기존 포스트 내용도 검색에 포함
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

    // index.html 포스트와 JSON 데이터 합치기
    const combinedData = [...allData, ...indexPosts];

    // 검색어가 포함된 데이터 필터링
    const filteredData = combinedData.filter(item => {
      const postMatch = item.post?.toLowerCase().includes(query);
      const qnaMatch = item.qna?.some(qnaItem =>
        qnaItem.q?.toLowerCase().includes(query) ||
        qnaItem.a?.toLowerCase().includes(query)
      );
      return postMatch || qnaMatch;
    });

    // 결과 표시
    let resultsHtml = '';
    if (filteredData.length > 0) {
      resultsHtml = `<div class="search-results">
        <h2>"${query}" 검색 결과: ${filteredData.length}개</h2>
        ${makePostGroup(filteredData)}
      </div>`;
      
      // 검색어 하이라이트
      setTimeout(() => {
        highlightText(document.body, query);
      }, 100);
    } else {
      resultsHtml = `<div class="search-results">
        <h2>"${query}"에 대한 검색 결과가 없습니다.</h2>
        <p>다른 검색어를 시도해보세요.</p>
      </div>`;
    }

    // ✅ index.html에서는 기존 content를 덮어쓰지 않고 검색 결과만 표시
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
      // 기존 컨텐츠를 숨기고 검색 결과만 표시
      const existingContent = mainContainer.querySelectorAll('.post, .story-section, .fb-profile-block');
      existingContent.forEach(el => el.style.display = 'none');
      
      // 검색 결과를 mainContainer에 추가
      const searchContainer = document.createElement('div');
      searchContainer.className = 'search-container';
      searchContainer.innerHTML = resultsHtml;
      mainContainer.appendChild(searchContainer);
    } else {
      // 다른 페이지에서는 기존처럼 전체 교체
      mainContainer.innerHTML = resultsHtml;
    }
    
    // 검색 결과로 스크롤
    mainContainer.scrollIntoView({ behavior: 'smooth' });

  } catch (error) {
    console.error('검색 중 오류 발생:', error);
    const errorHtml = `<div class="search-results">
      <h2>검색 중 오류가 발생했습니다.</h2>
      <p>잠시 후 다시 시도해주세요.</p>
    </div>`;
    
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
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

// ✅ 검색 초기화 함수 추가
function resetSearch() {
  // 검색 결과 컨테이너 제거
  const searchContainers = document.querySelectorAll('.search-container');
  searchContainers.forEach(container => container.remove());
  
  // 기존 컨텐츠 다시 표시
  const hiddenContent = document.querySelectorAll('.post, .story-section, .fb-profile-block');
  hiddenContent.forEach(el => el.style.display = '');
  
  // 하이라이트 제거
  removeHighlights(document.body);
  
  // 검색창 초기화
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
        // script, style 태그 내부는 제외
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
    parent.normalize(); // 인접한 텍스트 노드들을 합치기
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

  // 검색 버튼 클릭 이벤트
  searchBtn.addEventListener('click', performUnifiedSearch);
  
  // 엔터키 검색 이벤트
  searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      performUnifiedSearch();
    }
  });

  // ✅ ESC 키로 검색 결과 초기화
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      resetSearch();
    }
  });

  // 페이지 로드 시 저장된 검색어가 있으면 하이라이트
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

// script.js의 기존 헤더 로드 함수 수정
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

    // ✅ 헤더 로드 후 검색 및 다크 모드 기능 초기화
    initSearchFeature();
    initDarkModeToggle(); // 다크 모드 토글 버튼 이벤트 등록
  });
});

// DOM 로드 완료 후 다크 모드 초기화
document.addEventListener('DOMContentLoaded', () => {
  initDarkMode();
  watchSystemTheme();
});