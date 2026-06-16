function renderExamUI() {
    const examContainer = document.getElementById('exam');
    examContainer.innerHTML = `
      <div class="exam-layout">
        <div class="question-section">
          <div class="question-header">
            <strong>Question No. <span id="qno">1</span></strong>
            <span class="time"><strong>Time Left: <span id="timer">180:00</span></strong></span>
          </div>
          <div class="question-body">
            <img id="question-img" src="" alt="Question Image" class="question-img" />
            <div class="options">
              <label><input type="radio" name="option" value="1">option 1</label><br>
              <label><input type="radio" name="option" value="2">option 2</label><br>
              <label><input type="radio" name="option" value="3">option 3</label><br>
              <label><input type="radio" name="option" value="4">option 4</label>
            </div>
            <div class="actions">
              <button onclick="markForReview()">Mark for Review & Next</button>
              <button onclick="clearResponse()">Clear Response</button>
              <button onclick="nextQuestion()">Save & Next</button>
            </div>
          </div>
        </div>

        <div class="sidebar">
          <div class="status-panel">
            <div><span class="status-dot answered"></span> Answered (<span id="answered-count">0</span>)</div>
            <div><span class="status-dot not-answered"></span> Not Answered (<span id="not-answered-count">0</span>)</div>
            <div><span class="status-dot not-visited"></span> Not Visited (<span id="not-visited-count">0</span>)</div>
            <div><span class="status-dot review"></span> Marked for Review (<span id="marked-count">0</span>)</div>
          </div>

          <h4>Choose the questions</h4>


          <div id="question-palette" class="palette"></div>
          <button class="submit-btn" onclick="submitExam()">Submit</button>
        </div>
      </div>
    `;
    loadQuestions();
}

title = sessionStorage.getItem('title');
const sheetName = sessionStorage.getItem('selectedTitle');

let scriptUrl = "";
let marksUrl = "";
let marks = 1;
let nagativemarks = 0.25;
let  examtitle = document.getElementById("head");
let time = 180;

/* URLs */

//ssc
if(title === "ssc"){
  marks = 2;
  nagativemarks = 0.5;
  time = 60;
  scriptUrl = `https://script.google.com/macros/s/AKfycbwRMXg0tTAKHroxN-JL3DKIrD89k99Ckk5F0Dn18bLNLmEydXWYM0muivpEj6Z2TflQ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbxQ2u9rjHy8HQ-urQ_O7aZWhWBITCBbvhU_YSqXe9x1NA3kokNawgTQsYiGxY2oYV8TVw/exec";
  examtitle.textContent = "SSC";
  document.getElementById("q").textContent = "100";
  document.getElementById("t").textContent = "60";
  document.getElementById('m').textContent = marks;
  document.getElementById("nm").textContent = nagativemarks;
  console.log(title, ":is loaing");
}

//Banks
if(title === "bank"){
  time = 60;
  scriptUrl = `https://script.google.com/macros/s/AKfycbyjpneX_rZ5B2vJv8NHxMBnzZn594Q9-RC2pjZKEVQ9dNTnAtdOHrwi3UzV56FEja9g/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbzpJu-hcM-3q3GxTi2m3jL3NFhaZAG5l09DXTdIk-3v0cFXHdZw0U9TWwjMUZufm89-/exec";
  examtitle.textContent = "SSC";
  document.getElementById("q").textContent = "100";
  document.getElementById("t").textContent = "60";
  document.getElementById('m').textContent = marks;
  document.getElementById("nm").textContent = nagativemarks;
  console.log(title, ":is loaing");
}

