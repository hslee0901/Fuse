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
  const loadingEl = document.getElementById("loading");
  const hasLoaded = sessionStorage.getItem("hasLoadedOnce");

  if (!hasLoaded) {
    // 첫 진입 시 (hasLoaded가 없을 때) → 1.5초 뒤 부드럽게 숨기고 세션 플래그 설정
    setTimeout(() => {
      loadingEl.classList.add("hidden");
      sessionStorage.setItem("hasLoadedOnce", "true");
    }, 3000);
  } else {
    // 새로고침 시 → 즉시 숨기기
    loadingEl.classList.add("hidden");
  }
});
