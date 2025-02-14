function handleLogin(event) {
    event.preventDefault(); 
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    const emailError = document.getElementById('email-error');
    const passwordError = document.getElementById('password-error');

    emailError.textContent = '';
    passwordError.textContent = '';
    if (!validateEmail(email)) {
        emailError.textContent = 'Please enter a valid email';
        return;
    }

    if (password.length < 6) {
        passwordError.textContent = 'Password must be at least 6 characters';
        return;
    }
    console.log('Form submitted:', { email, password });
    alert('Login successful!');
    
    window.location.href = 'front.html';
}

function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
}
