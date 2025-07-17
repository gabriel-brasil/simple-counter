"use strict";
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
function updateDisplay() {
    if (!displayCounter)
        return;
    displayCounter.innerText = counter.toString();
}
const limit = 666;
function updateProgressBar() {
    if (!progressBar || !progressPercent)
        return;
    const percent = Math.floor((counter / limit) * 100);
    const isOverLimit = percent > 100;
    const finalResult = isOverLimit ? 100 : percent;
    progressBar.style.width = `${finalResult}%`;
    progressPercent.innerText = `${finalResult}%`;
}
function add(event) {
    const element = event.target;
    const dataValue = element.dataset.number;
    if (!dataValue)
        return;
    counter = counter + Number(dataValue);
    saveLocalStorage();
    toggleButtonFeedback(element, "added");
    updateDisplay();
    updateProgressBar();
    verifyPortal();
}
function subtract(event) {
    const element = event.target;
    const dataValue = element.dataset.number;
    if (!dataValue)
        return;
    const isNegativeNumber = counter - Number(dataValue) < 0;
    if (isNegativeNumber) {
        counter = 0;
    }
    else {
        counter = counter - Number(dataValue);
    }
    saveLocalStorage();
    toggleButtonFeedback(element, "subtracted");
    updateDisplay();
    updateProgressBar();
}
function resetCounter(event) {
    if (counter === 0)
        return;
    const element = event.target;
    counter = 0;
    saveLocalStorage();
    toggleButtonFeedback(element, "reseted");
    updateDisplay();
    updateProgressBar();
}
// ============================================================================
// LocalStorage ===============================================================
// ============================================================================
function loadLocalStorage() {
    const localCounter = window.localStorage.getItem("counter");
    if (localCounter) {
        counter = Number(localCounter);
    }
    updateDisplay();
    updateProgressBar();
    verifyPortal();
}
loadLocalStorage();
let saveTimeout;
function saveLocalStorage() {
    clearTimeout(saveTimeout);
    window.localStorage.setItem("counter", counter.toString());
    if (!feedbackMessage)
        return;
    feedbackMessage.innerText = "counter saved";
    saveTimeout = setTimeout(() => {
        feedbackMessage.innerText = "";
    }, 500);
}
// ============================================================================
// Button Generation ==========================================================
// ============================================================================
const maxButtons = 15;
function generateButtons() {
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
        if (!buttonsWrapper)
            break;
        buttonsWrapper === null || buttonsWrapper === void 0 ? void 0 : buttonsWrapper.appendChild(newButton);
    }
}
generateButtons();
// ============================================================================
// Animations =================================================================
// ============================================================================
let buttonFeedbackTimeout;
function toggleButtonFeedback(element, status) {
    clearTimeout(buttonFeedbackTimeout);
    if (status !== "subtracted") {
        const oppositeStatus = status === "added" ? "subtracted" : "added";
        element.classList.remove(oppositeStatus);
    }
    element.classList.add(status);
    buttonFeedbackTimeout = setTimeout(() => {
        element.classList.remove(status);
    }, 150);
}
function verifyPortal() {
    if (!mainTitle)
        return;
    if (counter >= limit) {
        mainTitle.classList.add("active-portal");
    }
}
