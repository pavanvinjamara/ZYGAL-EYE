const { MongoClient } = require('mongodb');

let db;

const connectDB = async () => {
    try {
        const client = new MongoClient(process.env.MONGO_URL);
        await client.connect();

        // Give your DB a name explicitly (native driver doesn't infer it like Mongoose does)
        db = client.db(process.env.DB_NAME || 'myapp');

        console.log("MongoDB connected successfully");
        return db;
    } catch (err) {
        console.log("DB connection failed:", err);
        throw err; // let the caller decide what to do (e.g. exit process)
    }
};

const getDB = () => {
    if (!db) throw new Error("DB not initialized. Call connectDB first.");
    return db;
};

module.exports = { connectDB, getDB };