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
              <label><input type="radio" name="option" value="1"> 1</label><br>
              <label><input type="radio" name="option" value="2"> 2</label><br>
              <label><input type="radio" name="option" value="3"> 3</label><br>
              <label><input type="radio" name="option" value="4"> 4</label>
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
  
  let timerInterval;

  function startTimer(durationInMinutes) {
    let timeLeft = durationInMinutes * 60; // in seconds
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
  
    // Update the status counts visually
    document.getElementById("answered-count").textContent = counts.answered;
    document.getElementById("not-answered-count").textContent = counts.notAnswered;
    document.getElementById("not-visited-count").textContent = counts.notVisited;
    document.getElementById("marked-count").textContent = counts.markedForReview;
  }
  
  
  let questions = [];
  let currentIndex = 0;
  let answers = [];
  let visitedQuestions = [];

  
  function loadQuestions() {
    const sheetName = sessionStorage.getItem('selectedTitle');
    const scriptUrl = `https://script.google.com/macros/s/AKfycbzBbckyzRaeuzs3PM_5Izvf5xXO3wRpu4Oi4cT6doEwilNkXMLhJ3kGyJt-ufWKDvKZ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  
    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => {
        questions = data;
        answers = new Array(questions.length).fill(null);
        visitedQuestions = new Array(questions.length).fill(false);

        displayQuestion();
        renderPalette();
        startTimer(180);
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
  
    visitedQuestions[currentIndex] = true; // 👈 mark current as visited
  
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
        if (answers[i] && answers[i] === q.solution.toString()) score++;
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
  const marksUrl = "https://script.google.com/macros/s/AKfycbwHlnCOURvtxNMqx_hpz7A2rWzS13C9RTDILdotBCB9Dbw84HCgvGb4dcnOk9P2OWjLwg/exec";
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
  
