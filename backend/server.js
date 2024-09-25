const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const sqlite3 = require('sqlite3').verbose();




const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

// Serve static files from the React app




// Initialize SQLite database
const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
        }
        else{
            console.log('Connected to SQLite database.');
        }
        });

db.serialize(() => {
    db.run("CREATE TABLE users (id TEXT PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT)");
    db.run("CREATE TABLE todos (id TEXT PRIMARY KEY, userId TEXT, title TEXT, status TEXT, FOREIGN KEY(userId) REFERENCES users(id))");
});

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });

    jwt.verify(token, 'secretkey', (err, decoded) => {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
        req.userId = decoded.id;
        next();
    });
};

// User registration
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);
    const userId = uuidv4();

    db.run("INSERT INTO users (id, name, email, password) VALUES (?, ?, ?, ?)", [userId, name, email, hashedPassword], (err) => {
        if (err) return res.status(500).send("There was a problem registering the user.");
        const token = jwt.sign({ id: userId }, 'secretkey', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});
app.get('/',(req,res)=>{
    res.json("hello")
})

// User login
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');

        const passwordIsValid = bcrypt.compareSync(password, user.password);
        if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });

        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: 86400 });
        res.status(200).send({ auth: true, token });
    });
});

// Get user profile
app.get('/api/profile', verifyToken, (req, res) => {
    db.get("SELECT * FROM users WHERE id = ?", [req.userId], (err, user) => {
        if (err) return res.status(500).send('Error on the server.');
        if (!user) return res.status(404).send('No user found.');
        res.status(200).send(user);
    });
});

// Update user profile
app.put('/api/profile', verifyToken, (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 8);

    db.run("UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?", [name, email, hashedPassword, req.userId], (err) => {
        if (err) return res.status(500).send("There was a problem updating the user.");
        res.status(200).send("User updated successfully.");
    });
});

// Create a new todo
app.post('/api/todos', verifyToken, (req, res) => {
    const { title, status } = req.body;
    const todoId = uuidv4();

    db.run("INSERT INTO todos (id, userId, title, status) VALUES (?, ?, ?, ?)", [todoId, req.userId, title, status], (err) => {
        if (err) return res.status(500).send("There was a problem adding the todo.");
        res.status(200).send("Todo added successfully.");
    });
});

// Get all todos for the authenticated user
app.get('/api/todos', verifyToken, (req, res) => {
    db.all("SELECT * FROM todos WHERE userId = ?", [req.userId], (err, todos) => {
        if (err) return res.status(500).send("There was a problem retrieving the todos.");
        res.status(200).send(todos);
    });
});

// update todo as mark as completed to strike with css
app.put('/api/todos/:id',  (req, res) => {
    const { id } = req.params;
    const { title,status } = req.body;
    db.run("UPDATE todos SET status=? WHERE id = ?", [status, id],(err)=>{
        if (err) return res.status(500).send("There was a problem updating the todo")
            res.status(200).send("Todo updated successfully");
    } )
    });
                
       


// Delete a todo
app.delete('/api/todos/:id', verifyToken, (req, res) => {
    const todoId = req.params.id;

    db.run("DELETE FROM todos WHERE id = ? AND userId = ?", [todoId, req.userId], (err) => {
        if (err) return res.status(500).send("There was a problem deleting the todo.");
        res.status(200).send("Todo deleted successfully.");
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
