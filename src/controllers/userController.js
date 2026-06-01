const User = require('../models/User');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json({
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email,
            createdAt: user.createdAt,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (req.body.name !== undefined) user.name = req.body.name;
        if (req.body.username !== undefined) user.username = req.body.username;
        if (req.body.email !== undefined) user.email = req.body.email;

        if (req.body.email && req.body.email !== user.email) {
            const emailExists = await User.findOne({ email: req.body.email, _id: { $ne: user._id } });
            if (emailExists) {
                return res.status(400).json({ message: 'E-mail já cadastrado' });
            }
        }

        if (req.body.username && req.body.username !== user.username) {
            const usernameExists = await User.findOne({ username: req.body.username, _id: { $ne: user._id } });
            if (usernameExists) {
                return res.status(400).json({ message: 'Usuário já existe' });
            }
        }

        await User.updateOne(
            { _id: user._id },
            {
                $set: {
                    name: user.name,
                    username: user.username,
                    email: user.email,
                }
            }
        );

        const updatedUser = await User.findById(user._id).select('-password');

        console.log('✅ Perfil atualizado com sucesso!');

        res.json({
            id: updatedUser._id,
            name: updatedUser.name,
            username: updatedUser.username,
            email: updatedUser.email,
            createdAt: updatedUser.createdAt,
        });
    } catch (error) {
        console.error('❌ Erro no updateProfile:', error);
        res.status(500).json({ message: error.message });
    }
};

const uploadAvatar = async (req, res) => {
    res.json({ avatarUrl: req.file?.path || null });
};

module.exports = { getProfile, updateProfile, uploadAvatar };