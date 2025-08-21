function makePostGroup(data) {
  let html = '';

  data.forEach(item => {
    // item thumbs 확인
    let itemThumbsIcon = ((item.thumbs || "").toLowerCase().trim() === "up")
      ? '<i class="fas fa-thumbs-up full"></i>'
      : '<i class="far fa-thumbs-up"></i>';

    html += `
      <div class="post-group" id="${item.asideId}">
        <div class="post">
          <div class="post-top">
            <div class="dp"><img src="./images/自転車2.jpg" alt="logo"></div>
            <div class="post-info">
              <p class="name">布施　啓</p>
            </div>
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="post-content">
            ${item.post}
          </div>
          <div class="post-bottom">
            <div class="action">${itemThumbsIcon}</div>
          </div>
        </div>
    `;

    if (item.qna && Array.isArray(item.qna)) {
      item.qna.forEach(qa => {
        // QA thumbs 확인
        let aThumbsIcon = ((qa.thumbs || "").toLowerCase().trim() === "up")
          ? '<i class="fas fa-thumbs-up full"></i>'
          : '<i class="far fa-thumbs-up"></i>';

        // 질문 출력
        if (qa.q) {
          html += `
          <div class="post qna">
            <div class="post-top">
              <div class="dp"><img src="./images/단체 사진2.jpg" alt="logo"></div>
              <div class="post-info">
                <p class="name">メガネパーティー</p>
              </div>
              <i class="fas fa-ellipsis-h"></i>
            </div>
            <div class="post-content">
              <p>${qa.q}</p>
            </div>
            <div class="post-bottom">
              <div class="action">${aThumbsIcon}</div>
            </div>
          </div>
          `;
        }

        // 답변 출력
        if (qa.a) {
          html += `
          <div class="post qna answer" id="${qa.asideId}">
            <div class="post-top">
              <div class="dp"><img src="./images/自転車2.jpg" alt="logo"></div>
              <div class="post-info">
                <p class="name">布施　啓</p>
              </div>
              <i class="fas fa-ellipsis-h"></i>
            </div>
            <div class="post-content">
              <p>${qa.a}</p>
            </div>
            <div class="post-bottom">
              <div class="action">${aThumbsIcon}</div>
            </div>
          </div>
          `;
        }
      });
    }

    html += '</div>'; // post-group 닫기
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
