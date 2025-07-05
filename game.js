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

// Store the asteroid spawning interval ID
let asteroidSpawnIntervalId;

const questions = [
  // General CS Knowledge & Fun Facts (Google, Instagram, Social Media) - START
  {
    question: "Which iconic tech company, known for its search engine, was originally named 'BackRub' before its current, more recognizable name?",
    options: ["Microsoft", "Yahoo", "Google"],
    answer: "Google"
  },
  {
    question: "What major online platform, originally conceived as a dating site, transformed into the world's most popular video-sharing website?",
    options: ["TikTok", "Vimeo", "YouTube"],
    answer: "YouTube"
  },
  {
    question: "Which popular social media app, primarily focused on photo and video sharing, was acquired by Facebook for approximately $1 billion in 2012?",
    options: ["Snapchat", "TikTok", "Instagram"],
    answer: "Instagram"
  },
  {
    question: "What was the initial name of the famous social networking platform that launched in 2004, designed for college students?",
    options: ["Twitter", "MySpace", "Thefacebook"],
    answer: "Thefacebook"
  },
  {
    question: "What term is used for unwanted and unsolicited electronic messages, often sent in bulk, notoriously known as 'junk mail'?",
    options: ["Phishing", "Spam", "Malware"],
    answer: "Spam"
  },
  {
    question: "Which social media platform is known for its short, text-based posts originally limited to 140 characters, now often called 'X'?",
    options: ["Facebook", "LinkedIn", "Twitter"],
    answer: "Twitter"
  },
  {
    question: "Before it became a massive video platform, what was YouTube's original idea when it was founded in 2005?",
    options: ["An online dating service", "A photo-sharing site", "An e-commerce marketplace"],
    answer: "An online dating service"
  },
  {
    question: "What concept describes delivering computing services (like servers, storage, and software) over the internet, rather than running them locally?",
    options: ["Local Computing", "Cloud Computing", "Peer-to-Peer Computing"],
    answer: "Cloud Computing"
  },

  // Security & Networking Essentials
  {
    question: "What network security system monitors and filters network traffic, acting as a barrier to protect computers from unauthorized access?",
    options: ["Antivirus Software", "Firewall", "VPN"],
    answer: "Firewall"
  },
  {
    question: "What process transforms readable information into an unreadable format to secure it from unauthorized viewing?",
    options: ["Compression", "Encryption", "Hashing"],
    answer: "Encryption"
  },
  {
    question: "What small data file is stored by a website on your browser to remember information about you, like login status or preferences?",
    options: ["Cache", "Cookie", "Log File"],
    answer: "Cookie"
  },
  {
    question: "What deceptive online tactic attempts to trick users into revealing sensitive information, often through fake emails or websites?",
    options: ["Hacking", "Phishing", "Spamming"],
    answer: "Phishing"
  },
  {
    question: "What type of computer network connects devices over a relatively small area, suchs as a single home, office, or school?",
    options: ["Wide Area Network (WAN)", "Local Area Network (LAN)", "Metropolitan Area Network (MAN)"],
    answer: "Local Area Network (LAN)"
  },

  // Core Concepts & Foundations (Moved to End)
  {
    question: "What primary function does RAM perform in a computer, often described as its 'short-term memory'?",
    options: ["Permanent Storage", "Temporary Data Access", "Graphics Processing"],
    answer: "Temporary Data Access"
  },
  {
    question: "Which programming language, known for its clear syntax, is widely used for web development, data analysis, and automation?",
    options: ["Java", "C++", "Python"],
    answer: "Python"
  },
  {
    question: "What is the systematic process of finding and fixing errors in computer code?",
    options: ["Compiling", "Debugging", "Executing"],
    answer: "Debugging"
  },
  {
    question: "What fundamental web technology gives webpages their interactivity and dynamic behavior, like clickable buttons and animations?",
    options: ["HTML", "CSS", "JavaScript"],
    answer: "JavaScript"
  },
  {
    question: "What unique address identifies a webpage or resource on the internet, typically starting with 'http://' or 'https://'?",
    options: ["IP Address", "URL", "MAC Address"],
    answer: "URL"
  },
  {
    question: "What type of storage allows a computer to store data permanently, even when the power is turned off, like photos on your phone?",
    options: ["Volatile Memory", "Solid State Drive (SSD)", "Cache Memory"],
    answer: "Solid State Drive (SSD)"
  },
  {
    question: "What is the most basic unit of information in computing, represented as either a 0 or a 1?",
    options: ["Byte", "Bit", "Kilobyte"],
    answer: "Bit"
  },
  {
    question: "What specialized computer component is primarily responsible for generating images and visuals for your screen, especially for gaming and video?",
    options: ["Motherboard", "Graphics Processing Unit (GPU)", "Power Supply Unit (PSU)"],
    answer: "Graphics Processing Unit (GPU)"
  },
  {
    question: "What is a step-by-step set of instructions that a computer follows to solve a problem or perform a task?",
    options: ["Syntax", "Algorithm", "Variable"],
    answer: "Algorithm"
  },
  {
    question: "What software manages a computer's hardware and software resources, allowing other programs to run?",
    options: ["Application Software", "Operating System", "Utility Software"],
    answer: "Operating System"
  }
];

