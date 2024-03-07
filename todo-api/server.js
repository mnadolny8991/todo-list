const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());

let { tasks, users, id } = require('./data');

app.post('/tasks', (req, res) => {
    const task = { 
        description: req.body.description,
        due: req.body.due,
        status: req.body.status 
    };
    if (!task.description || !task.due) {
        return res.sendStatus(400);
    }
    if (!task.status) task.status = 'planned';

    // Get user id from jwt token
    task.userId = 0;

    tasks.push(task);
    res.sendStatus(201);
});

app.get('/tasks', (req, res) => {
    return res.json(tasks);
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
            id: id++,
            login: userData.login,
            password: hash
        });
        res.sendStatus(201);
    } catch (e) {
        res.status(500).send(e);
    }
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.post('/login', authenticate, async (req, res) => {
    const user = req.user;

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

app.listen(9000);