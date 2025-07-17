const mainTitle = document.getElementById("mainTitle");
const displayCounter = document.getElementById("displayCounter");
const progressBar = document.getElementById("progressBar");
const progressPercent = document.getElementById("progressPercent");
const buttonsWrapper = document.getElementById("buttonsWrapper");
const feedbackMessage = document.getElementById("feedbackMessage");

// ============================================================================
// Counter ====================================================================
// ============================================================================

let counter = 0;

function updateDisplay(): void {
  if (!displayCounter) return;

  displayCounter.innerText = counter.toString();
}

const limit = 666;

function updateProgressBar(): void {
  if (!progressBar || !progressPercent) return;

  const percent = Math.floor((counter / limit) * 100);
  const isOverLimit = percent > 100;
  const finalResult = isOverLimit ? 100 : percent;

  progressBar.style.width = `${finalResult}%`;
  progressPercent.innerText = `${finalResult}%`;
}

function add(event: MouseEvent): void {
  const element = event.target as HTMLButtonElement;
  const dataValue = element.dataset.number;

  if (!dataValue) return;

  counter = counter + Number(dataValue);

  saveLocalStorage();

  toggleButtonFeedback(element, "added");

  updateDisplay();
  updateProgressBar();
  verifyPortal();
}

function subtract(event: MouseEvent): void {
  const element = event.target as HTMLButtonElement;
  const dataValue = element.dataset.number;

  if (!dataValue) return;

  const isNegativeNumber = counter - Number(dataValue) < 0;

  if (isNegativeNumber) {
    counter = 0;
  } else {
    counter = counter - Number(dataValue);
  }

  saveLocalStorage();

  toggleButtonFeedback(element, "subtracted");

  updateDisplay();
  updateProgressBar();
}

function resetCounter(event: MouseEvent): void {
  if (counter === 0) return;

  const element = event.target as HTMLButtonElement;

  counter = 0;

  saveLocalStorage();

  toggleButtonFeedback(element, "reseted");

  updateDisplay();
  updateProgressBar();
}

// ============================================================================
// LocalStorage ===============================================================
// ============================================================================

function loadLocalStorage(): void {
  const localCounter = window.localStorage.getItem("counter");

  if (localCounter) {
    counter = Number(localCounter);
  }

  updateDisplay();
  updateProgressBar();
  verifyPortal();
}

loadLocalStorage();

let saveTimeout: number;

function saveLocalStorage(): void {
  clearTimeout(saveTimeout);

  window.localStorage.setItem("counter", counter.toString());

  if (!feedbackMessage) return;

  feedbackMessage.innerText = "counter saved";

  saveTimeout = setTimeout(() => {
    feedbackMessage.innerText = "";
  }, 500);
}

// ============================================================================
// Button Generation ==========================================================
// ============================================================================

const maxButtons = 15;

function generateButtons(): void {
  for (let index = 1; index <= maxButtons; index++) {
    const newButton = window.document.createElement("button");

    newButton.className = "count-btn";
    newButton.dataset.number = String(index);
    newButton.textContent = index.toString();
    newButton.onclick = add;
    newButton.oncontextmenu = (event) => {
      event.preventDefault();
      subtract(event);
    };

    if (!buttonsWrapper) break;

    buttonsWrapper?.appendChild(newButton);
  }
}

generateButtons();

// ============================================================================
// Animations =================================================================
// ============================================================================

let buttonFeedbackTimeout: number;

type ButtonFeedbackStatus = "added" | "subtracted" | "reseted";

function toggleButtonFeedback(
  element: HTMLButtonElement,
  status: ButtonFeedbackStatus
): void {
  clearTimeout(buttonFeedbackTimeout);

  if (status !== "subtracted") {
    const oppositeStatus: ButtonFeedbackStatus =
      status === "added" ? "subtracted" : "added";

    element.classList.remove(oppositeStatus);
  }

  element.classList.add(status);

  buttonFeedbackTimeout = setTimeout(() => {
    element.classList.remove(status);
  }, 150);
}

function verifyPortal(): void {
  if (!mainTitle) return;

  if (counter >= limit) {
    mainTitle.classList.add("active-portal");
  }
}
