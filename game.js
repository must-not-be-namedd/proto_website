const ship = document.querySelector("#ship");
const bullet = document.querySelector("#bullet");
const asteroidContainer = document.querySelector("#asteroid");
const scoreDisplay = document.querySelector("#score");
const questionBox = document.querySelector("#question-box");

let ship_left = 0;
let bullet_top = 500;

let questionCount = 0;
let maxQuestions = 10;
const move_inter = 20;
let score = 0;
let currentQuestion = {};
let currentOptions = [];
let hasAnsweredCurrentQuestion = false;

const isMobile = /Mobi|Android/i.test(navigator.userAgent);

const questions = [ /* your question array remains unchanged */ ];

window.addEventListener("load", () => {
  loadNewQuestion();
  setInterval(spawnAsteroids, 1200); // Faster spawn rate for intensity
  setInterval(moveAsteroids, 50);
  spawnInitialStars(100);
});

window.addEventListener("click", fire);

window.addEventListener("mousemove", (e) => {
  ship_left = e.x;
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") ship_left -= move_inter;
  if (e.key === "ArrowRight") ship_left += move_inter;
  if (e.key === " ") fire();
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
});

window.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  ship_left = touchX;
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
});

function loadNewQuestion() {
  hasAnsweredCurrentQuestion = false;
  questionCount++;
  if (questionCount > maxQuestions) {
    endGame();
    return;
  }
  const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
  allAsteroids.forEach(a => a.remove());

  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  questionBox.textContent = "Question: " + currentQuestion.question;
  currentOptions = [...currentQuestion.options];
}

function endGame() {
  questionBox.textContent = `Game Over! Final Score: ${score} out of ${maxQuestions} questions answered.`;
  const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
  allAsteroids.forEach(a => a.remove());
  window.removeEventListener("click", fire);
  window.removeEventListener("keydown", fire);
}

function fire() {
  const ship_loc = ship.getBoundingClientRect();
  const nozzleX = ship_loc.left + ship_loc.width * 0.5 - bullet.offsetWidth / 2;
  const nozzleY = ship_loc.top;

  bullet.style.left = nozzleX + "px";
  bullet.style.display = "block";
  bullet_top = nozzleY;
  bullet.style.top = bullet_top + "px";

  let bulletSpeed = isMobile ? 40 : 30; // ⚡ intense bullet speed

  let tid = setInterval(() => {
    bullet_top -= bulletSpeed;
    bullet.style.top = bullet_top + "px";

    const asteroids = asteroidContainer.querySelectorAll(".asteroid");

    asteroids.forEach((at) => {
      if (isCollapsed(bullet, at)) {
        showExplosion(at);
        const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
        allAsteroids.forEach((asteroid) => asteroid.remove());

        const asteroidTextElement = at.querySelector(".asteroid-text");
        if (asteroidTextElement && asteroidTextElement.textContent.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
          score++;
        }

        scoreDisplay.textContent = "Score: " + score;
        hasAnsweredCurrentQuestion = true;

        clearInterval(tid);
        bullet.style.display = "none";
        loadNewQuestion();
        return;
      }
    });

    if (bullet_top < 0) {
      clearInterval(tid);
      bullet.style.display = "none";
    }
  }, 10);
}

function isCollapsed(obj1, obj2) {
  const rect1 = obj1.getBoundingClientRect();
  const rect2 = obj2.getBoundingClientRect();
  return (
    rect1.left < rect2.left + rect2.width &&
    rect1.left + rect1.width > rect2.left &&
    rect1.top < rect2.top + rect2.height &&
    rect1.top + rect1.height > rect2.top
  );
}

function spawnAsteroids() {
  if (currentOptions.length > 0 && !hasAnsweredCurrentQuestion) {
    const opt = currentOptions.shift();
    const at = document.createElement("div");
    at.classList.add("asteroid");

    const rockImg = document.createElement("img");
    rockImg.src = "rock1.gif";
    rockImg.alt = "Asteroid";
    rockImg.classList.add("asteroid-image");

    const optionText = document.createElement("span");
    optionText.classList.add("asteroid-text");
    optionText.textContent = opt;

    at.appendChild(rockImg);
    at.appendChild(optionText);

    at.style.left = Math.random() * (window.innerWidth - 100) + "px";
    at.style.top = "0px";

    asteroidContainer.appendChild(at);
  }
}

function moveAsteroids() {
  const asteroids = asteroidContainer.querySelectorAll(".asteroid");

  asteroids.forEach((at) => {
    let top = parseInt(at.style.top) || 0;
    top += 9; // 🪨 Faster falling speed
    at.style.top = top + "px";

    if (top > window.innerHeight) {
      at.remove();
    }
  });

  if (asteroidContainer.querySelectorAll(".asteroid").length === 0 &&
    currentOptions.length === 0 && !hasAnsweredCurrentQuestion) {
    hasAnsweredCurrentQuestion = true;
    loadNewQuestion();
  }
}

function showExplosion(at) {
  const rect = at.getBoundingClientRect();
  const explosion = document.createElement("img");
  explosion.src = "explod.gif";
  explosion.style.width = "50px";
  explosion.style.position = "absolute";
  explosion.style.left = rect.left + "px";
  explosion.style.top = rect.top + "px";
  document.body.appendChild(explosion);
  setTimeout(() => explosion.remove(), 500);
}

const starsContainer = document.getElementById("stars-container");

function spawnStar() {
  const star = document.createElement("div");
  star.classList.add("star");
  star.style.left = Math.random() * window.innerWidth + "px";
  star.style.top = "0px";
  star.style.opacity = Math.random();
  const size = Math.random() * 2 + 1;
  star.style.width = size + "px";
  star.style.height = size + "px";
  star.dataset.speed = Math.random() * 3 + 1;
  starsContainer.appendChild(star);
}

function moveStars() {
  const stars = starsContainer.querySelectorAll(".star");
  stars.forEach((star) => {
    let top = parseFloat(star.style.top);
    let speed = parseFloat(star.dataset.speed);
    top += speed;
    star.style.top = top + "px";
    if (top > window.innerHeight) star.remove();
  });
}

function spawnInitialStars(count) {
  for (let i = 0; i < count; i++) {
    const star = document.createElement("div");
    star.classList.add("star");
    star.style.left = Math.random() * window.innerWidth + "px";
    star.style.top = Math.random() * window.innerHeight + "px";
    star.style.opacity = Math.random();
    const size = Math.random() * 2 + 1;
    star.style.width = size + "px";
    star.style.height = size + "px";
    star.dataset.speed = Math.random() * 3 + 1;
    starsContainer.appendChild(star);
  }
}

setInterval(spawnStar, 100);
setInterval(moveStars, 50);
