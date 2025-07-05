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

const questions = [
  // Synthetic Memory & AI
  {
    question: "What experiment in 2013 marked a major step toward synthetic memory?",
    options: ["False memory in a mouse using optogenetics", "Brain transplant in humans", "AI learning language"],
    answer: "False memory in a mouse using optogenetics"
  },
  {
    question: "Which technology allows specific neurons to be activated using light?",
    options: ["Neuralink chips", "Optogenetics", "Virtual Reality"],
    answer: "Optogenetics"
  },
  {
    question: "Which organization achieved a 35% improvement in memory recall for veterans with brain injuries?",
    options: ["WHO", "DARPA", "MIT"],
    answer: "DARPA"
  },
  {
    question: "What neural network type enables AI to learn from sequences and recall information?",
    options: ["Feedforward Networks", "Recurrent Neural Networks (RNNs)", "Support Vector Machines"],
    answer: "Recurrent Neural Networks (RNNs)"
  },
  {
    question: "What key ethical concern arises from editable memories?",
    options: ["Cost of memory chips", "Loss of identity and trust in self", "Data storage limits"],
    answer: "Loss of identity and trust in self"
  },
  {
    question: "Which AI memory system combines neural networks with external memory for reasoning tasks?",
    options: ["Decision Trees", "Differentiable Neural Computers (DNCs)", "Simple Linear Models"],
    answer: "Differentiable Neural Computers (DNCs)"
  },
  {
    question: "In a 2023 Pew survey, what percentage of people expressed discomfort with implanted memories?",
    options: ["25%", "63%", "90%"],
    answer: "63%"
  },

  // Quantum Computing & Encryption
  {
    question: "What encryption method secures most internet communications today?",
    options: ["AES-128", "RSA-2048", "SHA-256"],
    answer: "RSA-2048"
  },
  {
    question: "Why is RSA-2048 considered secure for classical computers?",
    options: ["AI monitors the system", "Factoring large primes is extremely difficult", "It uses unbreakable passwords"],
    answer: "Factoring large primes is extremely difficult"
  },
  {
    question: "What quantum property allows computers to exist in multiple states simultaneously?",
    options: ["Entanglement", "Superposition", "Binary switching"],
    answer: "Superposition"
  },
  {
    question: "Which thought experiment illustrates superposition?",
    options: ["Maxwell's Demon", "Schrödinger's Cat", "Heisenberg's Microscope"],
    answer: "Schrödinger's Cat"
  },
  {
    question: "Quantum entanglement means changing one qubit affects:",
    options: ["The entire system", "Its entangled partner instantly", "The processor speed"],
    answer: "Its entangled partner instantly"
  },
  {
    question: "Which algorithm threatens current encryption by efficiently factoring large numbers?",
    options: ["RSA Algorithm", "Shor's Algorithm", "Quantum Fourier Algorithm"],
    answer: "Shor's Algorithm"
  },
  {
    question: "What is the estimated chance of a quantum computer breaking RSA-2048 by 2034?",
    options: ["5% to 10%", "17% to 34%", "75% to 90%"],
    answer: "17% to 34%"
  },
  {
    question: "Which company demonstrated quantum error correction with the Willow chip?",
    options: ["Microsoft", "Google", "IBM"],
    answer: "Google"
  },
  {
    question: "The 'harvest now, decrypt later' strategy involves:",
    options: ["Immediate password cracking", "Storing encrypted data to decrypt later with quantum computers", "Using AI to harvest crops"],
    answer: "Storing encrypted data to decrypt later with quantum computers"
  },
  {
    question: "Quantum cryptography ensures unbreakable security by using:",
    options: ["Complex passwords", "The uncertainty principle and no-cloning theorem", "Supercomputers"],
    answer: "The uncertainty principle and no-cloning theorem"
  },

  // Quantum Communication for Military Security
  {
    question: "What does Quantum Key Distribution (QKD) use to generate secure encryption keys?",
    options: ["Magnetic fields", "Quantum bits (qubits)", "AI algorithms"],
    answer: "Quantum bits (qubits)"
  },
  {
    question: "Which property of qubits enables more complex and secure encoding?",
    options: ["Binary logic", "Superposition", "High voltage"],
    answer: "Superposition"
  },
  {
    question: "What effect does intercepting a quantum transmission have?",
    options: ["Slows the system", "Leaves no trace", "Disturbs the system, alerting parties"],
    answer: "Disturbs the system, alerting parties"
  },
  {
    question: "The BB84 protocol secures communication by sending:",
    options: ["Sound waves", "Photons with random polarizations", "Encrypted emails"],
    answer: "Photons with random polarizations"
  },
  {
    question: "Quantum communication between distant nodes often uses:",
    options: ["Traditional copper wires", "Free-space optical links and satellites", "Magnetic resonance"],
    answer: "Free-space optical links and satellites"
  },
  {
    question: "Which satellite first demonstrated successful long-distance quantum communication?",
    options: ["Boeing Q4S", "Micius", "EuroQCI"],
    answer: "Micius"
  },
  {
    question: "What challenge limits QKD over fiber optic cables without repeaters?",
    options: ["Weather interference", "Distance limitations of 100-200 km", "Insufficient data speeds"],
    answer: "Distance limitations of 100-200 km"
  },
  {
    question: "Quantum mesh networks enhance military communication by enabling:",
    options: ["Open public Wi-Fi", "Secure, real-time links between satellites, ships and field units", "Faster mobile internet"],
    answer: "Secure, real-time links between satellites, ships and field units"
  },
  {
    question: "Why are quantum networks considered superior for military security?",
    options: ["They use stronger passwords", "They offer information-theoretic security based on physics", "They rely on advanced firewalls"],
    answer: "They offer information-theoretic security based on physics"
  },
  {
    question: "What is a major global project aiming for continent-wide quantum-secure communications?",
    options: ["Project Starlink", "EuroQCI", "Quantum Fiber USA"],
    answer: "EuroQCI"
  },
  {
    question: "Besides QKD, what other approach is being explored to resist quantum attacks?",
    options: ["Post-quantum cryptography", "Blockchain security", "AI-based password protection"],
    answer: "Post-quantum cryptography"
  }
];

