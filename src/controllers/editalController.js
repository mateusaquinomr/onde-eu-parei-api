const Edital = require('../models/Edital');
const Topic = require('../models/Topic');

const getAllEditais = async (req, res) => {
    try {
        const editais = await Edital.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(editais);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar editais' });
    }
};

const getEditalById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'ID do edital inválido' });
        }

        const edital = await Edital.findOne({ _id: id, userId: req.user.id });
        if (!edital) {
            return res.status(404).json({ message: 'Edital não encontrado' });
        }
        res.json(edital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar edital' });
    }
};

const createEdital = async (req, res) => {
    try {
        const { nome, banca, dataProva, local } = req.body;

        const editalExistente = await Edital.findOne({
            nome: nome.trim(),
            userId: req.user.id
        });

        if (editalExistente) {
            return res.status(400).json({ message: 'Já existe um edital com este nome' });
        }

        const newEdital = new Edital({
            userId: req.user.id,
            nome,
            banca,
            dataProva,
            local,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newEdital.save();
        res.status(201).json(newEdital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar edital' });
    }
};

const updateEdital = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'ID do edital inválido' });
        }

        const edital = await Edital.findOne({ _id: id, userId: req.user.id });
        if (!edital) {
            return res.status(404).json({ message: 'Edital não encontrado' });
        }

        const allowedUpdates = ['nome', 'banca', 'dataProva', 'local'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                edital[field] = req.body[field];
            }
        });

        edital.updatedAt = new Date();
        await edital.save();

        res.json(edital);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar edital' });
    }
};

const deleteEdital = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'ID do edital inválido' });
        }

        const edital = await Edital.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!edital) {
            return res.status(404).json({ message: 'Edital não encontrado' });
        }

        await Topic.updateMany(
            { editalId: id, userId: req.user.id },
            { editalId: null }
        );

        res.json({ message: 'Edital deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar edital' });
    }
};

const getTopicsByEdital = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'ID do edital inválido' });
        }

        const edital = await Edital.findOne({ _id: id, userId: req.user.id });
        if (!edital) {
            return res.status(404).json({ message: 'Edital não encontrado' });
        }

        const topics = await Topic.find({ editalId: id, userId: req.user.id });
        res.json(topics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar tópicos do edital' });
    }
};

const getEditalProgress = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'ID do edital inválido' });
        }

        const edital = await Edital.findOne({ _id: id, userId: req.user.id });
        if (!edital) {
            return res.status(404).json({ message: 'Edital não encontrado' });
        }

        const topics = await Topic.find({ editalId: id, userId: req.user.id });
        const totalTopicos = topics.length;
        const concluidos = topics.filter(t =>
            t.contents.every(c => c.completed === true)
        ).length;

        const progresso = totalTopicos > 0
            ? Math.round((concluidos / totalTopicos) * 100)
            : 0;

        res.json({
            topicosCount: totalTopicos,
            concluidos,
            progresso
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar progresso' });
    }
};

module.exports = {
    getAllEditais,
    getEditalById,
    createEdital,
    updateEdital,
    deleteEdital,
    getTopicsByEdital,
    getEditalProgress
};