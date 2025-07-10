const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const app = express();

const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'prorig_rentals';

app.use(bodyParser.json());
app.use(express.static(__dirname));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true
}));

let db;
MongoClient.connect(mongoUrl).then(client => {
  db = client.db(dbName);
  console.log('Connected to MongoDB');
  app.listen(3000, () => console.log('Server running on http://localhost:3000'));
});

// Serve Home.html at root
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/Home.html');
});

// Register endpoint
app.post('/api/register', async (req, res) => {
  const { name, username, email, password, cpassword, user_type } = req.body;
  if (password !== cpassword) return res.json({ success: false, message: 'Passwords do not match!' });
  const users = db.collection('users');
  const existing = await users.findOne({ username });
  if (existing) return res.json({ success: false, message: 'User already exists!' });
  const hash = await bcrypt.hash(password, 10);
  await users.insertOne({ name, username, email, password: hash, user_type });
  res.json({ success: true });
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await db.collection('users').findOne({ username });
  if (!user) return res.json({ success: false, message: 'Incorrect username or password!' });
  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false, message: 'Incorrect username or password!' });
  req.session.user = { name: user.name, user_type: user.user_type };
  res.json({ success: true, user_type: user.user_type });
});

// Logout endpoint (call this from frontend to log out the user)
app.post('/api/logout', (req, res) => {
  req.session.destroy(() => res.json({ success: true }));
});
