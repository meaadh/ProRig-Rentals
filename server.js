const express=require("express");
const session = require('express-session');
const bodyParser=require("body-parser");
const crypto=require("crypto");
const multer = require('multer');
const path = require('path');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');


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

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/img/equipment/') // Store images in the equipment folder
  },
  filename: function (req, file, cb) {
    // Generate unique filename with timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Add CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

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
    console.log(`Successfully connected to the ${dbname} database`);

    await db.collection("AdminUsers").createIndex({ username: 1 }, { unique: true });
    await db.collection("RentalUsers").createIndex({ username: 1 }, { unique: true });
    await db.collection("AdminUsers").createIndex({ adminId: 1 }, { unique: true });
    await db.collection("RentalUsers").createIndex({ userId: 1 }, { unique: true });
    await db.collection("Reservations").createIndex({ orderId: 1 }, { unique: true });

    // Initialize counter only if it doesn't exist, starting from 0
    const counterExists = await db.collection("counters").findOne({ _id: "userId" });
    if (!counterExists) {
      await db.collection("counters").insertOne({ _id: "userId", sequence_value: 0 });
      console.log("Initialized userId counter to 0");
    }

    const admincounterExists = await db.collection("counters").findOne({ _id: "adminId" });
    if (!admincounterExists) {
      await db.collection("counters").insertOne({ _id: "adminId", sequence_value: 0 });
      console.log("Initialized userId counter to 0");
    }

    const OrdercounterExists = await db.collection("counters").findOne({ _id: "orderId" });
    if (!OrdercounterExists) {
      await db.collection("counters").insertOne({ _id: "orderId", sequence_value: 1000 });
      console.log("Initialized userId counter to 1000");
    }
    
    const [a] = await db.collection("AdminUsers")
      .aggregate([{ $group: { _id: null, maxUserIdFromAdmin: { $max: "$adminId" } } }]).toArray();
    const [b] = await db.collection("RentalUsers")
      .aggregate([{ $group: { _id: null, maxUserIdFromRental: { $max: "$userId" } } }]).toArray();
    const [c] = await db.collection("Reservations")
      .aggregate([{ $group: { _id: null, maxOrderIdFromRental: { $max: "$orderId" } } }]).toArray();
    
    const adminIdMax = a?.maxUserIdFromAdmin || 0;
    const userIdMax = Math.max(a?.maxUserIdFromAdmin || 0, b?.maxUserIdFromRental || 0);
    const orderIdMax = Math.max(c?.maxOrderIdFromRental || 0);

    await db.collection("counters").updateOne(
      { _id: "userId" },
      { $max: { sequence_value: userIdMax } },
      { upsert: true }
    );

    await db.collection("counters").updateOne(
      { _id: "adminId" },
      { $max: { sequence_value: adminIdMax } },
      { upsert: true }
    );
     await db.collection("counters").updateOne(
      { _id: "orderId" },
      { $max: { sequence_value: orderIdMax } },
      { upsert: true }
    );

    console.log(`Sycned userId counters to >=${userIdMax} & adminId counters to >=${adminIdMax} & orderId counters to >=${orderIdMax}`)

    app.listen(3000,()=>
    {
      console.log("Server listening at port 3000");
    });
  } catch(err) {
    console.log(`MongoDB connection failed to the ${dbname} database`,err);
  }
}

connectToDB();

