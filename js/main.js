const before = document.getElementById("before");
const liner = document.getElementById("liner");
const command = document.getElementById("typer");
const textarea = document.getElementById("texter");
const terminal = document.getElementById("terminal");
const contentscroll = document.getElementById("contentscroll");

let git = 0;
let pw = false;
const commands = [];
let suggestedCommand = null;
let awaitingConfirmation = false;
let awaitingWeatherInput = false;

function scrollToBottom() {
  if (contentscroll) {
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }
}

const commandMap = {
  help: "help",
  aboutme: "aboutme",
  weather: "weather",
  email: "email",
  history: "history",
  sudo: "sudo",
  clear: "clear",
  snake: "snake",
};

setTimeout(function () {
  loopLines(banner, "", 80);
  textarea.focus();
  scrollToBottom();
}, 100);

window.addEventListener("keyup", function (e) {
  enterKey(e);
  scrollToBottom();
});

window.addEventListener("keydown", function () {
  textarea.focus();
  scrollToBottom();
});

document.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

terminal.addEventListener("click", function () {
  textarea.focus();
  scrollToBottom();
});

textarea.addEventListener("input", scrollToBottom);

textarea.value = "";
command.innerHTML = textarea.value;

function enterKey(e) {
  textarea.focus();
  scrollToBottom();

  if (e.keyCode === 181) {
    document.location.reload(true);
  }

  if (e.key === "Tab") {
    e.preventDefault();
    const partial = textarea.value.toLowerCase();
    const matches = Object.keys(commandMap).filter((cmd) =>
      cmd.startsWith(partial),
    );
    if (matches.length === 1) {
      textarea.value = matches[0];
      command.innerHTML = matches[0];
    } else if (matches.length > 1) {
      addLine("<br>", "", 0);
      loopLines(matches, "color2", 80);
      addLine("<br>", "", matches.length * 80 + 100);
    }
    scrollToBottom();
    return;
  }

  if (e.ctrlKey && e.key === "r") {
    e.preventDefault();
    const search = prompt("Reverse search:");
    const match = commands
      .slice()
      .reverse()
      .find((cmd) => cmd.includes(search));
    if (match) {
      textarea.value = match;
      command.innerHTML = match;
    } else {
      addLine("No match found in history.", "error", 100);
    }
    scrollToBottom();
  }

  if (e.keyCode === 13) {
    const input = command.innerHTML.trim();
    const inputLower = input.toLowerCase();
    addLine("[weather@sere1nz]~$" + command.innerHTML, "no-animation", 0);

    if (awaitingWeatherInput) {
      // Process weather city input
      if (input.trim()) {
        processWeatherRequest(input.trim());
        awaitingWeatherInput = false;
      } else {
        addLine("Please enter a valid city name.", "error", 80);
      }
    } else if (awaitingConfirmation && suggestedCommand) {
      if (inputLower === "y") {
        commander(suggestedCommand);
      } else {
        addLine("Cancelled.", "color2", 80);
      }
      awaitingConfirmation = false;
      suggestedCommand = null;
    } else {
      commands.push(command.innerHTML);
      git = commands.length;
      commander(inputLower);
    }

    command.innerHTML = "";
    textarea.value = "";
    scrollToBottom();
  }

  if (e.keyCode === 38 && git !== 0) {
    git -= 1;
    textarea.value = commands[git];
    command.innerHTML = textarea.value;
    scrollToBottom();
  }

  if (e.keyCode === 40 && git !== commands.length) {
    git += 1;
    textarea.value = commands[git] || "";
    command.innerHTML = textarea.value;
    scrollToBottom();
  }
}

function commander(cmd) {
  const args = cmd.toLowerCase().trim().split(' ');
  const command = args[0];
  const params = args.slice(1);
  
  switch (command) {
    case "help":
      loopLines(help, "color2 margin", 80);
      break;
    case "aboutme":
      loopLines(aboutme, "color2 margin", 80);
      break;
    case "weather":
      if (params.length === 0) {
        addLine("Please enter the city name you want to check:", "color2", 160);
        addLine("Example: Jakarta, Bandung, Palembang", "color2", 240);
        addLine("Type the city name and press Enter...", "color2", 320);
        
        // Set weather input mode
        awaitingWeatherInput = true;
      } else {
        const cityName = params.join(' ');
        processWeatherRequestSilent(cityName);
      }
      break;
    case "history":
      addLine("<br>", "", 0);
      loopLines(commands, "color2", 80);
      addLine("<br>", "command", 80 * commands.length + 50);
      break;
    case "email":
      addLine(
        'Opening mailto:<a href="mailto:hasbullah4869@gmail.com"> hasbullah4869@gmail.com</a>...',
        "color2",
        80,
      );
      newTab(email);
      break;
    case "clear":
      setTimeout(function () {
        const paragraphs = terminal.querySelectorAll("p");
        paragraphs.forEach((p) => p.remove());
        if (!document.getElementById("before")) {
          const beforeElement = document.createElement("a");
          beforeElement.id = "before";
          terminal.insertBefore(beforeElement, terminal.firstChild);
          before = beforeElement;
        }
        if (typeof banner !== "undefined") {
          loopLines(banner, "", 80);
        }
        textarea.focus();
        scrollToBottom();
      }, 1);
      break;
    case "sudo":
      addLine("Oh no, you're not an admin...", "color2", 0);
      newTab(sudo);
      break;
    case "snake":
      runSnakeGame();
      break;
    default:
      const closest = findClosestCommand(cmd);
      if (closest) {
        suggestedCommand = closest;
        awaitingConfirmation = true;
        addLine(
          `<span class="inherit">Command not found. Did you mean <span class="command">'${closest}'</span>? (y/n)</span>`,
          "error",
          100,
        );
      } else {
        addLine(
          `<span class="inherit">Command not found. Type <span class="command">'help'</span> for available commands.</span>`,
          "error",
          100,
        );
      }
      break;
  }
  scrollToBottom();
}

