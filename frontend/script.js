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

            const response = await fetch('http://localhost:3000/login', {
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

            const response = await fetch('http://localhost:3000/signup', {
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

            const response = await fetch('http://localhost:3000/add-home', {
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


    // async function getHome(homeId) {
    //     try {
    //         // Fetch home details from the server
    //         const response = await fetch(`http://localhost:3000/get-home/${homeId}`);
    //         const data = await response.json();

    //         if (response.ok) {
    //             displayHome(data); // Display the home details on the page
    //         } else {
    //             alert(data.error);
    //             window.location.href = 'homepage.html'; // Redirect to homepage on error
    //         }
    //     } catch (error) {
    //         console.error('Error fetching home:', error);
    //         alert('Error fetching home details. Please try again.');
    //     }
    // }

    // // Function to display home details on the page
    // function displayHome(home) {
    //     const titleElement = document.getElementById('home-title');
    //     const descriptionElement = document.getElementById('home-description');
    //     const priceElement = document.getElementById('home-price');

    //     // Display home data
    //     titleElement.textContent = home.title;
    //     descriptionElement.textContent = home.description;
    //     priceElement.textContent = `Price: $${home.price}`; // Assuming price is numeric
    // }

    // // Extract home ID from the URL (using URLSearchParams)
    // function getHomeIdFromURL() {
    //     const params = new URLSearchParams(window.location.search);
    //     return params.get('id'); // Get the "id" parameter from the query string
    // }

    // // On page load, get the home ID and fetch its details
    // const homeId = getHomeIdFromURL();
    // if (homeId) {
    //     getHome(homeId); // Fetch the home details by ID
    // } else {
    //     alert('Invalid home ID.');
    //     window.location.href = 'homepage.html'; // Redirect to homepage if no ID found
    // }

});


