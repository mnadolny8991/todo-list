let users = [
];

let tasks = [
    {
        id: 0,
        description: 'Do the dishes',
        due: new Date(2024, 10, 27, 22, 0, 0),
        status: 'planned',
        userId: 0
    },
    {
        id: 1,
        description: 'Do the loundary',
        due: new Date(2025, 2, 2, 21, 0, 0),
        status: 'complete',
        userId: 0
    },
    {
        id: 2,
        description: 'Learn about using gpt',
        due: new Date(2055, 5, 5, 5, 0, 55),
        status: 'planned',
        userId: 0
    }
];

let id = 3;

exports.tasks = tasks;
exports.users = users;
exports.id = id;