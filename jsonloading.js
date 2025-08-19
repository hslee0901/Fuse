function makePostGroup(data) {
  let html = '';

  data.forEach(item => {
    html += `
      <div class="post-group" id=${item.asideId}>
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
              <p class="name">布施啓</p>
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
        <div class="post qna answer" id=${qa.asideId}>
          <div class="post-top">
            <div class="dp"><img src="./images/logo.png" alt="logo"></div>
            <div class="post-info">
              <p class="name">メガネパーティー</p>
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
// 현재 페이지 파일 이름 가져오기
const page = window.location.pathname.split('/').pop(); // ex) "advice.html"

// 페이지에 따라 불러올 JSON 결정
let jsonFile;
switch(page) {
  case 'advice.html':
    jsonFile = 'advice.json';
    break;
  case 'company.html':
    jsonFile = 'company.json';
    break;
  case 'life.html':
    jsonFile = 'life.json';
    break;
  default:
    jsonFile = null;
}

if(jsonFile) {
  fetch(jsonFile)
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('interview-container');
      container.innerHTML = makePostGroup(data);
    })
    .catch(error => {
      console.error(`${jsonFile} 데이터 로드 실패:`, error);
    });
}