function newTab(link) {
  setTimeout(function () {
    window.open(link, "_blank");
  }, 500);
}

function addLine(text, style, time) {
  let t = "";
  for (let i = 0; i < text.length; i++) {
    if (text.charAt(i) === " " && text.charAt(i + 1) === " ") {
      t += "&nbsp;&nbsp;";
      i++;
    } else {
      t += text.charAt(i);
    }
  }

  setTimeout(function () {
    const next = document.createElement("p");
    next.innerHTML = t;
    next.className = style;
    before.parentNode.insertBefore(next, before);
    contentscroll.scrollTop = contentscroll.scrollHeight;
  }, time);
}

function loopLines(name, style, time) {
  name.forEach(function (item, index) {
    addLine(item, style, index * time);
  });
  setTimeout(
    function () {
      scrollToBottom();
    },
    name.length * time + 50,
  );
}

function findClosestCommand(input) {
  const threshold = 3;
  let minDist = Infinity;
  let closest = null;
  Object.keys(commandMap).forEach((cmd) => {
    const dist = levenshtein(input, cmd);
    if (dist < minDist && dist <= threshold) {
      minDist = dist;
      closest = cmd;
    }
  });
  return closest;
}

function levenshtein(a, b) {
  const matrix = Array.from({ length: a.length + 1 }, () =>
    Array(b.length + 1).fill(0),
  );
  for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
  for (let j = 0; j <= b.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost,
      );
    }
  }
  return matrix[a.length][b.length];
}

// Process weather request
function processWeatherRequest(cityName) {
  addLine(`🔍 Searching weather data for ${cityName}...`, "color2", 80);
  
  // Fetch weather data asynchronously
  fetchWeatherForCity(cityName).then(data => {
    if (data.error) {
      addLine(`❌ ${data.error}`, "error", 100);
    } else {
      addLine(`✅ Weather data found for ${data.name}, ${data.sys.country}`, "color2", 100);
      updateWeatherDisplay(data);
    }
  }).catch(error => {
    addLine("❌ Failed to fetch weather data. Please try again.", "error", 100);
  });
}

// Process weather request silently (only update info-item)
function processWeatherRequestSilent(cityName) {
  addLine(`🌤️ Updated weather info for ${cityName}`, "color2", 80);
  
  // Fetch weather data asynchronously and only update profile info
  fetchWeatherForCity(cityName).then(data => {
    if (data.error) {
      addLine(`❌ ${data.error}`, "error", 100);
    } else {
      updateWeatherInfoOnly(data);
    }
  }).catch(error => {
    addLine("❌ Failed to fetch weather data. Please try again.", "error", 100);
  });
}

function runSnakeGame() {
  const width = 20,
    height = 10;
  let snake = [{ x: 5, y: 5 }];
  let food = { x: 10, y: 5 };
  let dir = "right";
  let score = 0;
  let interval;
  let gameElement;

  function draw() {
    let screen = `Score: ${score}\n`;
    for (let y = 0; y < height; y++) {
      let row = "";
      for (let x = 0; x < width; x++) {
        if (x === food.x && y === food.y) row += "*";
        else if (snake.some((s) => s.x === x && s.y === y)) row += "O";
        else row += ".";
      }
      screen += row + "\n";
    }

    if (!gameElement) {
      gameElement = document.createElement("p");
      gameElement.className = "color2";
      gameElement.innerHTML = `<pre>${screen}</pre>`;
      before.parentNode.insertBefore(gameElement, before);
    } else {
      gameElement.innerHTML = `<pre>${screen}</pre>`;
    }

    contentscroll.scrollTop = contentscroll.scrollHeight;
  }

  function move() {
    const head = { ...snake[0] };
    switch (dir) {
      case "up":
        head.y--;
        break;
      case "down":
        head.y++;
        break;
      case "left":
        head.x--;
        break;
      case "right":
        head.x++;
        break;
    }

    if (
      head.x < 0 ||
      head.x >= width ||
      head.y < 0 ||
      head.y >= height ||
      snake.some((s) => s.x === head.x && s.y === head.y)
    ) {
      clearInterval(interval);
      gameElement.innerHTML += `<br><span class="error">💀 Game Over! Final Score: ${score}</span>`;
      window.removeEventListener("keydown", keyHandler);
      return;
    }

    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
      score++;
      food = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height),
      };
    } else {
      snake.pop();
    }

    draw();
  }

  function keyHandler(e) {
    switch (e.key) {
      case "ArrowUp":
        if (dir !== "down") dir = "up";
        break;
      case "ArrowDown":
        if (dir !== "up") dir = "down";
        break;
      case "ArrowLeft":
        if (dir !== "right") dir = "left";
        break;
      case "ArrowRight":
        if (dir !== "left") dir = "right";
        break;
      case "Escape":
      case "q":
        clearInterval(interval);
        window.removeEventListener("keydown", keyHandler);
        gameElement.innerHTML += `<br><span class="color2">🛑 Snake game exited.</span>`;
        break;
    }
  }

  window.addEventListener("keydown", keyHandler);
  addLine(
    "🎮 Starting Snake game... Use arrow keys to move. 'q' or Esc to quit.",
    "color2",
    0,
  );
  draw();
  interval = setInterval(move, 250);
}

// Initialize default weather on page load
document.addEventListener('DOMContentLoaded', function() {
  // Load default weather for Bandung after a short delay
  setTimeout(() => {
    if (typeof loadDefaultWeather === 'function') {
      loadDefaultWeather();
    }
  }, 1000);
});
