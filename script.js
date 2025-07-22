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
    // 첫 접속 시 → 3초 동안 표시 후 숨김
    setTimeout(() => {
      loadingEl.classList.add("hidden");
      sessionStorage.setItem("hasLoadedOnce", "true");
    }, 3000); // 3초 표시
  } else {
    // 두 번째 접속부터는 바로 숨기기
    loadingEl.classList.add("hidden");
  }
});


//카테고리 클릭시 이동을 부드럽게 하는 애니메이션 스크립트(<ul class="sub-menu">)
document.addEventListener('DOMContentLoaded', function () {

document.querySelectorAll('.sub-menu a').forEach(anchor => {
anchor.addEventListener('click', function (e) {
 e.preventDefault();

const targetElement = document.querySelector(this.getAttribute('href'));
smoothScroll(targetElement);
          });
        });

function smoothScroll(targetElement) {
const targetPosition = targetElement.offsetTop;
const startPosition = window.scrollY;
const distance = targetPosition - startPosition;
const duration = 800;

let start = null;

function step(timestamp) {
if (!start) start = timestamp;
const progress = timestamp - start;

window.scrollTo(0, easeInOutCubic(progress, startPosition, distance, duration));

 if (progress < duration) {
 requestAnimationFrame(step);
            }
          }

          requestAnimationFrame(step);
        }

function easeInOutCubic(t, b, c, d) {
          t /= d / 2;
          if (t < 1) return c / 2 * t * t * t + b;
          t -= 2;
          return c / 2 * (t * t * t + 2) + b;
        }
      });