// Array to keep track of asteroid positions to prevent overlap
const activeAsteroidPositions = [];
// IMPORTANT: Ensure these match the actual width/height of your .asteroid in CSS
const ASTEROID_WIDTH = 100;
const ASTEROID_HEIGHT = 100;


window.addEventListener("load", () => {
  loadNewQuestion();
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

  if (asteroidSpawnIntervalId) {
    clearInterval(asteroidSpawnIntervalId);
  }

  if (questionCount > maxQuestions) {
    endGame();
    return;
  }

  const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
  allAsteroids.forEach(a => a.remove());

  // Clear active asteroid positions for the new question
  activeAsteroidPositions.length = 0;

  currentQuestion = questions[Math.floor(Math.random() * questions.length)];
  questionBox.textContent = "Question: " + currentQuestion.question;
  currentOptions = [...currentQuestion.options];

  let optionsSpawned = 0;
  if (currentOptions.length > 0) {
    spawnAsteroidOption(); // Spawn first one
    optionsSpawned++;

    asteroidSpawnIntervalId = setInterval(() => {
      if (optionsSpawned < currentQuestion.options.length) {
        spawnAsteroidOption();
        optionsSpawned++;
      } else {
        clearInterval(asteroidSpawnIntervalId);
      }
    }, 1000);
  }
}

function endGame() {
  questionBox.textContent = `Game Over! Final Score: ${score} out of ${maxQuestions}.`;
  const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
  allAsteroids.forEach(a => a.remove());
  window.removeEventListener("click", fire);
  window.removeEventListener("keydown", handleKeyDownForFire);

  if (asteroidSpawnIntervalId) {
    clearInterval(asteroidSpawnIntervalId);
  }
  activeAsteroidPositions.length = 0; // Clear positions at game end
}

function handleKeyDownForFire(e) {
  if (e.key === "ArrowLeft") ship_left -= move_inter;
  if (e.key === "ArrowRight") ship_left += move_inter;
  if (e.key === " ") fire();
  ship.style.left = ship_left + "px";
}

window.addEventListener("keydown", handleKeyDownForFire);

function fire() {
  const ship_loc = ship.getBoundingClientRect();
  const nozzleX = ship_loc.left + ship_loc.width / 2 - bullet.offsetWidth / 2;
  const nozzleY = ship_loc.top;

  bullet.style.left = `${nozzleX}px`;
  bullet.style.top = `${nozzleY}px`;
  bullet.style.display = "block";
  bullet_top = nozzleY;

  // Reduced bullet speed from 4000 to 150 for better hit detection and visibility
  const bulletSpeed = 150;

  const tid = setInterval(() => {
    bullet_top -= bulletSpeed;
    bullet.style.top = bullet_top + "px";

    const asteroids = asteroidContainer.querySelectorAll(".asteroid");
    for (const at of asteroids) {
      if (isCollapsed(bullet, at)) {
        showExplosion(at);
        const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
        allAsteroids.forEach(a => a.remove());

        // Clear active asteroid positions after a hit
        activeAsteroidPositions.length = 0;

        const text = at.querySelector(".asteroid-text")?.textContent.trim();
        if (text && text.toLowerCase() === currentQuestion.answer.toLowerCase()) {
          score++;
        }

        scoreDisplay.textContent = "Score: " + score;
        hasAnsweredCurrentQuestion = true;

        clearInterval(tid);
        bullet.style.display = "none";
        loadNewQuestion();
        return;
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

// Function to check for overlap with existing asteroids
function checkOverlap(newRect) {
    for (let i = 0; i < activeAsteroidPositions.length; i++) {
        const existingRect = activeAsteroidPositions[i];
        // Check for overlap on x-axis and y-axis
        if (newRect.left < existingRect.left + existingRect.width &&
            newRect.left + newRect.width > existingRect.left &&
            newRect.top < existingRect.top + existingRect.height &&
            newRect.top + newRect.height > existingRect.top) {
            return true; // Overlap detected
        }
    }
    return false; // No overlap
}


function spawnAsteroidOption() {
  if (currentOptions.length > 0 && !hasAnsweredCurrentQuestion) {
    const opt = currentOptions.shift();
    const at = document.createElement("div");
    at.classList.add("asteroid");

    const img = document.createElement("img");
    img.src = "rock1.gif"; // Ensure this path is correct
    img.alt = "Asteroid";
    img.classList.add("asteroid-image");

    const text = document.createElement("span");
    text.classList.add("asteroid-text");
    text.textContent = opt;

    at.appendChild(img);
    at.appendChild(text);

    // Try to find a non-overlapping position
    let newLeft;
    let attempts = 0;
    const maxAttempts = 50; // Prevent infinite loop

    // Start slightly above the screen to ensure they fully drop down
    const startTop = -ASTEROID_HEIGHT; // Asteroids start off-screen at the top

    do {
        newLeft = Math.random() * (window.innerWidth - ASTEROID_WIDTH);
        var testRect = {
            left: newLeft,
            top: startTop,
            width: ASTEROID_WIDTH,
            height: ASTEROID_HEIGHT
        };
        attempts++;
    } while (checkOverlap(testRect) && attempts < maxAttempts);

    if (attempts === maxAttempts) {
        console.warn("Could not find a non-overlapping position for asteroid. Spawning might overlap.");
    }

    at.style.left = `${newLeft}px`;
    at.style.top = `${startTop}px`;

    asteroidContainer.appendChild(at);

    // Store the position of the newly spawned asteroid for overlap checking
    activeAsteroidPositions.push({
        left: newLeft,
        top: startTop, // Store initial top, moveAsteroids will update actual DOM top
        width: ASTEROID_WIDTH,
        height: ASTEROID_HEIGHT,
        element: at // Store reference to the element to update its position in activeAsteroidPositions
    });
  }
}

function moveAsteroids() {
  const asteroids = asteroidContainer.querySelectorAll(".asteroid");

  for (let i = 0; i < asteroids.length; i++) {
    const at = asteroids[i];
    let top = parseInt(at.style.top) || 0;
    top += 3; // Asteroid drop speed
    at.style.top = top + "px";

    // Update the stored position for overlap checks
    if (activeAsteroidPositions[i] && activeAsteroidPositions[i].element === at) {
      activeAsteroidPositions[i].top = top;
    }


    if (top > window.innerHeight) {
      at.remove();
      // Remove asteroid's position from the active list when it goes off-screen
      // We need to re-index or remove by element reference
      // The for loop means we need to adjust index after splice
      activeAsteroidPositions.splice(i, 1);
      i--; // Decrement i to account for the removed element
    }
  }

  if (asteroidContainer.querySelectorAll(".asteroid").length === 0 &&
      currentOptions.length === 0 &&
      !hasAnsweredCurrentQuestion) {
    hasAnsweredCurrentQuestion = true;
    loadNewQuestion();
  }
}

function showExplosion(at) {
  const rect = at.getBoundingClientRect();
  const explosion = document.createElement("img");
  // Ensure the path to explod.gif is correct
  explosion.src = "explod.gif"; // Or '../images/explod.gif' or whatever your path is
  explosion.style.width = "50px";
  explosion.style.position = "absolute";
  explosion.style.left = rect.left + "px";
  explosion.style.top = rect.top + "px";
  // Add z-index to ensure explosion is on top of other elements
  explosion.style.zIndex = "1000";
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