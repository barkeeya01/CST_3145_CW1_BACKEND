const { MongoClient } = require("mongodb");

var db;

try {
  const client = new MongoClient(process.env.DB_URL, {tls:true});
  db = client.db("Afterschooldb");
  console.log("Connected to database from new app.");
} catch {
  console.log("Failed to connect to database.");
}
module.exports = db;
