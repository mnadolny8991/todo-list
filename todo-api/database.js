const pgp = require('pg-promise')();
const db = pgp('postgres://postgres:postgres@127.0.0.1:5432/task_db');

async function getUsers() {
    return await db.any('SELECT * FROM users');
}

async function getTasks(userId) {
    return await db.any('SELECT * FROM tasks WHERE user_id = $1', userId);
}

async function addUser(user) {
    await db.none('INSERT INTO users (login, password) VALUES (${login}, ${password})', user);
}

async function addTask(task) {
    await db.none('INSERT INTO tasks (description, due, status, user_id) '+
        'VALUES (${description}, ${due}, ${status}, ${userId})', task);
}

async function getUserByLogin(login) {
    const found = await db.any('SELECT * FROM users WHERE login = $1', login);
    if (found.length <= 0) return null;
    return found[0];
}

async function test() {
    await addUser({ login: 'marcin', password: '$2b$10$m72FxxJgZbfBmSesy9NWiuWMCeuJ9fNziuH5Yrt.99yuSF.Vtk6e.' });
    const users = await(getUsers());
    await addTask({ 
        description: 'Learn C',
        due: new Date('2026-03-03T03:00:00Z').toISOString(),
        status: 'complete',
        userId: '0'
    });
    const userTasks = await(getTasks(0));
    console.log(users);
    console.log(userTasks);
}

module.exports = {
    getUsers, 
    getTasks, 
    addTask, 
    addUser,
    getUserByLogin
};
