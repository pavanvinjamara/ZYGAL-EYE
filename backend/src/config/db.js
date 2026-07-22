// backend/src/config/db.js
const { MongoClient } = require('mongodb');
require('dotenv').config();

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017';
const dbName = process.env.MONGO_DB || 'iifl_eye';

let client;
let db;

async function connectDB() {
  if (db) return db;
  client = new MongoClient(uri, { maxPoolSize: 20 });
  await client.connect();
  db = client.db(dbName);
  console.log(`MongoDB connected: ${dbName}`);
  return db;
}

function getDB() {
  if (!db) throw new Error('DB not initialized. Call connectDB() first.');
  return db;
}

async function closeDB() {
  if (client) await client.close();
}

module.exports = { connectDB, getDB, closeDB };
