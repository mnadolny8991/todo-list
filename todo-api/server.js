const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const db = require('./database');

const app = express();

app.use(express.json());
app.use(cors());

app.patch('/tasks/:id/:status', authorize, async (req, res) => {
    const id = req.params.id;
    let status = req.params.status;
    if (status === 'in_progress') status = 'in progress';
    console.log(`${id}: ${status}`);
    await db.setTaskStatus(id, status);
    console.log('status updated successfully');
    return res.sendStatus(200);
})

app.post('/tasks', authorize, async (req, res) => {
    const task = { 
        description: req.body.description,
        due: req.body.due,
        status: req.body.status,
    };
    console.log(task);
    if (!task.description || !task.due) {
        return res.sendStatus(400);
    }
    if (!task.status) task.status = 'planned';

    // Get user id from jwt token
    task.userId = req.payload.sub;
    await db.addTask(task);
    res.sendStatus(201);
});

app.get('/tasks', authorize, async (req, res) => {
    const tasks = await db.getTasks(req.payload.sub);
    res.json(tasks);
});

app.get('/users', async (req, res) => {
    const users = await db.getUsers();
    res.json(users);
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
        await db.addUser({
            login: userData.login,
            password: hash
        });
        res.sendStatus(201);
    } catch (e) {
        res.status(500).send(e);
    }
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
    const user = await db.getUserByLogin(userData.login);
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