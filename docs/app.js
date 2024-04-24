const express = require('express');
const path = require('path');
const mysql = require('mysql'); // Include the mysql module
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Create connection to MySQL database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'splendidserenity'
});

// Connect to MySQL database
connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set up view engine and views directory
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Define routes

// Render index.ejs on root path '/'
app.get('/', (req, res) => {
    res.render('index');
});

//Render signup.ejs on '/signup' path
app.get('/signup', (req, res) => {
    res.render('signup');
});

// Render home.ejs on '/home' path
app.get('/home', (req, res) => {
    res.render('home');
});

// Render store.ejs on '/store' path
app.get('/store', (req, res) => {
    res.render('store');
});

// Handle POST request to '/signup'
app.post('/submit', (req, res) => {
    const { fname, phnum, email, passw } = req.body;
    const sql = `INSERT INTO LOGIN_SIGNUP (FName, Phone, Email, Password) VALUES (?, ?, ?, ?)`;
    connection.query(sql, [fname, phnum, email, passw], (err, result) => {
        if (err) {
            console.error('Error creating user:', err);
            res.status(500).send('Error Creating User Account !');
        } else {
            res.redirect('/');
        }
    });
});

// Handle POST request to '/index' (login)
app.post('/check', (req, res) => {
    const { email, passw } = req.body;
    const sql = `SELECT * FROM LOGIN_SIGNUP WHERE Email = ? AND Password = ?`;
    connection.query(sql, [email, passw], (err, result) => {
        if (err) {
            console.error('Error logging in:', err);
            res.status(500).send('Error Logging In !!');
        } else {
            if (result.length > 0) {
                // User authenticated
                res.redirect('/home');
            } else {
                // Invalid credentials
                res.redirect('/signup');
            }
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
