let params = new URLSearchParams(window.location.search);
let title = params.get('title');
let titletag = document.getElementById("title");
titletag.innerText = title;
console.log(title)
if(title==="english"){
    console.log("ok")
}

/* Fetching data */
const scriptUrl = "https://script.google.com/macros/s/AKfycbzBbckyzRaeuzs3PM_5Izvf5xXO3wRpu4Oi4cT6doEwilNkXMLhJ3kGyJt-ufWKDvKZ/exec";

let cardData = [];

fetch(scriptUrl + "?action=get_titles", {
    method: 'GET',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})
.then(response => {
    if (!response.ok) {
        throw new Error('Network response was not ok');
    }
    return response.json();
})
.then(data => {
    console.log('Fetched data:', data);

    // Convert object to array of { title, title_url }
    cardData = Object.entries(data).map(([key, value]) => ({
        title: key,
        title_url: value
    }));

    renderCards();  // Call renderCards after data is ready
})
.catch(error => {
    console.error('There was an error with the fetch operation:', error);
});

  let currentPage = 1;
  let cardsPerPage = getCardsPerPage();

  function getCardsPerPage() {
    return window.innerWidth <= 768 ? 6 : 8;
  }

  function renderCards() {
    const container = document.querySelector('.card-container');
    container.innerHTML = '';
  
    cardsPerPage = getCardsPerPage(); // recalculate in case of resize
    const totalPages = Math.ceil(cardData.length / cardsPerPage);
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    const cardsToDisplay = cardData.slice(start, end);
  
    cardsToDisplay.forEach(card => {
      const cardEl = document.createElement('div');
      cardEl.className = 'l_card';
      cardEl.innerHTML = `
        <h2>${card.title}</h2>
        <img class="course_img" src="${card.title_url}">
        <button class="take-btn">Take</button>
      `;
      container.appendChild(cardEl);
  
      // Add click event to the button
      const takeBtn = cardEl.querySelector('.take-btn');
      takeBtn.addEventListener('click', () => {
        sessionStorage.setItem('selectedTitle', card.title);
        window.location.href = 'eapcetexam.html';
      });
    });
  
    document.getElementById('page-indicator').textContent = `Page ${currentPage} of ${totalPages}`;
  }
  

  function nextPage() {
    const totalPages = Math.ceil(cardData.length / cardsPerPage);
    if (currentPage < totalPages) {
      currentPage++;
      renderCards();
    }
  }

  function prevPage() {
    if (currentPage > 1) {
      currentPage--;
      renderCards();
    }
  }

  // Re-render cards if screen is resized
  window.addEventListener('resize', () => {
    const newCardsPerPage = getCardsPerPage();
    if (newCardsPerPage !== cardsPerPage) {
      currentPage = 1;
      cardsPerPage = newCardsPerPage;
      renderCards();
    }
  });


