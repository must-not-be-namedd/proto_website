const ship = document.querySelector("#ship");
const bullet = document.querySelector("#bullet");
const asteroidContainer = document.querySelector("#asteroid"); // FIX: Reverted to original ID 'asteroid'
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
let hasAnsweredCurrentQuestion = false; // Flag to track if the current question has been answered

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

window.addEventListener("load", () => {
  loadNewQuestion(); // Load the first question when the game starts
  setInterval(spawnAsteroids, 2000);
  setInterval(moveAsteroids, 50);
  spawnInitialStars(100);
});

window.addEventListener("click", fire);

window.addEventListener("mousemove", (e) => {
  ship_left = e.x;
  // Ensure the ship stays within the visible window boundaries
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
});

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowLeft") ship_left -= move_inter;
  if (e.key === "ArrowRight") ship_left += move_inter;
  if (e.key === " ") fire();
  // Constrain ship movement
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
});

// Touch-based horizontal ship movement for mobile devices
window.addEventListener("touchmove", (e) => {
  const touchX = e.touches[0].clientX;
  ship_left = touchX;
  ship_left = Math.max(0, Math.min(ship_left, window.innerWidth - ship.offsetWidth));
  ship.style.left = ship_left + "px";
});

function loadNewQuestion() {
  hasAnsweredCurrentQuestion = false; // Reset the flag for the new question

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
  currentOptions = [...currentQuestion.options];
}

function endGame() {
  questionBox.textContent = `Game Over! Final Score: ${score} out of ${maxQuestions} questions answered.`;
  // Remove remaining asteroids
  const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
  allAsteroids.forEach(a => a.remove());

  // Optionally: disable firing
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

  // Set a default bullet speed; increase it if mobile is detected
  let bulletSpeed = 10;
  const isMobile = /Mobi|Android/i.test(navigator.userAgent);
  if (isMobile) bulletSpeed = 25; // Faster bullet speed for mobile

  let tid = setInterval(() => {
    bullet_top -= bulletSpeed;
    bullet.style.top = bullet_top + "px";

    const asteroids = asteroidContainer.querySelectorAll(".asteroid");

    asteroids.forEach((at) => {
      if (isCollapsed(bullet, at)) {
        showExplosion(at);
        // Remove all asteroids once one is hit, whether it's correct or not
        const allAsteroids = asteroidContainer.querySelectorAll(".asteroid");
        allAsteroids.forEach((asteroid) => asteroid.remove());

        // Get the text content from the span inside the asteroid div
        const asteroidTextElement = at.querySelector(".asteroid-text");
        if (asteroidTextElement && asteroidTextElement.textContent.trim().toLowerCase() === currentQuestion.answer.toLowerCase()) {
          score++;
        }

        scoreDisplay.textContent = "Score: " + score;
        hasAnsweredCurrentQuestion = true; // Mark as answered

        clearInterval(tid);
        bullet.style.display = "none";
        loadNewQuestion(); // Load next question immediately after a hit
        return; // Exit the forEach loop after handling the collision
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
  // Only spawn if there are options left for the current question
  // and the question hasn't been answered yet (to prevent spawning after a hit)
  if (currentOptions.length > 0 && !hasAnsweredCurrentQuestion) {
    const opt = currentOptions.shift(); // Use shift to get the first element and remove it
    const at = document.createElement("div");
    at.classList.add("asteroid");

    // Create the image for the rock GIF
    const rockImg = document.createElement("img");
    rockImg.src = "rock1.gif"; // Set the path to your rock GIF
    rockImg.alt = "Asteroid";
    rockImg.classList.add("asteroid-image"); // Add a class for CSS styling

    // Create a span for the text option
    const optionText = document.createElement("span");
    optionText.classList.add("asteroid-text"); // Add a class for CSS styling
    optionText.textContent = opt; // Set the question option text

    // Append both the image and the text to the asteroid div
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
    top += 3;
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
  explosion.src = "explod.gif"; // Path to your explosion image
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
