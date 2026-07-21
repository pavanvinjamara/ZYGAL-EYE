const { MongoClient } = require('mongodb');

let client;
let db;

const connectDB = async () => {
    try {
        client = new MongoClient(process.env.MONGO_URL, {
            maxPoolSize: 20,
            minPoolSize: 5,
            serverSelectionTimeoutMS: 8000,
        });
        await client.connect();

        db = client.db(process.env.DB_NAME || 'myapp');

        console.log("MongoDB connected successfully");
        return db;
    } catch (err) {
        console.log("DB connection failed:", err);
        throw err;
    }
};

const getDB = () => {
    if (!db) throw new Error("DB not initialized. Call connectDB first.");
    return db;
};

// Needed so tests / scripts / server shutdown don't leave dangling connections
const closeDB = async () => {
    if (client) await client.close();
};

module.exports = { connectDB, getDB, closeDB };