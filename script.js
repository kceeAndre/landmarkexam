// -----------------------------
// Firebase Import
// -----------------------------
import { db } from "./firebase-config.js";
import { ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

// -----------------------------
// START EXAM (on student clicking a subject)
// -----------------------------
window.startExam = function(link, examID) {
    // Fetch exam settings from Firebase
    get(ref(db, "examSettings/" + examID)).then(snapshot => {
        let settings = snapshot.val();

        if (!settings || settings.enabled !== true) {
            showPopup("Exam currently disabled");
            return;
        }

        // Store session data
        sessionStorage.setItem("examLink", link);
        sessionStorage.setItem("examTime", settings.time * 60);
        sessionStorage.setItem("examPassword", settings.password);

        // Go to exam page
        window.location = "exam.html";
    }).catch(err => {
        console.error(err);
        showPopup("Error fetching exam data");
    });
};

// -----------------------------
// CHECK EXAM PASSWORD
// -----------------------------
window.checkPassword = function() {
    let pass = document.getElementById("password").value;
    let storedPass = sessionStorage.getItem("examPassword");

    if (pass === storedPass) {
        startCountdown();
    } else {
        alert("Incorrect password");
    }
};

// -----------------------------
// 10 SECOND COUNTDOWN BEFORE EXAM STARTS
// -----------------------------
window.startCountdown = function() {
    let seconds = 10;
    let interval = setInterval(() => {
        document.getElementById("count").innerHTML = "Exam starting in " + seconds;
        seconds--;

        if (seconds < 0) {
            clearInterval(interval);
            launchExam();
        }
    }, 1000);
};

// -----------------------------
// LOAD EXAM PAGE
// -----------------------------
window.launchExam = function() {
    document.getElementById("loginBox").style.display = "none";
    document.getElementById("examArea").style.display = "block";

    let link = sessionStorage.getItem("examLink");
    document.getElementById("examFrame").src = link;

    startTimer();
};

// -----------------------------
// MAIN EXAM TIMER
// -----------------------------
window.startTimer = function() {
    let timer = parseInt(sessionStorage.getItem("examTime"));
    let display = document.getElementById("timer");

    let interval = setInterval(() => {
        let minutes = Math.floor(timer / 60);
        let seconds = timer % 60;

        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;

        display.textContent = minutes + ":" + seconds;

        if (timer === 300) alert("⚠ WARNING: 5 minutes remaining!");
        if (timer === 60) alert("⚠ WARNING: 1 minute remaining!");

        if (timer <= 0) {
            clearInterval(interval);
            document.getElementById("timer").innerHTML = "00:00";
            document.getElementById("timerBox").innerHTML = "TIME IS UP! Please scroll to the end and click SUBMIT.";
            alert("Time is up! Please scroll down and submit your exam.");
            return;
        }

        timer--;
    }, 1000);
};

// -----------------------------
// ADMIN LOGIN OVERLAY
// -----------------------------
window.adminLogin = function() {
    document.getElementById("adminOverlay").style.display = "flex";
    document.getElementById("adminPassword").focus();
};

window.closeAdmin = function() {
    document.getElementById("adminOverlay").style.display = "none";
    document.getElementById("adminError").innerHTML = "";
    document.getElementById("adminPassword").value = "";
};

window.verifyAdmin = function() {
    let pass = document.getElementById("adminPassword").value;

    if (pass === "Knightmare2026#") {
        window.location = "admin.html";
    } else {
        let error = document.getElementById("adminError");
        error.innerHTML = "Wrong Admin Password";
        let box = document.getElementById("adminLoginBox");
        box.classList.add("shake");
        setTimeout(() => box.classList.remove("shake"), 500);
    }
};

// PRESS ENTER TO LOGIN
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        if (document.getElementById("adminOverlay").style.display === "flex") {
            verifyAdmin();
        }
    }
});

// -----------------------------
// CUSTOM POPUP
// -----------------------------
window.showPopup = function(message) {
    let old = document.getElementById("customPopup");
    if (old) old.remove();

    let popup = document.createElement("div");
    popup.id = "customPopup";
    popup.innerHTML = message;
    document.body.appendChild(popup);

    setTimeout(() => popup.remove(), 3000);
};

// -----------------------------
// UTILITY FUNCTIONS
// -----------------------------
window.goBack = function() {
    window.history.back();
};

window.refreshPage = function() {
    location.reload();
};

// -----------------------------
// ATTACH BUTTON EVENTS AFTER DOM LOAD
// -----------------------------
(() => {
    // Admin login button
    const adminBtn = document.getElementById('adminBtn');
    if (adminBtn) adminBtn.addEventListener('click', adminLogin);

    // Admin login submit button
    const adminLoginSubmit = document.getElementById('adminLoginSubmit');
    if (adminLoginSubmit) adminLoginSubmit.addEventListener('click', verifyAdmin);

    // Admin login cancel button
    const adminLoginCancel = document.getElementById('adminLoginCancel');
    if (adminLoginCancel) adminLoginCancel.addEventListener('click', closeAdmin);

    // Back buttons
    const backBtn = document.getElementById('backBtn');
    if (backBtn) backBtn.addEventListener('click', goBack);

    // Subject links (all <a class="subject">)
    const subjects = document.querySelectorAll('.subject');
    subjects.forEach(sub => {
        const link = sub.dataset.link;
        const examID = sub.dataset.examid;
        sub.addEventListener('click', () => startExam(link, examID));
    });
})();
