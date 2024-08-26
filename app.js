const bells = new Audio("./sounds/bell.wav");
const clickSound = new Audio("./sounds/click.mp3");
const startBtn = document.querySelector(".btn-start");
const pauseBtn = document.querySelector(".btn-pause");
const resetBtn = document.querySelector(".btn-reset");
const minutesDisplay = document.querySelector(".minutes");
const secondsDisplay = document.querySelector(".seconds");
const timerInput = document.getElementById("timerInput");
const setTimerBtn = document.getElementById("setTimer");
const notification = document.getElementById("notification");
const leftSemi = document.querySelector(".semi-circle:nth-child(1)");
const rightSemi = document.querySelector(".semi-circle:nth-child(2)");
let myInterval;
let totalSeconds;
let isPaused = false;
let isRunning = false;

let INITIAL_TIME = 25 * 60;

const formatTime = (time) => (time < 10 ? `0${time}` : time);

const updateDisplay = () => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  minutesDisplay.textContent = formatTime(minutes);
  secondsDisplay.textContent = formatTime(seconds);

  const progress = 1 - totalSeconds / INITIAL_TIME;
  const degrees = progress * 360;

  if (degrees <= 180) {
    rightSemi.style.transform = `rotate(${degrees}deg)`;
    leftSemi.style.transform = "rotate(0deg)";
  } else {
    rightSemi.style.transform = "rotate(180deg)";
    leftSemi.style.transform = `rotate(${degrees - 180}deg)`;
  }
};

const showNotification = (message) => {
  notification.textContent = message;
  notification.classList.remove("hidden");
  setTimeout(() => {
    notification.classList.add("hidden");
  }, 2000);
};

const playClickSound = () => {
  clickSound.currentTime = 0;
  clickSound.play();
};

const startTimer = () => {
  isRunning = true;
  myInterval = setInterval(() => {
    if (totalSeconds > 0) {
      totalSeconds--;
      updateDisplay();
    } else {
      clearInterval(myInterval);
      bells.play();
      isRunning = false;
      startBtn.innerHTML = '<i class="fas fa-play"></i>';
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      isPaused = false;
      showNotification(
        "Pomodoro finished! Click start to begin a new session or reset to modify the time."
      );
    }
  }, 1000);
};

const appTimer = () => {
  playClickSound();
  if (!isRunning) {
    if (startBtn.innerHTML.includes("fa-play")) {
      totalSeconds = INITIAL_TIME;
      startTimer();
      startBtn.innerHTML = '<i class="fas fa-stop"></i>';
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
      clearInterval(myInterval);
      startBtn.innerHTML = '<i class="fas fa-play"></i>';
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      isPaused = false;
      isRunning = false;
    }
  } else {
    showNotification(
      "Pomodoro is already running. Click reset to start a new session or pause to pause the current one."
    );
  }
};

const pauseTimer = () => {
  playClickSound();
  if (isRunning || isPaused) {
    if (!isPaused) {
      clearInterval(myInterval);
      pauseBtn.innerHTML = '<i class="fas fa-play"></i>';
      isPaused = true;
      isRunning = false;
      showNotification("Timer paused. Click the pause button again to resume.");
    } else {
      startTimer();
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      isPaused = false;
      showNotification("Timer resumed.");
    }
  }
};

const resetTimer = () => {
  playClickSound();
  clearInterval(myInterval);
  totalSeconds = INITIAL_TIME;
  updateDisplay();
  startBtn.innerHTML = '<i class="fas fa-play"></i>';
  pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
  isPaused = false;
  isRunning = false;
  showNotification("Timer reset. Click start to begin a new Pomodoro session.");
};

const setTimer = () => {
  playClickSound();
  const newTime = parseInt(timerInput.value);
  if (newTime > 0 && newTime <= 60) {
    INITIAL_TIME = newTime * 60;
    totalSeconds = INITIAL_TIME;
    updateDisplay();
    resetTimer();
  } else {
    showNotification("Please enter a valid time between 1 and 60 minutes.");
  }
};

startBtn.addEventListener("click", appTimer);
pauseBtn.addEventListener("click", pauseTimer);
resetBtn.addEventListener("click", resetTimer);
setTimerBtn.addEventListener("click", setTimer);

totalSeconds = INITIAL_TIME;
updateDisplay();
