let counters = [];
let soundOn = true;

window.onload = () => {
  loadData();
  renderCounters();
  document.body.classList.toggle("dark", localStorage.getItem("theme") === "dark");
};

function playSound() {
  if (!soundOn) return;
  document.getElementById("click-sound").play();
}

function addCounter(name = "Counter", value = 0, size = 1) {
  const id = Date.now();
  counters.push({ id, name, value, size });
  saveData();
  renderCounters();
}

function deleteCounter(id) {
  if (!confirm("Are you sure you want to delete this counter?")) return;
  counters = counters.filter(c => c.id !== id);
  saveData();
  renderCounters();
}

function updateCounter(id, delta) {
  const counter = counters.find(c => c.id === id);
  counter.value += delta * counter.size;
  saveData();
  renderCounters();
  playSound();
}

function updateName(id, newName) {
  const counter = counters.find(c => c.id === id);
  counter.name = newName;
  saveData();
}

function changeStep(id, newSize) {
  const counter = counters.find(c => c.id === id);
  counter.size = Number(newSize);
  saveData();
}

function renderCounters() {
  const container = document.getElementById("counter-container");
  container.innerHTML = "";
  counters.forEach(c => {
    const div = document.createElement("div");
    div.className = "counter-card";
    div.innerHTML = `
      <input class="name-input" value="${c.name}" onchange="updateName(${c.id}, this.value)" />
      <h2>${c.value}</h2>
      <label>Step: <input type="number" value="${c.size}" onchange="changeStep(${c.id}, this.value)" min="1" /></label>
      <div class="counter-controls">
        <button onclick="updateCounter(${c.id}, -1)">➖</button>
        <button onclick="updateCounter(${c.id}, 1)">➕</button>
        <button class="delete" onclick="deleteCounter(${c.id})">🗑 Delete</button>
      </div>
    `;
    container.appendChild(div);
  });
}

function saveData() {
  localStorage.setItem("counters", JSON.stringify(counters));
}

function loadData() {
  const data = localStorage.getItem("counters");
  if (data) counters = JSON.parse(data);
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  const theme = document.body.classList.contains("dark") ? "dark" : "light";
  localStorage.setItem("theme", theme);
}

function toggleSound() {
  soundOn = !soundOn;
  document.getElementById("sound-status").innerText = soundOn ? "On" : "Off";
}

function exportData() {
  const blob = new Blob([JSON.stringify(counters)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "counters.json";
  link.click();
}

function importData(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      counters = JSON.parse(reader.result);
      saveData();
      renderCounters();
    } catch (e) {
      alert("Invalid file!");
    }
  };
  reader.readAsText(file);
}
