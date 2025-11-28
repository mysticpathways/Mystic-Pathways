// Enhanced form validation for login
document.getElementById('loginForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        alert('Login successful! (This is a demo)');
        this.style.transform = 'scale(1.05)';
        setTimeout(() => this.style.transform = 'scale(1)', 300);
    } else {
        alert('Please fill in all fields.');
    }
}

// Form validation for registration
document.getElementById('registrationForm')?.addEventListener('submit', function(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const whatsapp = document.getElement
    