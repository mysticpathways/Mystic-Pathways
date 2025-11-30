// Login form AJAX
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        if (email && password) {
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Login successful!');
                } else {
                    alert(data.error || 'Login failed');
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        } else {
            alert('Please fill in all fields.');
        }
    });
}

// Registration form AJAX
if (document.getElementById('registrationForm')) {
    document.getElementById('registrationForm').addEventListener('submit', async function(event) {
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const contact = document.getElementById('contact').value;
        const whatsapp = document.getElementById('whatsapp').value;
        const password = document.getElementById('password').value;
        if (name && email && contact && whatsapp && password) {
            try {
                const res = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, contact, whatsapp, password })
                });
                const data = await res.json();
                if (res.ok) {
                    alert('Registration successful!');
                } else {
                    alert(data.error || 'Registration failed');
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        } else {
            alert('Please fill in all fields.');
        }
    });
}
