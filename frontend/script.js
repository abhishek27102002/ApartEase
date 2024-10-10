// Ensure DOM is fully loaded before executing scripts
document.addEventListener('DOMContentLoaded', function() {

    // Check if user is logged in and is admin
    function checkAuth() {
        const token = localStorage.getItem('token');
        if (!token) {
            return null; // Not logged in
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload; // Return user information from token
        } catch (error) {
            return null; // Token is invalid
        }
    }

    // Login functionality
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            const response = await fetch('https://xenon-assignment.onrender.com/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                const payload = checkAuth(); // Decode the token to get user info

                if (payload.role === 'admin') {
                    window.location.href = 'add-home.html'; // Redirect to add-home.html if admin
                } else {
                    window.location.href = 'homepage.html'; // Redirect to homepage if user
                }
            } else {
                alert(data.error);
            }
        });
    }

    // Signup functionality
    const signupForm = document.getElementById('signup-form');
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const role = 'user'; // Default role is user

            const response = await fetch('https://xenon-assignment.onrender.com/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email, password, role })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Signup successful!');
                window.location.href = 'login.html';
            } else {
                alert(data.error);
            }
        });
    }

    // Admin adds a new home
    const addHomeForm = document.getElementById('add-home-form');
    if (addHomeForm) {
        addHomeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const title = document.getElementById('title').value;
            const description = document.getElementById('description').value;
            const price = document.getElementById('price').value;

            const token = localStorage.getItem('token');
            if (!token) {
                alert('You need to log in as admin to add a home');
                return;
            }

            const response = await fetch('https://xenon-assignment.onrender.com/add-home', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ title, description, price })
            });

            const data = await response.json();

            if (response.ok) {
                alert('Home added successfully!');
            } else {
                alert(data.error);
            }
        });
    }

    // Function to check if the user is an admin
    function checkAdminAccess() {
        const payload = checkAuth();
        if (!payload || payload.role !== 'admin') {
            alert('Access denied. Admins only.');
            window.location.href = 'index.html'; // Redirect to home
        }
    }

    // Call checkAdminAccess on the admin page
    if (window.location.pathname.includes('add-home.html')) {
        checkAdminAccess();
    }

    // Function to get all homes
    async function getAllHomes() {
        try {
            // Fetch all homes from the server
            const response = await fetch('https://xenon-assignment.onrender.com/list-homes');
            
            // Check if the response was successful
            if (response.ok) {
                const data = await response.json();
                displayAllHomes(data); // Display all homes on the page
            } else {
                const errorData = await response.json();
                alert(errorData.error);
                window.location.href = 'homepage.html'; // Redirect to homepage on error
            }
        } catch (error) {
            console.error('Error fetching homes:', error);
            alert('Error fetching homes. Please try again.');
        }
    }

    // Function to display all homes on the page
    function displayAllHomes(homes) {
        const homesContainer = document.getElementById('homes-container');
        homesContainer.innerHTML = ''; // Clear the container

        homes.forEach((home) => {
            const homeCard = document.createElement('div');
            homeCard.classList.add('home-card');

            const titleElement = document.createElement('h2');
            titleElement.textContent = home.title;

            const descriptionElement = document.createElement('p');
            descriptionElement.textContent = home.description;

            const priceElement = document.createElement('p');
            priceElement.textContent = `Price: $${home.price}`;

            homeCard.appendChild(titleElement);
            homeCard.appendChild(descriptionElement);
            homeCard.appendChild(priceElement);

            homesContainer.appendChild(homeCard);
        });
    }

    // Call the function on page load
    if (checkAuth()) {
        getAllHomes();
    }

});
