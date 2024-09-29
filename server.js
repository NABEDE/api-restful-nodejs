require('dotenv').config();
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const { users } = require('./users');

const app = express();
const PORT = 8080;

app.use(bodyParser.json());

// Middleware pour vérifier le token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401); // Unauthorized

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Sauvegarder l'utilisateur dans la requête
        next();
    });
}

// Liste de posts (exemple)
const posts = [
    { id: 1, title: "Post 1", content: "Contenu du post 1", username: "Kyle" },
    { id: 2, title: "Post 2", content: "Contenu du post 2", username: "Tom" },
];

// Route de connexion
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username);
    if (!user) return res.sendStatus(404); // Not Found

    // Vérifier le mot de passe
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.sendStatus(403); // Forbidden

    // Générer un token
    const accessToken = jwt.sign({ name: user.username, role: user.role }, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
});

// Route pour récupérer tous les posts
app.get('/', authenticateToken, (req, res) => {
    res.json(posts);
});

// Route protégée
app.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: 'Vous êtes autorisé à accéder à cette route protégée!', user: req.user });
});

// Route pour vérifier les autorisations
app.get('/authorize', authenticateToken, (req, res) => {
    // Vérifiez si l'utilisateur a le rôle 'admin'
    if (req.user.role === 'admin') {
        res.json({ message: 'Vous avez l\'autorisation d\'accéder à cette route.' });
    } else {
        res.sendStatus(403); // Forbidden
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});