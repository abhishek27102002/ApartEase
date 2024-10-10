const connectToDb = require('../config/db');


const { ObjectId } = require('mongodb');

// Get a single home by ID
exports.getHome = async (req, res) => {
    const homeId = req.params.id; // Assuming the ID is passed as part of the URL
    const db = await connectToDb();

    // Validate home ID
    if (!ObjectId.isValid(homeId)) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'Invalid home ID' }));
    }

    try {
        const home = await db.collection('homes').findOne({ _id: new ObjectId(homeId) });

        if (home) {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(home));
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Home not found' }));
        }
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error fetching home' }));
    }
};

// Admin adds a new home
exports.addHome = async (req, res) => {
    const { title, description, price } = req.body; // Body is already parsed in the router
    const db = await connectToDb();

    if (!title || !description || !price) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        return res.end(JSON.stringify({ error: 'All fields are required' }));
    }

    try {
        await db.collection('homes').insertOne({ title, description, price });
        res.writeHead(201, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Home added successfully' }));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error adding home' }));
    }
};

// List homes (for both users and admins)
exports.listHomes = async (req, res) => {
    const db = await connectToDb();
    try {
        const homes = await db.collection('homes').find().toArray();
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(homes));
    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Error fetching homes' }));
    }
};



