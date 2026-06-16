/***********************
 GLOBAL CONFIG
************************/
title = sessionStorage.getItem('title');
const sheetName = sessionStorage.getItem('selectedTitle');

let scriptUrl = "";
let marksUrl = "";
let marks = 1;
let negativeMarks = 0.25;
let time = 180;

let examSubmitted = false;
let timerInterval;

/***********************
 EXAM TYPE CONFIG
************************/
if (title === "mainspaper2") {
  marks = 4;
  negativeMarks = 1;
  time = 180;

  scriptUrl = `https://script.google.com/macros/s/AKfycbx_kbzl8V0jbI6Yoo_qqqD5au5sgSYKnvb3bphg70xv58H3wZACqSCAKhQv6wLUaah3yA/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbzTBO-ZozGzPp6l5LMJAyzS9lSVzOk13lLqQLYxfPaEG2Ifqova0IdvHrfXvJ4P3aDm/exec";

  document.getElementById("head").textContent = "JEE Main";
  document.getElementById("q").textContent = questions.length; // Will be updated after loading
  document.getElementById("t").textContent = "180";
}

/***********************
 STATE
************************/
let questions = [];
let answers = [];
let visitedQuestions = [];
let currentIndex = 0;

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

/***********************
 UI RENDER
************************/
function renderExamUI() {
  document.getElementById("exam").innerHTML = `
    <div class="exam-layout">
      <div class="question-section">
        <div class="question-header">
          <strong>Question No. <span id="qno">1</span></strong>
          <span class="time"><strong>Time Left: <span id="timer">180:00</span></strong></span>
        </div>

        <div class="question-body">
          <img id="question-img" class="question-img"/>
          <div id="options-container" class="options"></div>

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
          <div><span class="status-dot review"></span> Marked (<span id="marked-count">0</span>)</div>
        </div>

        <h4>Choose Question</h4>
        <div id="question-palette" class="palette"></div>
        <button class="submit-btn" onclick="submitExam()">Submit</button>
      </div>
    </div>
  `;

  loadQuestions();
}

/***********************
 TIMER
************************/
function startTimer() {
  let timeLeft = time * 60;
  const timerDisplay = document.getElementById("timer");

  timerInterval = setInterval(() => {
    const min = Math.floor(timeLeft / 60);
    const sec = timeLeft % 60;
    timerDisplay.textContent = `${String(min).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
    timeLeft--;

    if (timeLeft < 0) {
      clearInterval(timerInterval);
      submitExam();
    }
  }, 1000);
}

/***********************
 LOAD QUESTIONS
************************/
function loadQuestions() {
  fetch(scriptUrl)
    .then(res => res.json())
    .then(data => {
      if (!Array.isArray(data) || data.length === 0) {
        alert("No questions found. Please check the sheet.");
        return;
      }

      questions = shuffleQuestionsOnce(data);
      answers = new Array(questions.length).fill(null);
      visitedQuestions = new Array(questions.length).fill(false);
      currentIndex = 0;

      noquestions = questions.length;
      document.getElementById("q").textContent = questions.length;
      document.getElementById("questionsAnswered").textContent = questions.length;

      displayQuestion();   // ✅ SAFE NOW
      renderPalette();
      startTimer();
    })
    .catch(err => {
      console.error("Failed to load questions:", err);
    });
}


/***********************
 DISPLAY QUESTION
************************/
function displayQuestion() {
  // ✅ SAFETY CHECK
  if (!questions || questions.length === 0) {
    console.warn("Questions not loaded yet");
    return;
  }

  if (currentIndex < 0 || currentIndex >= questions.length) {
    console.error("Invalid question index:", currentIndex);
    return;
  }

  const q = questions[currentIndex];
  visitedQuestions[currentIndex] = true;

  document.getElementById("qno").textContent = currentIndex + 1;
  document.getElementById("question-img").src = q.img_question;

  const container = document.getElementById("options-container");
  container.innerHTML = "";

  // NAQ
  if (q.questionType === "T") {
    container.innerHTML = `
      <label>
        Enter Answer:
        <input type="number" step="any" id="naq-input"
          value="${answers[currentIndex] ?? ""}"
          style="padding:6px; margin-top:10px; width:200px;">
      </label>
    `;
  }
  // MCQ
  else {
    for (let i = 1; i <= 4; i++) {
      container.innerHTML += `
        <label>
          <input type="radio" name="option" value="${i}"
            ${answers[currentIndex] == i ? "checked" : ""}>
          Option ${i}
        </label><br>
      `;
    }
  }

  renderPalette();
}