//mains
else if(title === "mains"){
  marks = 4;
  nagativemarks = 1;
  scriptUrl = `https://script.google.com/macros/s/AKfycbxiMvQgr_9GOwDUsknBUP-YjnDuI84uoFyszUwSZ4FdbENS5eZW65sPxj-a-MsGCaU_/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbz84kzBpjAdAe1HECK8a13Kkq8-9lO1iqWKrOS7sZx9W7SLU-KYoa0MW3J2b6W48THCKQ/exec";
  examtitle.textContent = "Jee Mains";
  document.getElementById("q").textContent = "75";
  document.getElementById("t").textContent = "180";
  document.getElementById("m").textContent = marks;
  document.getElementById("nm").textContent = nagativemarks;
  console.log(title, ":is loaing");
}

//mainspart
else if(title === "mainspart"){
  time = 60;
  marks = 4;
  nagativemarks = 1;
  scriptUrl = `https://script.google.com/macros/s/AKfycbyPrk5lsSfntU1cKJWOOkXLOxuAA0-O6oQ_8F3DOu2b5wONU6s4oRMr5_C5XuExaI5hBw/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbz-_421QJ13LmJ_y7uClrSeK4VqrAa_-Dz0G9PVbhJS5hzS7DmC4Ryr0j43acnp5p5x/exec";
  examtitle.textContent = "Jee Mains Part";
  document.getElementById("q").textContent = "25-30";
  document.getElementById("t").textContent = "60";
  document.getElementById("m").textContent = marks;
  document.getElementById("nm").textContent = nagativemarks;
  console.log(title, ":is loaing");
}

