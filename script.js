document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.querySelector('.nav-menu');
    const loginLink = document.getElementById('login-link');
    const loginCard = document.getElementById('login-card');

    const studentLogin = document.getElementById('student-login');
    const registerTab = document.getElementById('register-tab');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    const userTypeInput = document.getElementById('user-type');

    toggle.addEventListener('click', () => {
        menu.classList.toggle('active');
    });

    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        loginCard.style.display = 'block';
    });

    studentLogin.addEventListener('click', () => {
        studentLogin.classList.add('active');
        registerTab.classList.remove('active');
        loginForm.style.display = 'flex';
        registerForm.style.display = 'none';
        userTypeInput.value = 'student';
    });

    registerTab.addEventListener('click', () => {
        registerTab.classList.add('active');
        studentLogin.classList.remove('active');
        loginForm.style.display = 'none';
        registerForm.style.display = 'flex';
    });

});

const scriptUrl = "https://script.google.com/macros/s/AKfycbwiECXwC_ONwRHNWDJu4e1eYGqrzVBvXriOE3rqrkGKNCRdeMA3xWC8GmQLTIXKfJtyLg/exec";

function login(){
    var userid = document.getElementById("user-id").value;
    var password = document.getElementById("password").value;

    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'login',
            userid: userid,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("loginMessage").innerHTML = data.error || data.success;
        if (data.success) {
            console.log(userid)
            const userID = userid; 
            localStorage.setItem('userid',userID);
            window.location.href = `user.html?student_id=${userID}`; 
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

function register() {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    var userid = document.getElementById("reg-user-id").value;
    var email = document.getElementById("reg-email").value;
    var phone = document.getElementById("phone").value;
    var password = document.getElementById("reg-password").value;
    var confirmPassword = document.getElementById("confirm-password").value;

    if (!userid || !email || !phone || !password || !confirmPassword) {
        alert('Please fill all fields.');
        return;
    }

    if (!emailPattern.test(email)) {
        alert('Invalid Email Address.');
        return;
    }

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    fetch(scriptUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
            action: 'register',
            userid: userid,
            email: email,
            phone: phone,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("registerMessage").innerHTML = data.error || data.success;
    })
    .catch(error => {
        console.error('Error:', error);
    });
}