async function getNextSequence(counterName) 
{
  try {
    const counter = await db.collection("counters").findOneAndUpdate(
      { _id: counterName },
      { $inc: { sequence_value: 1 } },
      { returnDocument: "after", upsert: true }
    );
    
    console.log(`${counterName} Counter result:`, counter);
    
    // Check if counter exists and has the sequence_value
    if (counter && counter.sequence_value && typeof counter.sequence_value === 'number') {
      console.log(`Returning ${counterName}:`, counter.sequence_value);
      return counter.sequence_value;
    } else {
      console.log("Counter not found or invalid, initializing...");
      // If counter doesn't exist or is invalid, initialize it
      await db.collection("counters").updateOne(
        { _id: counterName },
        { $set: { sequence_value: 1 } },
        { upsert: true }
      );
      return 1;
    }
  } catch (err) {
    console.error(`Error in getNextSequence for ${counterName}:`, err);
    return 1;
  }
}
app.post("/contact_us", async(req,res)=>{
  const{name,email,subject,message,}=req.body;
  try {
    const data = {
      name,
      email,
      subject,
      message,
    };
  
    await db.collection("ContactForm").insertOne(data);
    console.log(`Successfully into to the ${dbname} database with name:`,name);
    return res.redirect(`Home.html?success=${encodeURIComponent("Message Sent")}`);
  } catch(err) {
    console.log(`Insert error to the ${dbname} database`,err);
    return res.redirect(`Home.html?error=${encodeURIComponent("Contact Form Failed: " + err.message)}`);
  }
})
app.post("/sign_up", async(req,res)=>{
  const{fname,lname,email,username,password}=req.body;
  const hash=crypto.createHash("sha256").update(password).digest("hex");
  try {
    // Check if username already exists
    const existingUser = await db.collection("RentalUsers").findOne({ username: username });
    if (existingUser) {
      console.log(`Registration failed: Username '${username}' already exists`);
      return res.redirect(`register_form.html?error=${encodeURIComponent("Username already exists. Please choose a different username.")}`);
    }

    const userId= await getNextSequence("userId");
    const data = {
      userId,
      fname,
      lname,
      email,
      username,
      password: hash,
      user_type:"customer",
      address:[],
      payment:[],
      created_at:new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at:new Date().toISOString().replace('T', ' ').substring(0, 19),
    };
  
    await db.collection("RentalUsers").insertOne(data);
    console.log(`Successfully into to the ${dbname} database with userId:`,userId);
    return res.redirect("loginform.html");
  } catch(err) {
    console.log(`Insert error to the ${dbname} database`,err);
    console.log("Full error details:", JSON.stringify(err, null, 2));
    if (err.errInfo && err.errInfo.details) {
      console.log("Validation details:", JSON.stringify(err.errInfo.details, null, 2));
    }
    return res.redirect(`register_form.html?error=${encodeURIComponent("Signup Failed: " + err.message)}`);
  }
})
app.post("/managment", async(req,res)=>{
  const{fname,lname,email,username,password,user_type}=req.body;
  const hash=crypto.createHash("sha256").update(password).digest("hex");
  try {
    // Check if username already exists
    const existingUser = await db.collection("RentalUsers").findOne({ username: username });
    const existingAdminUser = await db.collection("AdminUsers").findOne({ username: username });

     if (existingUser||existingAdminUser) {
      console.log(`Registration failed: Username '${username}' already exists`);
      return res.redirect(`adminPage.html?error=${encodeURIComponent("Username already exists. Please choose a different username.")}`);
    }

    const adminId= await getNextSequence("adminId");
    const data = {
      adminId,
      fname,
      lname,
      email,
      username,
      password: hash,
      user_type,
      created_at:new Date().toISOString().replace('T', ' ').substring(0, 19),
      updated_at:new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    
    console.log("Data object to be inserted:", JSON.stringify(data, null, 2));
  
    await db.collection("AdminUsers").insertOne(data);
    console.log(`Successfully registered user to the ${dbname} database with adminId:`,adminId);
    return res.redirect("adminPage.html");
  } catch(err) {
    console.log(`Insert error to the ${dbname} database`,err);
    return res.redirect(`adminPage.html?error=${encodeURIComponent("Signup Failed: " + err.message)}`);
  }
})
async function findUser(db,username,hashedPass) {
  const collections=["AdminUsers","RentalUsers"];
  for (const coll of collections)
  {
    const user=await db.collection(coll).findOne({username,password:hashedPass});
    if(user)
    {
      return {...user,_collection:coll };
    }
  }
  return null;
  
}
app.post('/login', async (req, res) => {


  try {
    
    const { username, password } = req.body;
    if(!username || !password)
    {
      return res.status(400).send ("Username and password are required");
    }
    const hashedPass = crypto.createHash("sha256").update(password).digest("hex");
    const user = await findUser(db,username,hashedPass);
    
    if (!user) 
    {
      return res.redirect('/loginform.html?error=' + encodeURIComponent('Incorrect username or password'));
    }
    const fullName=[user.fname, user.lname].filter(Boolean).join(" ");
      // Print user's full name to the console at login
      console.log(`User Logged In: ${fullName} [user_type=${user.user_type|| "Unknown"} from ${user._collection}]`);

      // Set session data for ALL user types
    req.session.user = {
      username: user.username,
      fname: user.fname,
      lname: user.lname,
      user_type: user.user_type,
      source: user._collection
    };
    req.session.user_name = user.username;
    req.session.userData = {fname:user.fname, lname:user.lname, username:user.username,user_type:user.user_type};
  
    if (user.user_type === 'admin') {
      return res.redirect('/adminPage.html');
    } else if (user.user_type === 'customer') {
      return res.redirect('/equipment-reservation.html');
    } else if (user.user_type === 'maintenance') {
      return res.redirect('/maintainancePage.html');
    } else {
      return res.status(400).send('Unknown user type');
    }

  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});
function requireLogin(req,res,next)
{
  if(!req.session?.user)
  {
    return res.redirect('/loginform.html');
  }
  next();
}
app.get("/",(req,res)=>{
  res.set({"Access-control-Allow-Origin": "*" });
  return res.redirect("register_form.html");
});
app.get('/logout',requireLogin, (req, res) => {
  const user=req.session.userData;
  if(user)
  {
    console.log("User Logged Out",user.fname + " " + user.lname);
  }
  else
  {
    console.log("Logout failed: User not Failed");

  }
  req.session.destroy(err => {
    if (err) {
      console.error("Logout failed:", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid");
    res.redirect('/home.html');
  });
});
app.get('/userdetail', requireLogin, (req, res) => {
  const user=req.session.user ||req.session.userData;

  if(!user)
  {
  return res.status(401).json({ error:"Not Authenticated"});
  }

  res.json({
    name:[user.fname, user.lname].filter(Boolean).join(" "),
    username:user.username,
    user_type:user.user_type
    
  });
});
app.get('/api/equipments',requireLogin, async (req, res) => {
  try {
    // This line fetches all equipment from the 'Equipments' collection in your database
    const equipments = await db.collection("Equipments").find({}).toArray();
    res.json(equipments);
  } catch (err) {
    res.status(500).json({ error: "Failedd to fetch equipments" });
  }
});

app.post('/api/reservations',requireLogin, async (req, res) => {
  try {
    const { customer_name, end_date, location, address, payment, equipment_ids, total_cost } = req.body;
    if (!customer_name || !end_date|| !location|| !address|| !payment || !equipment_ids) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    // Parse equipment_ids if it's a JSON string
    let equipmentIds = equipment_ids;
    if (typeof equipmentIds === 'string') {
      try {
        equipmentIds = JSON.parse(equipmentIds);
      } catch {
        equipmentIds = [];
      }
    }
    // Fix: Always call ObjectId as a function, not as a constructor
    const objectIds = equipmentIds.map(id => {
      try {
        // If id is already an ObjectId, return id
        if (typeof id === 'object' && id && (id._bsontype === 'ObjectID' || id._bsontype === 'ObjectId')) return id;
        // If id is a string of 24 hex chars, convert to ObjectId
        if (typeof id === 'string' && /^[a-fA-F0-9]{24}$/.test(id)) return new ObjectId(id);
        return id;
      } catch {
        return id;
      }
    });

    // --- New: Get user _id if logged in ---
    let user_id = null;
    if (req.session && req.session.user_name) {
      const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
      if (user && user._id) {
        user_id = user._id;
      }
    }
    // --- End new code ---
    const orderId= await getNextSequence("orderId");
    const data = {
      orderId,
      customer_name,
      end_date,
      order_date:new Date().toISOString().split('T')[0],
      location,
      address,
      payment,
      status: "Renting",
      history_equipment_ids: equipmentIds,
      equipment_ids: equipmentIds,
      ...(user_id && { user_id }), // Only add user_id if found
      ...(total_cost && { total_cost: Number(total_cost) }), // Added  total_cost if present
      created_at:new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    await db.collection("Reservations").insertOne(data);

    // Debug: Log what IDs are being used for update
    console.log("Updating Equipments with IDs:", objectIds);

    // Remove any non-ObjectId values from objectIds
    const validObjectIds = objectIds.filter(id => ObjectId.isValid(id) && typeof id === 'object');

    // Log validObjectIds for debugging
    console.log("Valid ObjectIds for update:", validObjectIds);

    // --- NEW LOGIC: Decrement quantity_available and update availability ---
    if (validObjectIds.length > 0) {
      // Fetch all selected equipment
      const equipments = await db.collection("Equipments").find({ _id: { $in: validObjectIds } }).toArray();
      for (const eq of equipments) {
        if (typeof eq.quantity_available === 'number' && eq.quantity_available > 0) {
          const newQty = eq.quantity_available - 1;
          await db.collection("Equipments").updateOne(
            { _id: eq._id },
            {
              $set: {
                quantity_available: newQty,
                availability: newQty > 0,
                unavailable_until: new Date(end_date)
              }
            }
          );
        }
      }
    } else {
      console.log("No valid equipment IDs to update availability.");
    }
    // --- END NEW LOGIC ---

    res.json({ message: 'Reservation created successfully', ...data });
  } catch (err) {
    console.log(`Insert error to the ${dbname} database`, err);
    res.status(500).json({ error: "Failed to create reservation: " + err.message });
  }
});
app.post("/payments",requireLogin, async(req,res)=>{
  const{customer_name,card_number,expiration,card_type,payment_nickname}=req.body;
  if (!customer_name || !card_number|| !expiration|| !card_type|| !payment_nickname) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  try {
    let user_id = null;
    if (req.session && req.session.user_name) 
    {
      const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
      if (user && user._id) {
        user_id = user._id;
      }
      if(user&&user._id)
      {
        function formatExpiration(dateString)
        {
          const date=new Date(dateString);
          const month= String(date.getMonth()+1).padStart(2,'0');
          const year=String(date.getFullYear()).slice(-2);
          return`${month}/${year}`;
        }

        const cleanedExpiration=formatExpiration(expiration);
        const card_last4=card_number.slice(-4);

        const paymentEntry = {
          customer_name,
          last4:card_last4,
          card_type,
          expiration:cleanedExpiration,
          payment_nickname,
          status:"active",
          added_at:new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        await db.collection("RentalUsers").updateOne(
          {_id:user._id},
          {$push:{payment:paymentEntry},
          $set:{updated_at:new Date().toISOString().replace('T', ' ').substring(0, 19)}}
        );
        console.log(`Payment method added to ${dbname} database for userId:`,user.fname+" "+user.lname);
        res.json({ message: 'Payment added successfully', ...paymentEntry });

      }
      else
      {
        throw new Error("User not found in session.");
      }
    }
    else
    {
      throw new Error("User session is not available");

    }

   
  } catch(err) {
    console.log(`Payment Insert error to the ${dbname} database`,err);
    return res.redirect(`equipment-reservation.html`);
  }
})
app.post("/addresses",requireLogin, async(req,res)=>{
  const{street,city,state,zip_code,phone_number,address_nickname}=req.body;
  if (!street|| !city|| !state||!zip_code|| !phone_number|| !address_nickname) {
      return res.status(400).json({ error: 'All fields are required' });
    }
  try {
    let user_id = null;
    if (req.session && req.session.user_name) 
    {
      const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
      if (user && user._id) {
        user_id = user._id;
      }
   
      if(user&&user._id)
      {
        const addressEntry = {
          customer_name:user.fname+" "+user.lname,
          address_line1:street,
          city,
          state,
          zip_code,
          phone_number,
          address_nickname,
          added_at:new Date().toISOString().replace('T', ' ').substring(0, 19),
        };
        await db.collection("RentalUsers").updateOne(
          {_id:user._id},
          {$push:{address:addressEntry},
          $set:{updated_at:new Date().toISOString().replace('T', ' ').substring(0, 19)}}
        );
        console.log(`Address added to ${dbname} database for userId:`,user.fname+" "+user.lname);
        res.json({ message: 'Address added successfully', ...addressEntry });

      }
      else
      {
        throw new Error("User not found in session.");
      }
    }
    else
    {
      throw new Error("User session is not available");

    }

   
  } catch(err) {
    console.log(`Address Insert error to the ${dbname} database`,err);
    return res.redirect(`equipment-reservation.html`);
  }
})
app.post('/api/return', requireLogin, async (req, res) => {
  try {
    if (!req.session || !req.session.user_name) {
      return res.status(401).json({ success: false, error: "Not logged in" });
    }
    const { equipmentId } = req.body;
    if (!equipmentId) {
      return res.status(400).json({ success: false, error: "No equipment ID provided" });
    }
    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Find reservation(s) containing this equipment for this user (compare as string)
    const reservations = await db.collection('Reservations').find({ user_id: user._id }).toArray();
    let reservation = null;
    let matchedIdType = null;
    for (const resv of reservations) {
      if (Array.isArray(resv.equipment_ids)) {
        for (const id of resv.equipment_ids) {
          if (
            (typeof id === 'object' && id && id._bsontype && id.toString() === equipmentId) ||
            (typeof id === 'string' && id === equipmentId)
          ) {
            reservation = resv;
            matchedIdType = typeof id;
            break;
          }
        }
      }
      if (reservation) break;
    }
    if (!reservation) {
      return res.status(404).json({ success: false, error: "Reservation not found for this equipment" });
    }

    // Remove equipment from reservation
    let updatedEquipmentIds = reservation.equipment_ids.filter(id => {
      if (typeof id === 'object' && id && id._bsontype) {
        return id.toString() !== equipmentId;
      }
      return id !== equipmentId;
    });
    if (updatedEquipmentIds.length === 0) {
     await db.collection('Reservations').updateOne(
      {_id:reservation._id},
      {$set: {equipment_ids:[],status:"Complete",updated_at:new Date().toISOString().replace('T', ' ').substring(0, 19)} }
     );
    } else {
      await db.collection('Reservations').updateOne(
        { _id: reservation._id },
        { $set: { equipment_ids: updatedEquipmentIds } }
      );
    }

    // --- NEW LOGIC: Increment quantity_available and update availability ---
    let eqId = ObjectId.isValid(equipmentId) ? new ObjectId(equipmentId) : equipmentId;
    const equipment = await db.collection('Equipments').findOne({ _id: eqId });
    if (equipment) {
      const newQty = (equipment.quantity_available || 0) + 1;
      await db.collection('Equipments').updateOne(
        { _id: eqId },
        {
          $set: {
            quantity_available: newQty,
            availability: newQty > 0
          },
          $unset: { unavailable_until: "" }
        }
      );
    }
    // --- END NEW LOGIC ---

    return res.json({ success: true });
  } catch (err) {
    console.error("Return error:", err);
    return res.status(500).json({ success: false, error: "Server error: " + err.message });
  }
});

// Automatically make equipment available again after the return date
setInterval(async () => {
  try {
    const now = new Date();
    // --- NEW LOGIC: Only set availability true if quantity_available > 0 ---
    await db.collection("Equipments").updateMany(
      { unavailable_until: { $lte: now }, availability: false, quantity_available: { $gt: 0 } },
      { $set: { availability: true }, $unset: { unavailable_until: "" } }
    );
    // --- END NEW LOGIC ---
  } catch (err) {
    console.error("Error updating equipment availability:", err);
  }
}, 60 * 1000); // Runs every 1 minute

app.get('/api/userinfo', async (req, res) => {
  try {
    // Only proceed if user is logged in
    if (!req.session || !req.session.user_name) {
      console.log("User not found or not logged in.");
      return res.json({ name: "Customer" });
    }
    // Find the user in the DB by username (as stored in session)
    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (user) {
      // Return full name: first name + last name
      return res.json({ name: user.fname + " " + user.lname });
    } else {
      console.log("User not found in database for username:", req.session.user_name);
      return res.json({ name: req.session.user_name });
    }
  } catch (err) {
    console.log("User not found or error occurred.");
    return res.json({ name: "Customer" });
  }
});
app.get('/api/myrentals', async (req, res) => {
  try {
    // Check if user is logged in
    if (!req.session || !req.session.user_name) {
      return res.status(401).json({ error: "Not logged in" });
    }
    // Find user by last name (as stored in session)
    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    // Find all reservations for this user
    const reservations = await db.collection('Reservations').find({ user_id: user._id }).toArray();
    // Gather all equipment IDs from reservations
    const equipmentIdSet = new Set();
    reservations.forEach(resv => {
      if (Array.isArray(resv.equipment_ids)) {
        resv.equipment_ids.forEach(id => {
          // Accept both ObjectId and string
          if (typeof id === 'object' && id && id._bsontype) {
            equipmentIdSet.add(id.toString());
          } else if (typeof id === 'string') {
            equipmentIdSet.add(id);
          }
        });
      }
    });
    if (equipmentIdSet.size === 0) {
      return res.json([]);
    }
    // Fetch equipment details
    const equipmentIds = Array.from(equipmentIdSet).map(id => {
      try {
        return ObjectId.isValid(id) ? new ObjectId(id) : null;
      } catch {
        return null;
      }
    }).filter(Boolean);
    const equipments = await db.collection('Equipments').find({ _id: { $in: equipmentIds } }).toArray();
    // Return a simplified list
    const result = equipments.map(eq => ({
      id: eq._id,
      name: eq.name || eq.equipmentName || "Equipment",
      description: eq.description || "",
      image: eq.image || ""
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch user rentals" });
  }
});
app.get('/api/myreservations', async (req, res) => {
  try {
    if (!req.session || !req.session.user_name) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (!user) return res.status(404).json({ error: "User not found" });

    const reservations = await db.collection('Reservations').find({ user_id: user._id }).toArray();
    if (reservations.length === 0) return res.json([]);

    const allEquipmentIds = reservations.flatMap(r => r.history_equipment_ids || []);
    const uniqueIds = [...new Set(allEquipmentIds.map(id => id.toString()))];
    const objectIds = uniqueIds.map(id => ObjectId.isValid(id) ? new ObjectId(id) : null).filter(Boolean);

    const equipmentMap = {};
    const equipmentDocs = await db.collection('Equipments').find({ _id: { $in: objectIds } }).toArray();
    equipmentDocs.forEach(eq => {
      equipmentMap[eq._id.toString()] = eq.name || eq.equipmentName || "Equipment";
    });

    // Build result
    const result = reservations.map(r => ({
      order_id: r.orderId || 'N/A',
      order_date: r.order_date,
      end_date: r.end_date,
      status: r.status || "Renting",
      location: r.location || "",
      total_cost: r.total_cost || 0,
      items: (r.history_equipment_ids || []).map(id => equipmentMap[id.toString()] || "Unknown")
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reservations" });
  }
});
app.get('/api/mypayments', async (req, res) => {
  try {
    if (!req.session || !req.session.user_name) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (!user) return res.status(404).json({ error: "User not found" });

    const payments =user.payment||[];


    // Build result
    const result = payments.map((p,index) => ({
      customer_name: p.customer_name || 'N/A',
      last4: p.last4,
      expiration: p.expiration,
      status: p.status || "Active",
      card_type:p.card_type|| "N/A",
      payment_nickname: p.payment_nickname || "N/A"
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Payment Methods" });
  }
});
app.get('/api/myaddress', async (req, res) => {
  try {
    if (!req.session || !req.session.user_name) {
      return res.status(401).json({ error: "Not logged in" });
    }

    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (!user) return res.status(404).json({ error: "User not found" });

    const addresses = user.address||[];

    // Build result
    const result = addresses.map((p,index) => ({
      customer_name:p.customer_name||"N/A",
      address_line1: p.address_line1,
      city: p.city,
      state: p.state,
      zip_code:p.zip_code,
      phone_number:p.phone_number ||"N/A",
      address_nickname: p.address_nickname || "Saved Address"
    }));

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch Address Book" });
  }
});
app.delete('/api/delete-payment', async (req, res) => {
  const{last4,expiration}=req.body;
  if (!req.session || !req.session.user_name) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (!user) return res.status(404).json({ error: "User not found" });

    const result =await db.collection('RentalUsers').updateOne({_id:user._id},{$pull:{payment:{last4,expiration}}});
    if(result.modifiedCount>0)
    {
      res.json({success:true});
    }
    else
    {
      res.json({success:false,error: "Payment not found"});

    }
  } catch (err) {
    console.error('Delete payment error',err);
    res.status(500).json({ error: "Failed to remove Payment Method" });
  }
});

app.delete('/api/delete-address', async (req, res) => {
  const{address_nickname,address_line1}=req.body;
  if (!req.session || !req.session.user_name) {
    return res.status(401).json({ error: "Not logged in" });
  }

  try {
    const user = await db.collection('RentalUsers').findOne({ username: req.session.user_name });
    if (!user) return res.status(404).json({ error: "User not found" });

    const result =await db.collection('RentalUsers').updateOne(
      {_id:user._id},
      {$pull:{address:{address_nickname,address_line1}}}
    );
    if(result.modifiedCount>0)
    {
      res.json({success:true});
    }
    else
    {
      res.json({success:false,error: "Address not found"});
    }
  } catch (err) {
    console.error('Delete address error',err);
    res.status(500).json({ error: "Failed to remove Address" });
  }
});

// Equipment management endpoints for maintenance page
app.post('/api/equipment', upload.single('image'), async (req, res) => {
  try {
    const { name, category, description, rental_rate_per_day, quantity_available } = req.body;
    
    if (!name || !category || !rental_rate_per_day || !quantity_available) {
      return res.status(400).json({ error: 'Name, category, rental rate, and quantity are required' });
    }

    // Handle image path
    let imagePath = '';
    if (req.file) {
      // Store relative path from public folder
      imagePath = 'assets/img/equipment/' + req.file.filename;
    }

    const equipmentData = {
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      rental_rate_per_day: parseFloat(rental_rate_per_day),
      quantity_available: parseInt(quantity_available),
      availability: parseInt(quantity_available) > 0,
      image: imagePath,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    const result = await db.collection('Equipments').insertOne(equipmentData);
    res.json({ message: 'Equipment added successfully', equipment: { _id: result.insertedId, ...equipmentData } });
  } catch (err) {
    console.error('Add equipment error:', err);
    res.status(500).json({ error: 'Failed to add equipment' });
  }
});

app.delete('/api/equipment/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid equipment ID' });
    }

    const result = await db.collection('Equipments').deleteOne({ _id: new ObjectId(id) });
    
    if (result.deletedCount > 0) {
      res.json({ success: true, message: 'Equipment deleted successfully' });
    } else {
      res.json({ success: false, error: 'Equipment not found' });
    }
  } catch (err) {
    console.error('Delete equipment error:', err);
    res.status(500).json({ error: 'Failed to delete equipment' });
  }
});

app.put('/api/equipment/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, description, rental_rate_per_day, quantity_available } = req.body;
    
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: 'Invalid equipment ID' });
    }

    if (!name || !category || !rental_rate_per_day || quantity_available === undefined) {
      return res.status(400).json({ error: 'Name, category, rental rate, and quantity are required' });
    }

    const updateData = {
      name: name.trim(),
      category: category.trim(),
      description: description ? description.trim() : '',
      rental_rate_per_day: parseFloat(rental_rate_per_day),
      quantity_available: parseInt(quantity_available),
      availability: parseInt(quantity_available) > 0,
      updated_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };

    // Handle image update if new file is uploaded
    if (req.file) {
      updateData.image = 'assets/img/equipment/' + req.file.filename;
    }

    const result = await db.collection('Equipments').updateOne(
      { _id: new ObjectId(id) },
      { $set: updateData }
    );
    
    if (result.modifiedCount > 0) {
      res.json({ success: true, message: 'Equipment updated successfully' });
    } else {
      res.json({ success: false, error: 'Equipment not found or no changes made' });
    }
  } catch (err) {
    console.error('Update equipment error:', err);
    res.status(500).json({ error: 'Failed to update equipment' });
  }
});
