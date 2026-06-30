const firebaseConfig = {
  apiKey: "AIzaSyDFC_FzA8r_TD03grYSGGfFubsE90xdU2s",
  authDomain: "twitch-knobs.firebaseapp.com",
  databaseURL: "https://twitch-knobs-default-rtdb.firebaseio.com",
  projectId: "twitch-knobs",
  storageBucket: "twitch-knobs.firebasestorage.app",
  messagingSenderId: "172717259045",
  appId: "1:172717259045:web:1f1c901facb66410fc82cc"
};

// INIT FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log("Sliders initialized");

// -----------------------------
// CHANNELS
// -----------------------------
const channels = ["vox", "bass", "guitar", "snare"];

// -----------------------------
// CONTROLS
// -----------------------------
const controls = [
  { key: "r", label: "Red", min: 0, max: 1, step: 0.001 },
  { key: "g", label: "Green", min: 0, max: 1, step: 0.001 },
  { key: "b", label: "Blue", min: 0, max: 1, step: 0.001 },
  { key: "x", label: "X Tweak", min: 0, max: 1, step: 0.001 },
  { key: "y", label: "Y Tweak", min: 0, max: 1, step: 0.001 },
  { key: "div", label: "Divisions", min: 2, max: 10, step: 1 }
];

const app = document.getElementById("app");

// -----------------------------
// FORMAT DISPLAY
// -----------------------------
function format(control, value) {
  if (control.step === 1) return Math.round(value);
  return Number(value).toFixed(3);
}

// -----------------------------
// CREATE SLIDER
// -----------------------------
function createSlider(channel, control) {
  const wrapper = document.createElement("div");
  wrapper.className = "control";

  const id = `${channel}-${control.key}`;
  const path = `${channel}/${control.key}`;

  const defaultValue = control.step === 1 ? 2 : 0;

  wrapper.innerHTML = `
    <div class="label-row">
      <span>${control.label}</span>
      <span class="value" id="${id}-val">${format(control, defaultValue)}</span>
    </div>

    <input
      type="range"
      id="${id}"
      min="${control.min}"
      max="${control.max}"
      step="${control.step}"
      value="${defaultValue}"
    />
  `;

  const slider = wrapper.querySelector("input");
  const display = wrapper.querySelector(".value");

  // -----------------------------
  // SEND TO FIREBASE (SMOOTH)
  // -----------------------------
  slider.addEventListener("input", () => {
    const value = Number(slider.value);
    display.textContent = format(control, value);
    db.ref(path).set(value);
  });

  // -----------------------------
  // RECEIVE FROM FIREBASE
  // -----------------------------
  db.ref(path).on("value", (snap) => {
    const val = snap.val();
    if (val === null || val === undefined) return;

    const num = Number(val);

    if (!isNaN(num)) {
      slider.value = num;
      display.textContent = format(control, num);
    }
  });

  return wrapper;
}

// -----------------------------
// CREATE PANEL
// -----------------------------
function createPanel(channel) {
  const panel = document.createElement("div");
  panel.className = "panel";

  const title = document.createElement("h2");
  title.textContent = channel.toUpperCase();

  panel.appendChild(title);

  controls.forEach(control => {
    panel.appendChild(createSlider(channel, control));
  });

  app.appendChild(panel);
}

// -----------------------------
// INIT APP
// -----------------------------
channels.forEach(createPanel);
