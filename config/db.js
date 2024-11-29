const { MongoClient } = require("mongodb");

var db;

try {
  const client = new MongoClient(process.env.DB_URL);
  db = client.db("Afterschooldb");
  console.log("Connected to database.");
} catch {
  console.log("Failed to connect to database.");
}
module.exports = db;
