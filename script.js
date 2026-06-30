const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// INIT FIREBASE
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

console.log("Sliders connected to Firebase");

// -----------------------------
// CONFIG
// -----------------------------

const channels = ["vox", "bass", "guitar", "snare"];

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
// HELPERS
// -----------------------------

function formatValue(control, value) {
  if (control.step === 1) return Math.round(value);
  return Number(value).toFixed(3);
}

function createControl(channel, control) {
  const wrapper = document.createElement("div");
  wrapper.className = "control";

  const id = `${channel}-${control.key}`;
  const path = `${channel}/${control.key}`;

  const defaultValue = control.step === 1 ? 2 : 0;

  wrapper.innerHTML = `
    <div class="label-row">
      <span>${control.label}</span>
      <span class="value" id="${id}-val">${formatValue(control, defaultValue)}</span>
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
  const valueText = wrapper.querySelector(".value");

  // -----------------------------
  // SEND TO FIREBASE (SMOOTH)
  // -----------------------------
  slider.addEventListener("input", () => {
    let value = Number(slider.value);

    // safety clamp
    value = Math.min(control.max, Math.max(control.min, value));

    valueText.textContent = formatValue(control, value);

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
      valueText.textContent = formatValue(control, num);
    }
  });

  return wrapper;
}

// -----------------------------
// BUILD UI
// -----------------------------

function createPanel(channel) {
  const panel = document.createElement("div");
  panel.className = "panel";

  const title = document.createElement("h2");
  title.textContent = channel.toUpperCase();

  panel.appendChild(title);

  controls.forEach(control => {
    panel.appendChild(createControl(channel, control));
  });

  app.appendChild(panel);
}

channels.forEach(createPanel);
