const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const port = 5000;

const uri = "mongodb+srv://jcs08manas_db_user:YOUR_PASSWORD@astrolens.wsapjj4.mongodb.net/?appName=AstroLens";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function connectDB() {
  await client.connect();
  console.log("Connected to MongoDB Atlas");
}
connectDB().catch(console.dir);

app.get("/", (req, res) => res.json({ message: "Astrology API running" }));

app.listen(port, () => console.log(`Server running on port ${port}`));