//mainspaper2part
else if(title === "mainspaper2part"){
  time = 60;
  marks = 4;
  nagativemarks = 1;
  scriptUrl = `https://script.google.com/macros/s/AKfycbyxEb81VUKdsUNHV8_hOqTZaQRsIV7WbJ1omQe2d-gED0-6wbIVLH4lto4Cb07Xw4wQ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbwv4xYRMFh4i-Wnb1DTxzzuHOGIf_mB5gaPCgHWVarW8m22xaFR9DWCQlsuyJgxmK7m/exec";
  examtitle.textContent = "Jee Mains Part";
  document.getElementById("q").textContent = "25-30";
  document.getElementById("t").textContent = "60";
  document.getElementById("m").textContent = marks;
  document.getElementById("nm").textContent = nagativemarks;
  console.log(title, ":is loaing");
}





  
let timerInterval;

function startTimer(durationInMinutes) {
  let timeLeft = durationInMinutes * 60; 
  const timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(() => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      alert("Time is up! Exam will be auto-submitted.");
      submitExam();
    }
  }, 1000);
}

function renderPalette() {
  const palette = document.getElementById("question-palette");
  palette.innerHTML = "";

  let counts = {
    answered: 0,
    notAnswered: 0,
    notVisited: 0,
    markedForReview: 0
  };

  for (let i = 0; i < questions.length; i++) {
    const btn = document.createElement("button");
    btn.textContent = i + 1;

    // Determine status
    const visited = visitedQuestions[i];
    const answer = answers[i];

    if (!visited) {
      btn.className = "palette-btn not-visited";
      counts.notVisited++;
    } else if (answer === "review") {
      btn.className = "palette-btn marked";
      counts.markedForReview++;
    } else if (answer === null) {
      btn.className = "palette-btn not-answered";
      counts.notAnswered++;
    } else {
      btn.className = "palette-btn answered";
      counts.answered++;
    }

    btn.onclick = () => {
      saveAnswer();
      currentIndex = i;
      displayQuestion();
    };

    palette.appendChild(btn);
  }

  // Updates the status counts visually
  document.getElementById("answered-count").textContent = counts.answered;
  document.getElementById("not-answered-count").textContent = counts.notAnswered;
  document.getElementById("not-visited-count").textContent = counts.notVisited;
  document.getElementById("marked-count").textContent = counts.markedForReview;
}


let questions = [];
let currentIndex = 0;
let answers = [];
let visitedQuestions = [];

function getQuestionKey(question) {
  return JSON.stringify(question);
}

function shuffleQuestionsOnce(questionsList) {
  const uniqueQuestions = [];
  const seen = new Set();

  for (const question of questionsList) {
    const key = getQuestionKey(question);
    if (seen.has(key)) continue;
    seen.add(key);
    uniqueQuestions.push(question);
  }

  const storageKey = `question-order:${title}:${sheetName || ""}`;
  const savedOrder = sessionStorage.getItem(storageKey);

  if (savedOrder) {
    try {
      const order = JSON.parse(savedOrder);
      if (Array.isArray(order) && order.length === uniqueQuestions.length) {
        const questionMap = new Map(uniqueQuestions.map(question => [getQuestionKey(question), question]));
        const restoredQuestions = order.map(key => questionMap.get(key));
        if (restoredQuestions.every(Boolean)) {
          return restoredQuestions;
        }
      }
    } catch (error) {
      console.warn("Invalid saved question order, reshuffling.", error);
    }
  }

  for (let i = uniqueQuestions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [uniqueQuestions[i], uniqueQuestions[j]] = [uniqueQuestions[j], uniqueQuestions[i]];
  }

  sessionStorage.setItem(storageKey, JSON.stringify(uniqueQuestions.map(getQuestionKey)));
  return uniqueQuestions;
}


function loadQuestions() {
  fetch(scriptUrl)
    .then(res => res.json())
    .then(data => {
      questions = shuffleQuestionsOnce(data);
      answers = new Array(questions.length).fill(null);
      visitedQuestions = new Array(questions.length).fill(false);

      displayQuestion();
      renderPalette();
      startTimer(time);
    })
    .catch(err => {
      console.error("Failed to load questions:", err);
    });
}

function displayQuestion() {
  if (!questions.length) return;
  const q = questions[currentIndex];
  document.getElementById("qno").textContent = currentIndex + 1;
  document.getElementById("question-img").src = q.img_question;

  visitedQuestions[currentIndex] = true; 

  const options = document.getElementsByName("option");
  options.forEach(opt => {
    opt.checked = (answers[currentIndex] === opt.value);
  });

  renderPalette();
}


function nextQuestion() {
  saveAnswer();
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    displayQuestion();
  }
}

function prevQuestion() {
  saveAnswer();
  if (currentIndex > 0) {
    currentIndex--;
    displayQuestion();
  }
}

function saveAnswer() {
  const selected = document.querySelector('input[name="option"]:checked');
  if (selected) {
    answers[currentIndex] = selected.value;
  }
}

function markForReview() {
  answers[currentIndex] = "review";
  nextQuestion();
}


function clearResponse() {
  const selected = document.querySelector('input[name="option"]:checked');
  if (selected) selected.checked = false;
  answers[currentIndex] = null;
}
  
  
function submitExam() {
  if (examSubmitted) return;
  examSubmitted = true;
  clearInterval(timerInterval);
  saveAnswer();
  const unanswered = answers.filter(a => !a).length;
  if (unanswered > 0) {
      const confirmSubmit = confirm(`You have ${unanswered} unanswered questions. Do you still want to submit?`);
      if (!confirmSubmit) {
          examSubmitted = false;
          return;
      }
  }

    let score = 0;
    let correctCount = 0;
    let wrongCount = 0;

    questions.forEach((q, i) => {
    const userAnswer = answers[i];
    if (userAnswer === null || userAnswer === "review") {
        // No marks for unanswered or review
        return;
    }
    if (userAnswer === q.solution.toString()) {
        score += marks;
        correctCount++;
    } else {
        score -= nagativemarks;
        wrongCount++;
    }
    });

  
  showMessage(`Submitted:You scored ${score} out of ${questions.length}`, "green");
  showSubmitCard(questions.length, score, correctCount, wrongCount);
  submitMarks(score);
    
}
const userid = localStorage.getItem('userid');

function showSubmitCard(totalQuestions, marksScored, correct, wrong) {
  document.getElementById("userIdDisplay").innerText = userid || "Not Found";
  document.getElementById("questionsAnswered").innerText = totalQuestions;
  document.getElementById("marksScored").innerText = marksScored;
  document.getElementById("questionsCorrect").innerText = correct;
  document.getElementById("questionsWrong").innerText = wrong;
  document.getElementById("submitCard").style.display = "block";
}

function goBack() {
  window.location.href = "user.html";
}


function submitMarks(score) {
  const exam = sessionStorage.getItem('title');
  const examname = sessionStorage.getItem('selectedTitle');

  const params = new URLSearchParams({
    action: 'submitmarks',
    userid: userid,
    exam: exam,
    examname: examname,
    score: score
  });

  fetch(`${marksUrl}?${params.toString()}`)
    .then(response => response.json())
    .then(data => {
      console.log(data.error || data.success);
      alert(data.error || data.success);
    })
    .catch(error => {
      console.error('Error:', error);
      alert("Failed to submit marks.");
    });
}


document.addEventListener('keydown', function (e) {
  if ((e.key === 'F5') || (e.ctrlKey && e.key === 'r')) {
    e.preventDefault();
  }
});

  // Warn before reload or page close
  window.addEventListener('beforeunload', function (e) {
      e.preventDefault();
  });
  
