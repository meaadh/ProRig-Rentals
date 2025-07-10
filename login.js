const express = require('express');
const session = require('express-session');
const md5 = require('md5');
const connectToDB = require('./db');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// POST /login route
app.post('/login', async (req, res) => {
  const { name, username, email, password, cpassword, user_type } = req.body;

  const hashedPass = md5(password);

  try {
    const db = await connectToDB();
    const user = await db.collection('users').findOne({
      username: username,
      password: hashedPass
    });

    if (user) {
      if (user.user_type === 'admin') {
        req.session.admin_name = user.name;
        return res.redirect('/adminPage');
      } else if (user.user_type === 'user') {
        req.session.user_name = user.name;
        return res.redirect('/userPage');
      } else if (user.user_type === 'reviewer') {
        req.session.user_name = user.name;
        return res.redirect('/reviewerPage');
      } else if (user.user_type === 'author') {
        req.session.user_name = user.name;
        return res.redirect('/authorPage');
      } else {
        return res.send('Unknown user type');
      }
    } else {
      return res.send('Incorrect username or password!');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Example "pages"
app.get('/adminPage', (req, res) => {
  res.send(`Welcome Admin: ${req.session.admin_name}`);
});
app.get('/userPage', (req, res) => {
  res.send(`Welcome User: ${req.session.user_name}`);
});
app.get('/reviewerPage', (req, res) => {
  res.send(`Welcome Reviewer: ${req.session.user_name}`);
});
app.get('/authorPage', (req, res) => {
  res.send(`Welcome Author: ${req.session.user_name}`);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
