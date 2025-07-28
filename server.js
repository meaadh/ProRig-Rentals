const express=require("express");
const session = require('express-session');
const bodyParser=require("body-parser");
const crypto=require("crypto");
const { MongoClient, ServerApiVersion } = require('mongodb');


const uri = require ("./atlas_uri")
const dbname="ProRigRentals"

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

app.use(session({
  secret: 'ProRigs123',
  resave: false,
  saveUninitialized: true
}));

let db;



async function connectToDB() {
  try {
    await client.connect();
    db= client.db(dbname);
    console.log(` Successfully connected to the ${dbname} database`);
    await db.collection("counters").updateOne(
      { _id: "userId" },
      { $setOnInsert: { sequence_value: 0 } },
      { upsert: true }
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

async function getNextUserID() 
{
  const counter = await db.collection("counters").findOneAndUpdate(
    { _id: "userId" },
    { $inc: { sequence_value: 1 } },
    { returnDocument: "after", upsert: true }
  );
  if (!counter || typeof counter !== "object" || !counter.value || typeof counter.value.sequence_value !== null) 
  {
     await db.collection("counters").updateOne(
      { _id: "userId" },
      { $set: { sequence_value: 0 } },
    );
    console.log("Full updateResult:", counter);
    console.log("updateResult:", counter.value);
    return 1;
  }
  console.log("Full updateResult:", counter.value);
  return counter.value.sequence_value;
}
app.post("/contact_us", async(req,res)=>{
  const{fname,lname,email,username,password,user_type}=req.body;
  try {
    const data = {
      fname,
      lname,
      email,
      username,
    };
  
    await db.collection("RentalUsers").insertOne(data);
    console.log(`Successfully into to the ${dbname} database with userId:`,userId);
    return res.redirect("loginform.html");
  } catch(err) {
    console.log(`Insert error to the ${dbname} database`,err);
    return res.redirect(`register_form.html?error=${encodeURIComponent("Signup Failed: " + err.message)}`);
  }
})
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
    return res.redirect(`register_form.html?error=${encodeURIComponent("Signup Failed: " + err.message)}`);
  }
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const hashedPass = crypto.createHash("sha256").update(password).digest("hex");

  try {
    const user = await db.collection('RentalUsers').findOne({
      username: username,
      password: hashedPass
    });

    if (user) {
      if (user.user_type === 'admin') {
        req.session.admin_name = user.lname;
        return res.redirect('/adminPage.html');
      } else {
        req.session.user_name = user.lname;

        if (user.user_type === 'customer') return res.redirect('/customer.html');
        if (user.user_type === 'maintainance') return res.redirect('/maintainance.html');
        if (user.user_type === 'user') return res.redirect('/userpage.html');

        return res.send('Unknown user type');
      }
    } else {
      return res.redirect('/loginform.html?error=' + encodeURIComponent('Incorrect username or password'));
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.get('/adminPage.html', (req, res) => {
  res.send(`Welcome User: ${req.session.user_name}`);
});
app.get('/userPage.html', (req, res) => {
  res.send(`Welcome User: ${req.session.user_name}`);
});
app.get('/maintainance.html', (req, res) => {
  res.send(`Welcome Family: ${req.session.user_name}`);
});
app.get('/customer.html', (req, res) => {
  res.send(`Welcome Customer: ${req.session.user_name}`);
});
app.get("/",(req,res)=>{
  res.set({"Access-control-Allow-Origin": "*" });
  return res.redirect("register_form.html");
});
app.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error("Logout failed:", err);
      return res.status(500).send("Logout failed");
    }
    res.redirect('/loginform.html');
  });
});



