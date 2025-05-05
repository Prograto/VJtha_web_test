
//Security
const scriptUrl = "https://script.google.com/macros/s/AKfycbwiECXwC_ONwRHNWDJu4e1eYGqrzVBvXriOE3rqrkGKNCRdeMA3xWC8GmQLTIXKfJtyLg/exec";
const userid = localStorage.getItem('userid');
const params = new URLSearchParams(window.location.search);
const urluserid = params.get('student_id');

if(urluserid!==userid){
    window.location.href = `user.html?student_id=${userid}`;
}

if(userid){
    console.log("userid:",userid);
    check();
}
else{
    alert("Invalid User");
}

function check(){
    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'check',
            userid: userid,
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log(data.success);
        }
        else{
            console.log("failed");
            window.location.href = 'index.html'
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

//stats
const statsContainer = document.getElementById('stats');
const counters = document.querySelectorAll('.number');

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
    if (entry.isIntersecting) {
        counters.forEach(counter => {
        counter.innerText = '0';
        const target = +counter.getAttribute('data-target');
        const increment = target / 100;

        const update = () => {
            let current = +counter.innerText;
            if (current < target) {
            counter.innerText = Math.ceil(current + increment);
            setTimeout(update, 15);
            } else {
            counter.innerText = target;
            }
        };

        update();
        });
    }
    });
}, {
    threshold: 0.5
});

observer.observe(statsContainer);