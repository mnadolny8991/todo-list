const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:postgres@127.0.0.1:5432/task_db');

const app = express();

let uid = 0;

app.use(express.json());
app.use(cors());

let { tasks, users, id } = require('./data');

app.post('/tasks', authorize, (req, res) => {
    const task = { 
        id: id++,
        description: req.body.description,
        due: req.body.due,
        status: req.body.status 
    };
    if (!task.description || !task.due) {
        return res.sendStatus(400);
    }
    if (!task.status) task.status = 'planned';

    // Get user id from jwt token
    task.userId = req.payload.sub;

    tasks.push(task);
    res.sendStatus(201);
});

app.get('/tasks', authorize, (req, res) => {
    res.json(tasks.filter(t => t.userId === req.payload.sub));
});

app.get('/users', async (req, res) => {
    const data = await db.any('SELECT * FROM users');
    console.log(data);
});

app.post('/users', async (req, res) => {
    const userData = { 
        login: req.body.login, 
        password: req.body.password 
    };
    if (!userData.login || !userData.password) {
        return res.status(400).send('login and password required');
    }
    try {
        const hash = await bcrypt.hash(userData.password, 10);
        users.push({ 
            id: uid++,
            login: userData.login,
            password: hash
        });
        res.sendStatus(201);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/users', async (req, res) => {
    try {
        console.log('hhhh');
        const data = await db.any('SELECT * FROM users');
        console.log('eee');
        console.log(data);
    } catch (e) {
        console.log('error');
        console.log|(e);
    }
    res.json(users);
});

app.post('/login', authenticate, async (req, res) => {
    const user = req.user;
    console.log('user authenticated');
    console.log(user);
    jwt.sign({
        sub: user.id,
        login: user.login
    }, 'shhhhh', function(err, token) {
        if (err) return res.status(500).send('unable to create token');
        res.send(token);
    });
});

async function authenticate(req, res, next) {
    const userData = { 
        login: req.body.login, 
        password: req.body.password 
    };
    if (!userData.login || !userData.password) {
        return res.status(400).send('login and password required');
    }
    const user = users.find(u => u.login === userData.login);
    if (!user) {
        return res.status(400).send('bad login');
    }
    try {
        const result = await bcrypt.compare(
            userData.password, 
            user.password
        );
        if (!result) {
            return res.status(400).send('bad password');
        }
        req.user = user;
        next();
    } catch (e) {
        res.status(500).send('something went wrong');
    }
}

async function authorize(req, res, next) {
    const auth = req.get('Authorization');
    if (!auth) {
        return res.status(400).send('no authorization');
    }
    // Authorization: Bearer [token]
    const token = auth.split(' ')[1];
    try {
        const decoded = jwt.verify(token, 'shhhhh');
        console.log(decoded);
        req.payload = decoded;
        next();
    } catch (e) {
        res.status(400).send('bad token');
    }
}

app.listen(9000);