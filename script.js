const container = document.getElementById('container');
const signUpButton = document.getElementById('signUp');
const logInButton = document.getElementById('logIn');

// Function to switch to the Log In View (Register form disappears)
function switchToLoginView() {
    container.classList.remove('right-panel-active');
}

// Function to switch to the Sign Up View (Log In form disappears)
function switchToRegisterView() {
    container.classList.add('right-panel-active');
}

// Existing manual button listeners, now calling the reusable functions
signUpButton.addEventListener('click', () => {
    switchToRegisterView();
});

logInButton.addEventListener('click', () => {
    switchToLoginView();
});

// Function to clear registration fields after success
function clearRegistrationFields() {
    document.getElementById("username").value = '';
    document.getElementById("email").value = '';
    document.getElementById("password").value = '';
}

document.getElementById("registerForm").addEventListener
("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        })
    });

    const data = await res.json();
    
    if (res.ok) {
        switchToLoginView(); 
        clearRegistrationFields();
        alert(data.message);
        
    } else if (data.message && (
        data.message.includes("Email already in use") ||
        data.message.includes("username exists") ||
        data.message.includes("email already registered") ||
        data.message.includes("user already exists")
    )){
        switchToLoginView();
        alert("Account already exists. Please log in.")
    }
      else{
        alert(`Registration failed:${data.message ||'Server error'}`)
      }
    
});

//LOGIN
document.getElementById("loginForm").addEventListener
("submit", async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: document.getElementById("login-email").value,
            password: document.getElementById("login-password").
value
        })
    });

    const data = await res.json();
    
    if (res.ok && data.token) {
        localStorage.setItem('userToken', data.token);
        if(data.username){
            localStorage.setItems('username', data.username);
        }
        alert(`Welcome back, ${data.username || 'user'}!`);
        //Redirecting after successful log in
        window.location.href='./dashboard.html'
        
            } else {
        alert(`Login failed:${data.message ||'Invalid credentials'}`)
    }
});