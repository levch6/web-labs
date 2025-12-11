const CONFIG = {
  serverLogInterval: 10, // Log to server every N frames
  radius1: 10,
  radius2: 25,
  color1: "yellow",
  color2: "red",
};

// State
let state = {
  running: false,
  frameCount: 0,
  requestId: null,
  circles: [],
  logs: [], // Local storage buffer (in memory, synced to localStorage)
};

// DOM Elements
const elements = {
  playBtn: document.getElementById("play-btn"),
  workArea: document.getElementById("work-area"),
  mainText: document.getElementById("main-text-content"),
  animArea: document.getElementById("anim-area"),
  startBtn: document.getElementById("start-btn"),
  stopBtn: document.getElementById("stop-btn"),
  reloadBtn: document.getElementById("reload-btn"),
  closeBtn: document.getElementById("close-btn"),
  clearBtn: document.getElementById("clear-logs-btn"),
  statusText: document.getElementById("status-text"),
  comparisonContainer: document.getElementById("comparison-container"),
  comparisonTableBody: document.querySelector("#comparison-table tbody"),
  circle1: document.getElementById("circle1"),
  circle2: document.getElementById("circle2"),
};

// Logger
const Logger = {
  log: function (event) {
    const now = new Date();
    const timestamp = now.getFullYear() + '-' +
        String(now.getMonth() + 1).padStart(2, '0') + '-' +
        String(now.getDate()).padStart(2, '0') + ' ' +
        String(now.getHours()).padStart(2, '0') + ':' +
        String(now.getMinutes()).padStart(2, '0') + ':' +
        String(now.getSeconds()).padStart(2, '0') + '.' +
        String(now.getMilliseconds()).padStart(3, '0');

    const logData = {
      id: state.logs.length + 1,
      event: event,
      client_timestamp: timestamp,
    };

    // LocalStorage Logging
    state.logs.push(logData);
    localStorage.setItem("animLogs", JSON.stringify(state.logs));

    // Server Logging (Throttled or Important Events)
    // Log button clicks and collision immediately. Log frames only every Nth time.
    const isFrameLog = event === "frame_update";
    const shouldLogToServer =
      !isFrameLog || state.frameCount % CONFIG.serverLogInterval === 0;

    if (shouldLogToServer) {
      fetch("api/logger.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logData),
      }).catch(console.error); // Fire and forget
    }
  },

  clear: async function () {
    state.logs = [];
    localStorage.removeItem("animLogs");
    
    // Clear server logs
    try {
        await fetch('api/clear_logs.php', { method: 'POST' });
    } catch (e) {
        console.error('Failed to clear server logs', e);
    }
  },

  fetchServerLogs: async function () {
    try {
      const response = await fetch("api/get_logs.php");
      return await response.json();
    } catch (e) {
      console.error("Failed to fetch logs", e);
      return [];
    }
  },
};

// Animation Logic
class Circle {
  constructor(element, radius, x, y, vx, vy, color) {
    this.element = element;
    this.radius = radius;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    // Initial Style
    this.element.style.width = radius * 2 + "px";
    this.element.style.height = radius * 2 + "px";
    this.element.style.backgroundColor = color;
    this.element.style.position = "absolute";
    this.element.style.borderRadius = "50%";
    this.updatePosition();
  }

