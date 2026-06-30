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

const channels = ["vox", "bass", "guitar", "snare"];

const controls = [
  {
    key: "r",
    label: "Red",
    min: 1,
    max: 5,
    step: 0.01
  },
  {
    key: "g",
    label: "Green",
    min: 1,
    max: 5,
    step: 0.01
  },
  {
    key: "b",
    label: "Blue",
    min: 1,
    max: 5,
    step: 0.01
  },
  {
    key: "div",
    label: "Divisions",
    min: 2,
    max: 10,
    step: 1
  },
  {
    key: "x",
    label: "X Tweak",
    min: 1,
    max: 5,
    step: 0.01
  },
  {
    key: "y",
    label: "Y Tweak",
    min: 1,
    max: 5,
    step: 0.01
  }
];

const app = document.getElementById("app");

function formatValue(control, value) {
  if (control.step === 1) {
    return Number(value);
  }
  return Number(value).toFixed(2);
}

function createSlider(channel, control) {
  const wrapper = document.createElement("div");

  const id = `${channel}-${control.key}`;
  const path = `${channel}/${control.key}`;

  wrapper.innerHTML = `
    <label>${control.label}: <span id="${id}-val">${formatValue(control, control.min)}</span></label>
    <input
      type="range"
      id="${id}"
      min="${control.min}"
      max="${control.max}"
      step="${control.step}"
      value="${control.min}">
  `;

  const slider = wrapper.querySelector("input");
  const valueText = wrapper.querySelector("span");

  // Update display and Firebase continuously while dragging
  slider.addEventListener("input", () => {
    const value = Number(slider.value);

    valueText.textContent = formatValue(control, value);

    db.ref(path).set(value);
  });

  // Keep synced with Firebase
  db.ref(path).on("value", (snap) => {
    const val = snap.val();

    if (val !== null && Number(slider.value) !== val) {
      slider.value = val;
      valueText.textContent = formatValue(control, val);
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

  controls.forEach(control => {
    panel.appendChild(createSlider(channel, control));
  });

  app.appendChild(panel);
}

channels.forEach(createPanel);
