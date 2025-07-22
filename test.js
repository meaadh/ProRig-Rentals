const express = require("express");
const bodyParser = require("body-parser");
const crypto = require("crypto"); // for SHA-256
const { MongoClient, ServerApiVersion } = require("mongodb");

const uri = require("./atlas_uri"); // Make sure this file exports the MongoDB URI
const dbname = "ProRigsRentals";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

let db;
async function getNextUserId() {
  const counter = await db.collection("counters").findOneAndUpdate(
    { _id: "userId" },
    { $inc: { sequence_value: 1 } },
    { returnDocument: "after", upsert: true }
  );
  return counter.value.sequence_value;
}

async function startServer() {
  try {
    await client.connect();
    db = client.db(dbname);
    console.log("MongoDB connected successfully");

    // Start listening *after* DB connects
    app.listen(3000, () => {
      console.log("Server listening at port 3000");
    });
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

startServer();

app.post("/sign_up", async (req, res) => {
  const { name, email, password, phone } = req.body;

  // SHA-256 hash (you can use bcrypt for even better security)
  const hash = crypto.createHash("sha256").update(password).digest("hex");

  const data = {
    name,
    email,
    password: hash,
    phone,
  };

  try {
    await db.collection("RentalUsers").insertOne(data);
    console.log("Record inserted successfully");
    return res.redirect("signup_success.html");
  } catch (err) {
    console.error("Insert error:", err);
    return res.status(500).send("Error signing up");
  }
});

app.get("/", (req, res) => {
  res.set({ "Access-Control-Allow-Origin": "*" });
  return res.redirect("register_form.html");
});
