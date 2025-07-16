const display = document.getElementById("display");
const addBtn = document.getElementById("add");
const subtractBtn = document.getElementById("subtract");
const resetBtn = document.getElementById("reset");
const feedback = document.getElementById("feedback");

// Counter

let counter = 0;

function add() {
  counter++;
}

function subtract() {
  if (counter <= 0) {
    counter = 0;
  } else {
    counter--;
  }
}

function reset() {
  counter = 0;
}

// Display

function updateDisplay() {
  display.innerText = counter;
}

// Events

let timeout;

addBtn.addEventListener("click", () => {
  add();

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    saveLocalStorage();
  }, 1000);

  updateDisplay();
});

subtractBtn.addEventListener("click", () => {
  subtract();

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    saveLocalStorage();
  }, 1000);

  updateDisplay();
});

resetBtn.addEventListener("click", () => {
  reset();

  clearTimeout(timeout);

  timeout = setTimeout(() => {
    saveLocalStorage();
  }, 1000);

  updateDisplay();
});

// LocalStorage

function loadLocalStorage() {
  const localCounter = window.localStorage.getItem("counter");

  if (localCounter) {
    counter = localCounter;
  }

  updateDisplay();
}
loadLocalStorage();

function saveLocalStorage() {
  window.localStorage.setItem("counter", counter);

  feedback.innerText = "contador salvo";

  setTimeout(() => {
    feedback.innerText = "";
  }, 1000);
}
