const $ = (id) => document.getElementById(id);
const defaults = { happiness: 90, food: 75, energy: 80, score: 0, lastVisit: new Date().toDateString() };
let state;
try { state = { ...defaults, ...JSON.parse(localStorage.getItem("nibbles-save") || "{}") }; }
catch { state = { ...defaults }; }
let sleeping = false, gameActive = false, gameInterval = null, gameTime = 15, soundOn = false;

function save() {
  localStorage.setItem("nibbles-save", JSON.stringify(state));
}
function clamp(n) { return Math.max(0, Math.min(100, n)); }
function updateUI() {
  [["happiness","happy"],["food","food"],["energy","energy"]].forEach(([key,id]) => {
    $(id+"Bar").style.width = state[key] + "%";
    $(id+"Value").textContent = state[key] + "%";
  });
  $("score").textContent = state.score;
  const mood = state.happiness < 30 ? "a little lonely" : state.food < 25 ? "hungry" : state.energy < 20 ? "sleepy" : "happy";
  $("statusText").textContent = sleeping ? "Nibbles is having a nap" : "Nibbles is " + mood;
  save();
}
function say(message, effect="") {
  $("speechBubble").textContent = message;
  $("petEffect").textContent = effect;
  if (effect) setTimeout(() => $("petEffect").textContent = "", 1000);
}
function act(action) {
  if (action === "feed") {
    if (state.food >= 100) return say("My tummy is already full! Thank you ♡");
    state.food = clamp(state.food + 22); state.happiness = clamp(state.happiness + 5);
    sleeping = false; $("petStage").classList.remove("is-sleeping");
    say("Cheeeeeese! My favourite! 🧀", "🧀");
  } else if (action === "pet") {
    state.happiness = clamp(state.happiness + 15);
    sleeping = false; $("petStage").classList.remove("is-sleeping");
    say("Eeee! I love your cuddles! ♡", "♥");
  } else if (action === "play") {
    if (state.energy < 15) return say("I'm too sleepy to play. Can I nap first? 💤");
    state.happiness = clamp(state.happiness + 12); state.energy = clamp(state.energy - 12);
    sleeping = false; $("petStage").classList.remove("is-sleeping");
    say("Yay! That was so much fun! 🎾", "✦");
    $("gameBoard").scrollIntoView({behavior:"smooth",block:"center"});
  } else if (action === "sleep") {
    sleeping = !sleeping;
    $("petStage").classList.toggle("is-sleeping", sleeping);
    if (sleeping) { state.energy = clamp(state.energy + 25); say("Zzz... see you in a little while!"); }
    else say("Good morning! I'm all rested! ☀️");
  }
  updateUI();
}
document.querySelectorAll("[data-action]").forEach(btn => btn.addEventListener("click", () => act(btn.dataset.action)));

$("startGame").addEventListener("click", () => {
  if (gameActive) return;
  gameActive = true; gameTime = 15; state.score = 0;
  $("gamePlaceholder").style.display = "none";
  $("cheeseTarget").style.display = "block";
  $("startGame").textContent = "Game in progress…";
  $("gameTimer").textContent = gameTime + " seconds";
  moveCheese();
  gameInterval = setInterval(() => {
    gameTime--;
    $("gameTimer").textContent = gameTime + " seconds";
    if (gameTime <= 0) {
      clearInterval(gameInterval); gameActive = false;
      $("cheeseTarget").style.display = "none";
      $("gamePlaceholder").style.display = "block";
      $("gamePlaceholder").innerHTML = "🏆<br><span>Game over! You caught " + state.score + " cheese!</span>";
      $("startGame").textContent = "Play again";
      $("gameTimer").textContent = "You did great!";
      state.happiness = clamp(state.happiness + Math.min(15, state.score * 2));
      state.energy = clamp(state.energy - 8);
      say("You caught " + state.score + " cheese! You're amazing!", "⭐");
      updateUI();
    }
  }, 1000);
});
function moveCheese() {
  const board = $("gameBoard"), target = $("cheeseTarget");
  const maxX = Math.max(0, board.clientWidth - 55), maxY = Math.max(0, board.clientHeight - 55);
  target.style.left = (Math.random() * maxX) + "px";
  target.style.top = (Math.random() * maxY) + "px";
}
$("cheeseTarget").addEventListener("click", () => {
  if (!gameActive) return;
  state.score++; $("score").textContent = state.score;
  moveCheese();
  if (soundOn) { try { const a = new AudioContext(), o=a.createOscillator(), g=a.createGain(); o.connect(g);g.connect(a.destination);o.frequency.value=660;g.gain.value=.035;o.start();o.stop(a.currentTime+.08);o.onended=()=>a.close(); } catch {} }
});
$("secretNote").addEventListener("click", () => $("noteDialog").showModal());
$("closeDialog").addEventListener("click", () => $("noteDialog").close());
$("noteDialog").addEventListener("click", e => { if (e.target === $("noteDialog")) $("noteDialog").close(); });
$("soundToggle").addEventListener("click", () => {
  soundOn = !soundOn;
  $("soundToggle").textContent = soundOn ? "♫" : "♪";
  $("soundToggle").style.background = soundOn ? "#f7e4e4" : "#fffaf5";
  say(soundOn ? "Sound effects are on! ✨" : "Quiet mode is on. ♡");
});
if (state.lastVisit !== new Date().toDateString()) {
  state.lastVisit = new Date().toDateString();
  state.happiness = clamp(state.happiness + 3);
  say("You're back! I missed you! ♡");
} else {
  say("Eep! You came to see me! ♡");
}
updateUI();


// Show the native install prompt when the browser says this app is installable.
let installPrompt = null;
const installButton = $("installButton");
window.addEventListener("beforeinstallprompt", (event) => {
  event.preventDefault();
  installPrompt = event;
  installButton.hidden = false;
});
installButton.addEventListener("click", async () => {
  if (!installPrompt) {
    say("Open your browser menu and choose Install app or Add to Home Screen. ♡");
    return;
  }
  installPrompt.prompt();
  await installPrompt.userChoice;
  installPrompt = null;
  installButton.hidden = true;
});
window.addEventListener("appinstalled", () => {
  installButton.hidden = true;
  say("Yay! I'm installed on your device now! ♡", "♥");
});

// Gentle offline-friendly care: needs slowly change while the page is open.
setInterval(() => {
  if (!sleeping) { state.food = clamp(state.food - 1); state.energy = clamp(state.energy - 1); }
  else { state.energy = clamp(state.energy + 2); }
  state.happiness = clamp(state.happiness - (sleeping ? 0 : 0.3));
  updateUI();
}, 60000);

if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./service-worker.js").catch(()=>{}));
}
