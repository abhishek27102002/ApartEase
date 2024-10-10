const http = require('http');
const cors = require('cors'); // Import cors
const { signup, login } = require('./controllers/users');
const { addHome, listHomes } = require('./controllers/homes');
const { isAuthenticated, isAdmin } = require('./middlewares/authMiddleware');
const connectToDB = require('../backend/config/db');

// Middleware to handle CORS
const corsMiddleware = (req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow all origins
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization'); // Allow specific headers

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        return res.end();
    }

    next();
};

// Utility function to handle request body parsing
const parseBody = (req) => new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk.toString());
    req.on('end', () => {
        try {
            const parsedBody = JSON.parse(body);
            resolve(parsedBody);
        } catch (error) {
            reject(new Error('Invalid JSON'));
        }
    });
    req.on('error', reject);
});

const server = http.createServer(async (req, res) => {
    corsMiddleware(req, res, async () => {
        try {
            if (req.method === 'POST' && req.url === '/signup') {
                req.body = await parseBody(req);
                await signup(req, res);
            } else if (req.method === 'POST' && req.url === '/login') {
                req.body = await parseBody(req);
                await login(req, res);
            } else if (req.method === 'POST' && req.url === '/add-home') {
                req.body = await parseBody(req);
                isAuthenticated(req, res, () => isAdmin(req, res, async () => {
                    await addHome(req, res);
                }));
            } else if (req.method === 'GET' && req.url === '/list-homes') {
                await listHomes(req, res);
            } else {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Not found' }));
            }
        } catch (error) {
            // Handle errors in parsing or request handling
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: error.message }));
        }
    });
});

const PORT = 3000;
connectToDB()
    .then(() => {
        server.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }).catch(err => {
        console.error('Error connecting to the database:', err);
    });





