const { MongoClient } = require('mongodb');
const url = 'mongodb://localhost:27017'; // Change this if using a different host
const dbName = 'vacationRentals';
let db;

async function connectToDb() {
    if (!db) {
        const client = await MongoClient.connect(url, { useUnifiedTopology: true });
        db = client.db(dbName);
        console.log("Connected to Database");
    }
    return db;
}

module.exports = connectToDb;


