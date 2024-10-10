const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const connectToDb = require('../config/db');

// User signup
// Example of the signup controller
exports.signup = async (req, res) => {
    const { username, email, password, role } = req.body; // Access parsed body

    try {
        // Assuming connectToDb is a function that returns the database connection
        const db = await connectToDb();
        const hashedPassword = await bcrypt.hash(password, 10);

        await db.collection('users').insertOne({ username, email, password: hashedPassword, role });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'User created successfully' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error creating user', details: error.message }));
    }
};


// User login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body; // Access the parsed body directly

        const db = await connectToDb();
        const user = await db.collection('users').findOne({ email });

        if (user && await bcrypt.compare(password, user.password)) {
            const token = jwt.sign({ id: user._id, role: user.role }, 'xyz12345', { expiresIn: '1h' });
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Login successful', token })); // Send JSON response
        } else {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Invalid email or password' })); // Send error message
        }
    } catch (error) {
        // Handle any unexpected errors
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: error.message })); // Send error details
    }
};