  update() {
    // Warning: This refers to the instance
    const containerWidth = elements.animArea.clientWidth;
    const containerHeight = elements.animArea.clientHeight;

    // Move
    this.x += this.vx;
    this.y += this.vy;

    // Wall Collision (Bounce)
    if (this.x <= 0 || this.x + this.radius * 2 >= containerWidth) {
      this.vx *= -1;
      // Clamp Position usually good to prevent sticking, but keep simple for now
    }
    if (this.y <= 0 || this.y + this.radius * 2 >= containerHeight) {
      this.vy *= -1;
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = this.x + "px";
    this.element.style.top = this.y + "px";
  }

  // Get center coordinates
  getCenter() {
    return {
      x: this.x + this.radius,
      y: this.y + this.radius,
    };
  }
}

function initCircles() {
  const w = elements.animArea.clientWidth;
  const h = elements.animArea.clientHeight;

  // Circle 1: 10px, Yellow, Middle of Left Wall
  // x = 0, y = h/2 - r
  const c1 = new Circle(
    elements.circle1,
    CONFIG.radius1,
    0,
    h / 2 - CONFIG.radius1,
    2,
    -2, // Randomish initial velocity
    CONFIG.color1
  );

  // Circle 2: 25px, Red, Middle of Top Wall
  // x = w/2 - r, y = 0
  const c2 = new Circle(
    elements.circle2,
    CONFIG.radius2,
    w / 2 - CONFIG.radius2,
    0,
    -1.5,
    2.5,
    CONFIG.color2
  );

  state.circles = [c1, c2];
}

function checkCollision() {
  const c1 = state.circles[0]; // Small (10)
  const c2 = state.circles[1]; // Large (25)

  const cent1 = c1.getCenter();
  const cent2 = c2.getCenter();

  const dx = cent1.x - cent2.x;
  const dy = cent1.y - cent2.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Stop if small circle is COMPLETELY inside large circle
  // dist + r_small <= r_large
  if (distance + c1.radius <= c2.radius) {
    stopAnimation("Collision/Overlap Detected");
  }
}

function gameLoop() {
  if (!state.running) return;

  state.frameCount++;

  // Move
  state.circles.forEach((c) => c.update());

  // Check Logic
  checkCollision();

  // Log Frame
  Logger.log("frame_update");

  if (state.running) {
    state.requestId = requestAnimationFrame(gameLoop);
  }
}

function startAnimation() {
  if (state.running) return;

  if (state.circles.length === 0) initCircles();

  state.running = true;
  elements.startBtn.style.display = "none";
  elements.stopBtn.style.display = "inline-block";
  elements.statusText.textContent = "Status: Running";

  Logger.log("start_button_click");
  gameLoop();
}

function stopAnimation(reason = "User Stopped") {
  state.running = false;
  cancelAnimationFrame(state.requestId);

  elements.startBtn.style.display = "inline-block";
  elements.stopBtn.style.display = "none";
  elements.statusText.textContent = `Status: ${reason}`;

  Logger.log(
    reason === "User Stopped" ? "stop_button_click" : "collision_detected"
  );
}

function reloadAnimation() {
  stopAnimation("Reloaded");
  initCircles();
  // Render initial state
  elements.statusText.textContent = "Status: Reloaded (Positions Reset)";
  Logger.log("reload_button_click");
}

// Event Listeners
// Check for existing logs on load to show Clear button
window.addEventListener('load', () => {
    const savedLogs = JSON.parse(localStorage.getItem('animLogs') || '[]');
    if (savedLogs.length > 0) {
        state.logs = savedLogs;
        elements.clearBtn.style.display = 'inline-block';
    } else {
        elements.clearBtn.style.display = 'none';
    }
});

elements.playBtn.addEventListener("click", () => {
  elements.mainText.style.display = "none";
  elements.workArea.style.display = "block";
  initCircles(); // Initialize positions so they show up
  Logger.log("play_mode_entered");
});

elements.startBtn.addEventListener("click", startAnimation);
elements.stopBtn.addEventListener("click", () => stopAnimation());
elements.reloadBtn.addEventListener("click", reloadAnimation);

elements.closeBtn.addEventListener("click", async () => {
  stopAnimation("Closed");
  elements.workArea.style.display = "none";
  elements.mainText.style.display = "block";

  // Show Comparison
  elements.comparisonContainer.style.display = "block";
  elements.clearBtn.style.display = 'inline-block'; // Show clear button when logs are populated
  await renderComparisonTable();
});

elements.clearBtn.addEventListener('click', async () => {
    if (confirm('Are you sure you want to clear all logs? This cannot be undone.')) {
        await Logger.clear();
        elements.comparisonTableBody.innerHTML = '';
        elements.clearBtn.style.display = 'none';
        elements.comparisonContainer.style.display = 'none';
        alert('Logs cleared!');
    }
});

async function renderComparisonTable() {
  const serverLogs = await Logger.fetchServerLogs();
  const localLogs = JSON.parse(localStorage.getItem("animLogs") || "[]");
  
  // Reverse Order (Newest First)
  localLogs.reverse();

  const tbody = elements.comparisonTableBody;
  tbody.innerHTML = "";

  localLogs.forEach((localLog) => {
    const serverLog = serverLogs.find((sl) => sl.id === localLog.id);

    const tr = document.createElement("tr");

    // ID
    const tdId = document.createElement("td");
    tdId.textContent = localLog.id;
    tr.appendChild(tdId);

    // Event
    const tdEvent = document.createElement("td");
    tdEvent.textContent = localLog.event;
    tr.appendChild(tdEvent);

    // Client Time
    const tdClient = document.createElement("td");
    tdClient.textContent = localLog.client_timestamp;
    tr.appendChild(tdClient);

    // Server Time
    const tdServer = document.createElement("td");
    if (serverLog) {
      tdServer.textContent = serverLog.server_timestamp;
    } else {
      tdServer.textContent = "-";
    }
    tr.appendChild(tdServer);

    tbody.appendChild(tr);
  });
}
