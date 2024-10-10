const { MongoClient } = require('mongodb');
// const url = 'mongodb://localhost:27017';
const url = 'mongodb+srv://utsavraj626:cW6I6il4sRop4cRj@cluster0.trrzn.mongodb.net/xenon?retryWrites=true&w=majority&appName=Cluster0';
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


