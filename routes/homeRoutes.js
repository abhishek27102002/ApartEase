const http = require('http');
const { addHome, listHomes } = require('../controllers/homes');
const { isAuthenticated, isAdmin } = require('../middlewares/authMiddleware');

// Utility function to handle request body parsing
const parseBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            // Debugging: Log the raw body received from the client
            console.log('Raw Body:', body);

            // Try parsing the raw body as JSON
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (error) {
            // Debugging: Log the error if parsing fails
            console.error('JSON Parsing Error:', error.message);
            reject(new Error('Invalid JSON format in request body'));
        }
    });
    req.on('error', reject);
});

// Router function to handle requests
const router = async (req, res) => {
    try {
        if (req.method === 'POST' && req.url === '/add-home') {
            req.body = await parseBody(req); // Parse the request body
            // Call middleware to check if user is authenticated
            isAuthenticated(req, res, () => {
                // Call middleware to check if user is admin
                isAdmin(req, res, async () => {
                    await addHome(req, res); // Call addHome controller
                });
            });
        } else if (req.method === 'GET' && req.url === '/list-homes') {
            await listHomes(req, res); // Call listHomes controller
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Not found' }));
        }
    } catch (error) {
        // Handle errors in parsing or request handling
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message }));
    }
};

module.exports = router;