window.addEventListener("load", () => {
  loadNewQuestion();
  setInterval(spawnAsteroids, 2000);
  setInterval(moveAsteroids, 50);
  spawnInitialStars(100);
});

window.addEventListener("click", fire);

window.addEventListener("mousemove", (e) => {
  ship_left = e.clientX - ship.offsetWidth / 2;
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
});

window.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  ship_left = touchX - ship.offsetWidth / 2;
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

  // Clear existing asteroids before loading new question's options
  const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
  allAsteroids.forEach(a => a.remove());

  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  questionBox.textContent = "Question: " + currentQuestion.question;
  currentOptions = [...currentQuestion.options]; // Reset currentOptions for the new question
}

function endGame() {
  questionBox.textContent = `Game Over! Final Score: ${score} out of ${maxQuestions}.`;
  const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
  allAsteroids.forEach(a => a.remove());
  window.removeEventListener("click", fire);
  // Optionally remove keydown listener for firing too
  window.removeEventListener("keydown", handleKeyDownForFire);
}

// Separate function for keydown event to allow removal
function handleKeyDownForFire(e) {
  if (e.key === "ArrowLeft") ship_left -= move_inter;
  if (e.key === "ArrowRight") ship_left += move_inter;
  if (e.key === " ") fire();
  ship.style.left = ship_left + "px";
}

window.addEventListener("keydown", handleKeyDownForFire); // Use the named function

function fire() {
  const ship_loc = ship.getBoundingClientRect();
  const nozzleX = ship_loc.left + ship_loc.width / 2 - bullet.offsetWidth / 2;
  const nozzleY = ship_loc.top;

  bullet.style.left = `${nozzleX}px`;
  bullet.style.top = `${nozzleY}px`;
  bullet.style.display = "block";
  bullet_top = nozzleY;

  const bulletSpeed = 40; // Reduced bullet speed to make it more manageable with asteroid speed

  const tid = setInterval(() => {
    bullet_top -= bulletSpeed;
    bullet.style.top = bullet_top + "px";

    const asteroids = asteroidContainer.querySelectorAll(".asteroid");
    for (const at of asteroids) {
      if (isCollapsed(bullet, at)) {
        showExplosion(at);
        // Remove all asteroids once one is hit, whether it's correct or not
        const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
        allAsteroids.forEach(a => a.remove());

        // Get the text from the asteroid's child span element
        const text = at.querySelector(".asteroid-text")?.textContent.trim();
        if (text && text.toLowerCase() === currentQuestion.answer.toLowerCase()) {
          score++;
        }

        scoreDisplay.textContent = "Score: " + score;
        hasAnsweredCurrentQuestion = true;

        clearInterval(tid);
        bullet.style.display = "none";
        loadNewQuestion();
        return; // Exit the forEach loop after handling the collision
      }
    }

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
  // Only spawn if there are options left for the current question
  // and the question hasn't been answered yet (to prevent spawning after a hit)
  if (currentOptions.length > 0 && !hasAnsweredCurrentQuestion) {
    const opt = currentOptions.shift(); // Use shift to get the first element and remove it
    const at = document.createElement("div");
    at.classList.add("asteroid");

    // Create and append the image element
    const img = document.createElement("img");
    img.src = "rock1.gif"; // Make sure this path is correct
    img.alt = "Asteroid";
    img.classList.add("asteroid-image"); // Add a class for potential styling of the image

    // Create and append the text element
    const text = document.createElement("span");
    text.classList.add("asteroid-text"); // Add a class for potential styling of the text
    text.textContent = opt;

    at.appendChild(img);
    at.appendChild(text);

    at.style.left = Math.random() * (window.innerWidth - 100) + "px";
    at.style.top = "0px";

    asteroidContainer.appendChild(at);
  }
}

function moveAsteroids() {
  const asteroids = asteroidContainer.querySelectorAll(".asteroid");

  asteroids.forEach((at) => {
    let top = parseInt(at.style.top) || 0;
    top += 3; // Reduced asteroid speed back to original for better playability
    at.style.top = top + "px";

    if (top > window.innerHeight) {
      at.remove();
    }
  });

  // Check if all asteroids for the current question have disappeared and the question hasn't been answered
  if (asteroidContainer.querySelectorAll(".asteroid").length === 0 &&
    currentOptions.length === 0 && !hasAnsweredCurrentQuestion) {
    // This means all options have fallen off screen without being shot.
    // Consider this a "missed" question.
    hasAnsweredCurrentQuestion = true; // Mark as answered to prevent re-triggering
    loadNewQuestion();
  }
}

function showExplosion(at) {
  const rect = at.getBoundingClientRect();

  const explosion = document.createElement("img");
  explosion.src = "explod.gif"; // Make sure this path is correct
  explosion.style.width = "50px";
  explosion.style.position = "absolute";
  explosion.style.left = rect.left + "px";
  explosion.style.top = rect.top + "px";
  document.body.appendChild(explosion);

  setTimeout(() => {
    explosion.remove();
  }, 500);
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

    if (top > window.innerHeight) {
      star.remove();
    }
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
