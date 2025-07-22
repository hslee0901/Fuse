const text1 = document.getElementById('text1');
const text2 = document.getElementById('text2');

function cycleTexts() {
  // 첫 문장부터 시작
  text1.classList.remove('hidden');
  text2.classList.add('hidden');

  // 7.2초 후 첫 문장 사라지고 두 번째 문장 표시
  setTimeout(() => {
    text1.classList.add('hidden');
    text2.classList.remove('hidden');
  }, 11000);

  // 16초 후 두 번째 문장 사라지고 첫 문장 다시 표시 (반복)
  setTimeout(() => {
    text2.classList.add('hidden');
    text1.classList.remove('hidden');
  }, 21300);
}

// 16초마다 무한 반복
cycleTexts();
setInterval(cycleTexts, 21300);

  window.addEventListener("load", function () {
      setTimeout(() => {
        document.getElementById("loading").classList.add("hidden");
      }, 1500);
    });