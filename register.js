const express=require("express");
const bodyParser=require("body-parser");
const crypto=require("crypto");
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = require ("./atlas_uri")
const dbname="ProRigsRentals"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const app=express();
app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));


let db;
async function getNextUserID() {
  const counter = await db.collection("counters").findOneAndUpdate(
    { _id: "userId" },
    { 
      $inc: { sequence_value: 1 },
    },
    
    { 
      returnDocument: "after", 
      upsert: true 
    }
  );
  return counter.value.sequence_value;
}

async function connectToDB() {
  try {
    await client.connect();
    db= client.db(dbname);
    console.log(` Successfully connected to the ${dbname} database`);
    await db.collection("counters").updateOne(
      { _id: "userId" },
      {$setOnInsert: {sequence_value: 0}},
      {upsert: true }
    );
    app.listen(3000,()=>
    {
      console.log("server listening at port 3000");
    });
  } catch(err) {
    console.log(` MongoDB connection failed to the ${dbname} database`,err);
  }
}

connectToDB();

app.post("/sign_up", async(req,res)=>{
  const{fname,lname,email,username,password,user_type}=req.body;
  const hash=crypto.createHash("sha256").update(password).digest("hex");
  try {
    const userId= await getNextUserID();
    const data = {
      userId,
      fname,
      lname,
      email,
      username,
      password: hash,
      user_type
    };
  
    await db.collection("RentalUsers").insertOne(data);
    console.log(`Successfully into to the ${dbname} database with userId:`,userId);
    return res.redirect("loginform.html");
  } catch(err) {
    console.log(`Insert error to the ${dbname} database`,err);
    return res.status(500).send("ERROR Signing Up");
  }
})


app.get("/",(req,res)=>{
  res.set({"Access-control-Allow-Origin": "*" });
  return res.redirect("register_form.html");
});


