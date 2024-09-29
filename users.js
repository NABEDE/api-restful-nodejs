const bcrypt = require('bcryptjs');

const users = [
    {
        username: 'Kyle',
        password: bcrypt.hashSync('password123', 8) // Mot de passe crypté
    },
    {
        username: 'Tom',
        password: bcrypt.hashSync('mypassword', 8) // Mot de passe crypté
    }
];

module.exports = { users };