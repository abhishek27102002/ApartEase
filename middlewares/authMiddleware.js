const jwt = require('jsonwebtoken');

// Middleware to authenticate the user
exports.isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Access denied, token missing!' }));
    }

    try {
        const decoded = jwt.verify(token, 'xyz12345'); // Replace with your secret key
        req.user = decoded; // Store decoded user information in the request
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Invalid token' }));
    }
};

// Middleware to check if the user is an admin
exports.isAdmin = (req, res, next) => {
    if (!req.user || req.user.role !== 'admin') {
        res.writeHead(403, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Admin access required' }));
    }
    next(); // Proceed to the next middleware or route handler
};


