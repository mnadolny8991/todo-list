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

async function setTaskStatus(taskId, newStatus) {
    await db.none('UPDATE tasks SET status = $1 WHERE id = $2', [newStatus, taskId]);
}

async function deleteTask(taskId) {
    await db.none('DELETE FROM tasks WHERE id = $1', taskId);
}

module.exports = {
    getUsers, 
    getTasks, 
    addTask, 
    addUser,
    getUserByLogin,
    setTaskStatus,
    deleteTask
};
