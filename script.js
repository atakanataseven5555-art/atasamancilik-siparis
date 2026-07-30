const visualizer = document.querySelector('#visualizer');
const recordButton = document.querySelector('#recordButton');
const headerRecord = document.querySelector('#headerRecord');
const micButton = document.querySelector('#micButton');
const settingsButton = document.querySelector('#settingsButton');
const settingsPanel = document.querySelector('#settingsPanel');
const status = document.querySelector('.status');
const statusText = document.querySelector('#statusText');
const timer = document.querySelector('#timer');
const toast = document.querySelector('#toast');
const inputLevel = document.querySelector('#inputLevel');

let recording = false;
let muted = false;
let seconds = 0;
let timerId;
let animationId;

const bars = Array.from({ length: 108 }, (_, index) => {
  const bar = document.createElement('span');
  bar.className = 'bar';
  const distance = Math.abs(index - 53.5) / 53.5;
  bar.dataset.base = String(Math.max(3, (1 - distance) * (6 + Math.random() * 22)));
  bar.style.height = `${bar.dataset.base}px`;
  visualizer.appendChild(bar);
  return bar;
});

function formatTime(value) {
  const hours = String(Math.floor(value / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((value % 3600) / 60)).padStart(2, '0');
  const secs = String(value % 60).padStart(2, '0');
  return `${hours}:${minutes}:${secs}`;
}

function animateWave() {
  const strength = Number(inputLevel.value) / 100;
  bars.forEach((bar, index) => {
    const envelope = 1 - Math.abs(index - 53.5) / 64;
    const height = muted ? 3 : Math.max(3, (8 + Math.random() * 92 * strength) * envelope);
    bar.style.height = `${height}px`;
  });
  animationId = window.setTimeout(animateWave, 120);
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  window.setTimeout(() => toast.classList.remove('show'), 2400);
}

function toggleRecording() {
  recording = !recording;
  recordButton.classList.toggle('recording', recording);
  visualizer.classList.toggle('active', recording);
  status.classList.toggle('recording', recording);
  statusText.textContent = recording ? 'KAYIT YAPILIYOR' : 'KAYDA HAZIR';
  recordButton.querySelector('.record-label').textContent = recording ? 'KAYDI BİTİR' : 'KAYDI BAŞLAT';
  recordButton.setAttribute('aria-label', recording ? 'Kaydı bitir' : 'Kaydı başlat');

  if (recording) {
    animateWave();
    timerId = window.setInterval(() => { seconds += 1; timer.textContent = formatTime(seconds); }, 1000);
  } else {
    window.clearInterval(timerId);
    window.clearTimeout(animationId);
    bars.forEach(bar => { bar.style.height = `${bar.dataset.base}px`; });
    if (seconds > 0) showToast(`${formatTime(seconds)} uzunluğundaki kaydın hazır.`);
    seconds = 0;
    timer.textContent = formatTime(seconds);
  }
}

recordButton.addEventListener('click', toggleRecording);
headerRecord.addEventListener('click', () => {
  document.querySelector('#studio').scrollIntoView({ behavior: 'smooth' });
  if (!recording) window.setTimeout(toggleRecording, 450);
});
micButton.addEventListener('click', () => {
  muted = !muted;
  micButton.classList.toggle('active', muted);
  showToast(muted ? 'Mikrofon sessize alındı.' : 'Mikrofon yeniden açıldı.');
});
settingsButton.addEventListener('click', () => {
  const open = settingsPanel.hasAttribute('hidden');
  settingsPanel.toggleAttribute('hidden');
  settingsPanel.classList.toggle('show', open);
  settingsButton.classList.toggle('active', open);
});
