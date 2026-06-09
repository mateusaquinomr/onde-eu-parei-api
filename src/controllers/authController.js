const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secretkey', {
        expiresIn: '30d',
    });
};

const register = async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { username }] });

        if (userExists) {
            if (userExists.email === email) {
                return res.status(400).json({ message: 'Email já cadastrado' });
            }
            if (userExists.username === username) {
                return res.status(400).json({ message: 'Username já existe' });
            }
        }

        const user = new User({ name, username, email, password });
        await user.save();

        res.status(201).json({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            token: generateToken(user._id),
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({
            $or: [{ email: email }, { username: email }]
        });

        if (user && (await user.matchPassword(password))) {
            res.json({
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                token: generateToken(user._id),
            });
        } else {
            res.status(401).json({ message: 'Email/usuário ou senha inválidos' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        if (user) {
            res.json({
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                createdAt: user.createdAt,
            });
        } else {
            res.status(404).json({ message: 'Usuário não encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro no servidor' });
    }
};

module.exports = { register, login, getProfile };