function renderExamUI() {
    const examContainer = document.getElementById('exam');
    examContainer.innerHTML = `
      <div class="exam-layout">
        <div class="question-section">
          <div class="question-header">
            <strong>Question No. <span id="qno">1</span></strong>
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
  
      const answer = answers[i];
      if (i === currentIndex) {
        btn.className = "palette-btn visited"; // mark visited
      }
  
      if (answer === null) {
        btn.className = "palette-btn not-answered";
        counts.notAnswered++;
      } else if (answer === "review") {
        btn.className = "palette-btn marked";
        counts.markedForReview++;
      } else {
        btn.className = "palette-btn answered";
        counts.answered++;
      }
  
      btn.onclick = () => {
        saveAnswer();
        currentIndex = i;
        displayQuestion();
        renderPalette(); // refresh palette on click
      };
  
      palette.appendChild(btn);
    }
  
    // Update the status counts visually
    document.getElementById("answered-count").textContent = counts.answered;
    document.getElementById("not-answered-count").textContent = counts.notAnswered;
    document.getElementById("marked-count").textContent = counts.markedForReview;
  }
  
  
  
  let questions = [];
  let currentIndex = 0;
  let answers = [];
  
  function loadQuestions() {
    const sheetName = sessionStorage.getItem('selectedTitle');
    const scriptUrl = `https://script.google.com/macros/s/AKfycbzBbckyzRaeuzs3PM_5Izvf5xXO3wRpu4Oi4cT6doEwilNkXMLhJ3kGyJt-ufWKDvKZ/exec?action=get_questions&sheet=${encodeURIComponent(sheetName)}`;
  
    fetch(scriptUrl)
      .then(res => res.json())
      .then(data => {
        questions = data;
        answers = new Array(questions.length).fill(null);
        displayQuestion();
        renderPalette();
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
  
    const options = document.getElementsByName("option");
    options.forEach(opt => {
      opt.checked = (answers[currentIndex] === opt.value);
    });
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
    saveAnswer();
    const unanswered = answers.filter(a => !a).length;
    if (unanswered > 0) {
      const confirmSubmit = confirm(`You have ${unanswered} unanswered questions. Do you still want to submit?`);
      if (!confirmSubmit) return;
    }
    let score = 0;
    questions.forEach((q, i) => {
      if (answers[i] && answers[i] === q.solution.toString()) score++;
    });
    alert(`You scored ${score} out of ${questions.length}`);
  }
  
  
  renderExamUI();
  