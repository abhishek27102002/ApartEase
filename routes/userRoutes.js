const http = require('http');
const { signup, login, getUserProfile } = require('../controllers/users');
const { isAuthenticated } = require('../middlewares/authMiddleware');

// Utility function to handle request body parsing
const parseBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (error) {
            reject(new Error('Invalid JSON')); // Error during JSON parsing
        }
    });
    req.on('error', reject);
});

// Router function to handle user-related routes
const userRouter = async (req, res) => {
    try {
        if (req.method === 'POST' && req.url === '/signup') {
            req.body = await parseBody(req); // Parse the request body
            await signup(req, res); // Call the signup controller
        } else if (req.method === 'POST' && req.url === '/login') {
            req.body = await parseBody(req); // Parse the request body
            await login(req, res); // Call the login controller
        } else if (req.method === 'GET' && req.url === '/profile') {
            // Call middleware to check if user is authenticated
            isAuthenticated(req, res, async () => {
                await getUserProfile(req, res); // Call getUserProfile controller
            });
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' })); // Route not found
        }
    } catch (error) {
        // Handle errors in parsing or request handling
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message })); // Send error message
    }
};

module.exports = userRouter;


