function makePostGroup(data) {
  let html = '';

  data.forEach(item => {
    html += `
      <div class="post-group">
        <div class="post">
          <div class="post-top">
            <div class="dp"><img src="./images/logo.png" alt="logo"></div>
            <div class="post-info">
              <p class="name">작성자 이름</p>
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
              <p class="name">질문자 이름</p>
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
              <p class="name">작성자 이름</p>
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

fetch('company.json')
  .then(response => response.json())
  .then(data => {
    const container = document.getElementById('interview-container');
    container.innerHTML = makePostGroup(data);
  })
  .catch(error => {
    console.error('데이터 로드 실패:', error);
  });