/***********************
 ANSWER HANDLING
************************/
function saveAnswer() {
  const q = questions[currentIndex];

  if (q.questionType === "T") {
    const input = document.getElementById("naq-input");
    answers[currentIndex] = input && input.value !== "" ? input.value.trim() : null;
  } else {
    const selected = document.querySelector('input[name="option"]:checked');
    answers[currentIndex] = selected ? selected.value : null;
  }
}

function clearResponse() {
  answers[currentIndex] = null;
  displayQuestion();
}

function markForReview() {
  answers[currentIndex] = "review";
  nextQuestion();
}

function nextQuestion() {
  saveAnswer();

  if (currentIndex < questions.length - 1) {
    currentIndex++;
    displayQuestion();
  }
}


/***********************
 PALETTE
************************/
function renderPalette() {
  const palette = document.getElementById("question-palette");
  palette.innerHTML = "";

  let count = { a: 0, na: 0, nv: 0, r: 0 };

  questions.forEach((_, i) => {
    const btn = document.createElement("button");
    btn.textContent = i + 1;

    if (!visitedQuestions[i]) {
      btn.className = "palette-btn not-visited";
      count.nv++;
    } else if (answers[i] === "review") {
      btn.className = "palette-btn marked";
      count.r++;
    } else if (answers[i] === null) {
      btn.className = "palette-btn not-answered";
      count.na++;
    } else {
      btn.className = "palette-btn answered";
      count.a++;
    }

    btn.onclick = () => {
      saveAnswer();
      currentIndex = i;
      displayQuestion();
    };

    palette.appendChild(btn);
  });

  document.getElementById("answered-count").textContent = count.a;
  document.getElementById("not-answered-count").textContent = count.na;
  document.getElementById("not-visited-count").textContent = count.nv;
  document.getElementById("marked-count").textContent = count.r;
}

/***********************
 SUBMIT & EVALUATION
************************/
function submitExam() {
  if (examSubmitted) return;
  examSubmitted = true;

  clearInterval(timerInterval);
  saveAnswer();

  let score = 0;
  let correct = 0;
  let wrong = 0;

  // NAQ correct counters per subject
  let naqCorrect = {
    sub1: 0, // Q1–30
    sub2: 0, // Q31–60
    sub3: 0  // Q61–90
  };

  questions.forEach((q, i) => {
    const ans = answers[i];
    if (!ans || ans === "review") return;

    // ---------- NAQ ----------
    if (q.questionType === "T") {
      const isCorrect =
        Math.abs(Number(ans) - Number(q.solution)) < 0.01;

      if (!isCorrect) return;

      // Decide subject by index
      if (i < 30 && naqCorrect.sub1 < 5) {
        naqCorrect.sub1++;
      }
      else if (i >= 30 && i < 60 && naqCorrect.sub2 < 5) {
        naqCorrect.sub2++;
      }
      else if (i >= 60 && i < 90 && naqCorrect.sub3 < 5) {
        naqCorrect.sub3++;
      }
    }

    // ---------- MCQ ----------
    else {
      if (ans === q.solution.toString()) {
        score += marks;
        correct++;
      } else {
        score -= negativeMarks;
        wrong++;
      }
    }
  });

  // Apply NAQ marks
  const totalEvaluatedNAQ =
    naqCorrect.sub1 + naqCorrect.sub2 + naqCorrect.sub3;

  score += totalEvaluatedNAQ * marks;
  correct += totalEvaluatedNAQ;

  showSubmitCard(questions.length, score, correct, wrong);
  submitMarks(score);
}



/***********************
 RESULT
************************/
function showSubmitCard(total, score, correct, wrong) {
  document.getElementById("userIdDisplay").innerText =
    localStorage.getItem("userid") || "N/A";

  document.getElementById("questionsAnswered").innerText = total;
  document.getElementById("marksScored").innerText = score;
  document.getElementById("questionsCorrect").innerText = correct;
  document.getElementById("questionsWrong").innerText = wrong;

  document.getElementById("submitCard").style.display = "block";
}

/***********************
 MARKS SUBMIT
************************/
function submitMarks(score) {
  const userid = localStorage.getItem("userid");
  const params = new URLSearchParams({
    action: "submitmarks",
    userid,
    exam: title,
    examname: sheetName,
    score
  });

  fetch(`${marksUrl}?${params}`)
    .then(res => res.json())
    .then(d => console.log(d));
}

function goBack() {
  window.location.href = "user.html";
}
