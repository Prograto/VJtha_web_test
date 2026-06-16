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
let  examtitle = document.getElementById("head");
let time = 180;
let correctMarks = 1;
let wrongMarks = 0;

/* URLs */

//eapcet
if(title === "eapcet"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbzBbckyzRaeuzs3PM_5Izvf5xXO3wRpu4Oi4cT6doEwilNkXMLhJ3kGyJt-ufWKDvKZ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbwHlnCOURvtxNMqx_hpz7A2rWzS13C9RTDILdotBCB9Dbw84HCgvGb4dcnOk9P2OWjLwg/exec";
  console.log(title, ":is loaing");
}

//Neet
if(title === "neet"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbxGnxNCIqpjD9SUhjrSF-pdaa5b9IOhWxH4SX41b5qBDakqsEEKmTnSDttOpg5h0Wk3/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbxoEXIzJzM0YJCU_8-7V3YZYcwqQ9PIQ9Ju27KPY8NUMNpJtUkBW1Uy5F_VmzTnz8zmYw/exec";
  examtitle.textContent = "NEET";
  document.getElementById("q").textContent = "180";
  document.getElementById("t").textContent = "200";
  time = 200;
  correctMarks = 4;
  wrongMarks = 1;
  console.log(title, ":is loaing");
}

//polycet
else if(title === "polycet"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbx9vmE7E7aGsAwztrnN1rp2j_wkIIMuC2uSJeZCjU0qpl2wHvthlzrIG9M0fYItCUE3/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbyFBMQO_8DWOrfOMAMkaAdNFu791xj6TJ3PAoxf9rmhhrWTCp-z9E-1NUrmeSpWP3Yu/exec";
  examtitle.textContent = "Polycet";
  document.getElementById("q").textContent = "120";
  document.getElementById("t").textContent = "120";
  time = 120;
  console.log(title, ":is loaing");
}

//aprjc
else if(title === "aprjc"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbzOYtHXIYKvYEfk6zTHEEr6tD4xgjhz6NkJAjJqkWxMXpIUigP6HUF6lFo71c_B1aJ1FQ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbw6cye6AwiterRzkiClcxdFIVNdqLuV6c-qdmbQXJ1LQkW3Kai4Jbqook0K-SN_lsA0/exec";
  examtitle.textContent = "APRJC";
  document.getElementById("q").textContent = "150";
  document.getElementById("t").textContent = "150";
  time = 150;
  console.log(title, ":is loaing");
}

//ssc
else if(title === "ssc"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbwRMXg0tTAKHroxN-JL3DKIrD89k99Ckk5F0Dn18bLNLmEydXWYM0muivpEj6Z2TflQ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbxQ2u9rjHy8HQ-urQ_O7aZWhWBITCBbvhU_YSqXe9x1NA3kokNawgTQsYiGxY2oYV8TVw/exec";
  examtitle.textContent = "SSC";
  document.getElementById("q").textContent = "100";
  document.getElementById("t").textContent = "100";
  time = 100;
  console.log(title, ":is loaing");
}

//School Exams
else if(title === "school"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbwIGvG9CA06xrbD6ccdInZtEszaOh1Zv6mj0qySlgTxdV4D0SrI7JtqKJ_rMJyTcAQnyA/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbwIILubCSrKpU53spLeCuo_s2jmUGWCi8QnHlY20Yu-JX_PxrUfuTymi20ZBd8DEAov/exec";
  examtitle.textContent = "School Exams";
  document.getElementById("q").textContent = "100";
  document.getElementById("t").textContent = "100";
  time = 100;
  console.log(title, ":is loaing");
}

//Degree CRT
else if(title === "degreecrt"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbwWYggAFHbTKKJSUISeKfPvs8DUcOkNFCZXiDrFfHKb15PYEO0pIU4N1_xqN7eaWIHIqg/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbzvUG7HkvE_EJYGdKC7Ig5CWOm2FBx-ATyvBn2NiZxheXAhInfagFHI49jeDXwi3dGgJQ/exec";
  examtitle.textContent = "Degree CRT";
  document.getElementById("q").textContent = "100";
  document.getElementById("t").textContent = "100";
  time = 100;
  console.log(title, ":is loaing");
}

//english
else if(title === "english"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbzxWe-ZiUhPZulY0fxv-KAu9X2D5h2C8DBvBBtTr9Cgj6uqaXy7Ofiw6NOQDVZ9IqdoMA/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbyrVr5soPJGo71TtXbRO_nW9SkPXNWJkTwzvRDNfQLR2zGF1DFLqZW9VuF_3YP4549zKQ/exec";
  examtitle.textContent = "English";
  document.getElementById("q").textContent = "20-50";
  document.getElementById("t").textContent = "25";
  time = 25;
  console.log(title, ":is loaing");
}

//general
else if(title === "general"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbzI0I9K527oQaN8-HUZOsp97yDVh6UYaoGoQa08RVs7NYzR7aVIaWM3fP-QKBMgUVUDAQ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbz7skeQCW_Nx-fuUVOxlZK_c_MtqzwQEkGng-W2CeOvWjT6dgwJraWeNlF5OFbyyWdUcw/exec";
  examtitle.textContent = "General";
  document.getElementById("q").textContent = "20-50";
  document.getElementById("t").textContent = "25";
  time = 25;
  console.log(title, ":is loaing");
}


