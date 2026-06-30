const firebaseConfig = {
  apiKey: "AIzaSyDFC_FzA8r_TD03grYSGGfFubsE90xdU2s",
  authDomain: "twitch-knobs.firebaseapp.com",
  databaseURL: "https://twitch-knobs-default-rtdb.firebaseio.com",
  projectId: "twitch-knobs",
  storageBucket: "twitch-knobs.firebasestorage.app",
  messagingSenderId: "172717259045",
  appId: "1:172717259045:web:1f1c901facb66410fc82cc"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log("Firebase connected");

/* =========================
   STREAMER.BOT CONNECTION
   ========================= */

// IMPORTANT: use localhost for testing on same PC
const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", () => {
  console.log("Streamer.bot WebSocket CONNECTED");
});

ws.addEventListener("error", (err) => {
  console.log("Streamer.bot WebSocket ERROR", err);
});

ws.addEventListener("close", () => {
  console.log("Streamer.bot WebSocket CLOSED");
});

/* =========================
   YOUR CONTROLS
   ========================= */

const channels = ["vox", "bass", "guitar", "snare"];

const controls = [
  { key: "r", label: "Red", min: 1, max: 5 },
  { key: "g", label: "Green", min: 1, max: 5 },
  { key: "b", label: "Blue", min: 1, max: 5 },
  { key: "div", label: "Divisions", min: 2, max: 10 },
  { key: "x", label: "X Tweak", min: 1, max: 5 },
  { key: "y", label: "Y Tweak", min: 1, max: 5 }
];

const app = document.getElementById("app");

function createSlider(channel, control) {
  const wrapper = document.createElement("div");

  const id = `${channel}-${control.key}`;
  const path = `${channel}/${control.key}`;

  wrapper.innerHTML = `
    <label>${control.label}: <span id="${id}-val">0</span></label>
    <input type="range" min="${control.min}" max="${control.max}" value="${control.min}" id="${id}">
  `;

  const slider = wrapper.querySelector("input");
  const valueText = wrapper.querySelector("span");

  // UI update only
  slider.addEventListener("input", () => {
    valueText.textContent = slider.value;
  });

  // Firebase update
  slider.addEventListener("change", () => {
    const val = Number(slider.value);
    db.ref(path).set(val);

    // OPTIONAL: send directly to Streamer.bot
    if (ws.readyState === 1) {
      ws.send(JSON.stringify({
        request: "DoAction",
        action: "Set Knob Value",
        args: {
          channel,
          control: control.key,
          value: val
        }
      }));

      console.log("Sent to Streamer.bot:", path, val);
    } else {
      console.log("WebSocket not ready yet");
    }
  });

  // Firebase sync
  db.ref(path).on("value", (snap) => {
    const val = snap.val();
    if (val !== null) {
      slider.value = val;
      valueText.textContent = val;
    }
  });

  return wrapper;
}

function createPanel(channel) {
  const panel = document.createElement("div");
  panel.className = "panel";

  const title = document.createElement("h2");
  title.textContent = channel.toUpperCase();

  panel.appendChild(title);

  controls.forEach(c => panel.appendChild(createSlider(channel, c)));

  app.appendChild(panel);
}

channels.forEach(createPanel);