//logical
else if(title === "aptitude"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbx7IZosqNYistP8R6s7uMFCYtpeG1DTU-WKlPxnNwQR38f4ojnSPLK06Ywb1-TXupRe/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbzL-6Fjm_L6ias0j7VV_8MUVy8agwq12V81gUFPx-yjAAjyIaY1Fw-63-MeUOBRw6Rq/exec";
  examtitle.textContent = "Aptitude";
  document.getElementById("q").textContent = "20-50";
  document.getElementById("t").textContent = "25";
  time = 25;
  console.log(title, ":is loaing");
}

//reasoning
else if(title === "reasoning"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbxC848v4Ej7khUbiEAvL58dkFzKlq4xGULHWa8EV5WjQAeRlOp84iXANBy46UBWLFnV/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbwEXguhU8OIuNsC2j0jOcW1TdM2iQWX1TySVuu2jFJGkMBGs2seyPxVefOtRYKPA7CZ/exec";
  examtitle.textContent = "Reasoning";
  document.getElementById("q").textContent = "20-50";
  document.getElementById("t").textContent = "25";
  time = 25;
  console.log(title, ":is loaing");
}

//eapcetpart
else if(title === "eapcetpart"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbyBBUmlVKX5ANsTNo6kbOz0G40fDlkKoOmbFenYk53B431lPpbKFIIO6JRXrwNoKc15sA/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbzy9oPXDFD_VPCIxBqBhzxEUk_EnOeOudVHPWD63P3-xZSU7wQjVN5Wi4-TpPBO2lQdRA/exec";
  examtitle.textContent = "Eapcet Part";
  document.getElementById("q").textContent = "20-30";
  document.getElementById("t").textContent = "25";
  time = 25;
  console.log(title, ":is loaing");
}

//ploycetpart
else if(title === "polycetpart"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbwU8fG-NXD9djn4CzMaFceujk8G3SLHxgpKPBwzgdKKy-4Umo-aAdqzfzfRIQRpIiCCBg/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbxxcRcPFlaTvcIBeXkEzjhA2pw30yjhUEmWmGqOUhrPn1-CV_B7KRGR0c8DH-Fn7cQq/exec";
  examtitle.textContent = "Polycet Part";
  document.getElementById("q").textContent = "20-30";
  document.getElementById("t").textContent = "25";
  time = 25;
  console.log(title, ":is loaing");
}

//Neet Part Tests
if(title === "neetpart"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbzP94HKcn7LcElKALmNqwvgY9P2n0hu4exJdr2znSaj-GCjbBLKcud4kxkQcMtIY1LoEA/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbzJEEelhSkPubusRP3jO4-SybSMIahkKIZtOPWpwsoXOY12DOomc_rjZtsKhG54P-OBvg/exec";
  examtitle.textContent = "NEET Part Tests";
  document.getElementById("q").textContent = "20-30";
  document.getElementById("t").textContent = "30";
  time = 30;
  correctMarks = 4;
  wrongMarks = 1;
  console.log(title, ":is loaing");
}

//schoolpart
else if(title === "schoolpart"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbxBxguoyD89xVI_9iT3fva7H1Xkx9guTeLeFA3c7RSKB6fER_ETjePQRiTe0jmz9Izc/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbyLAltl2E3nP_ZHqQx2AydNxmG-Vd8nk0Pv2dm3v5E7Ekw8pzQgWnADQSFptA9C3azztQ/exec";
  examtitle.textContent = "School Part";
  document.getElementById("q").textContent = "20-30";
  document.getElementById("t").textContent = "25";
  time = 25;
  console.log(title, ":is loaing");
}

//degree CRT part
else if(title === "degreecrtpart"){
  scriptUrl = `https://script.google.com/macros/s/AKfycbxOPgsjTzP9hDXVQEa6-ffsT4FgX51WJBOBBLuM7Ve30pFbGBtcqPYVttcrshJgb0zm/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  marksUrl = "https://script.google.com/macros/s/AKfycbwodAQxypa7E0dl3ropkaTr0Gvy1qYJDelBm5lxei95gA9i8xsVUIGZVxVaGjexKlqI/exec";
  examtitle.textContent = "Degree CRT Part";
  document.getElementById("q").textContent = "20-30";
  document.getElementById("t").textContent = "25";
  time = 25;
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
      questions = shuffleQuestionsOnce(Array.isArray(data) ? data : []);
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
  questions.forEach((q, i) => {
      if (!answers[i] || answers[i] === "review") return;

      if (answers[i] === q.solution.toString()) {
        score += correctMarks;
      } else {
        score -= wrongMarks;
      }
  });
  
  showMessage(`Submitted:You scored ${score} out of ${questions.length}`, "green");
  showSubmitCard(questions.length, score);
  submitMarks(score);
    
}
const userid = localStorage.getItem('userid');

function showSubmitCard(totalQuestions, marksScored) {
  document.getElementById("userIdDisplay").innerText = userid || "Not Found";
  document.getElementById("questionsAnswered").innerText = totalQuestions;
  document.getElementById("marksScored").innerText = marksScored;

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
  
