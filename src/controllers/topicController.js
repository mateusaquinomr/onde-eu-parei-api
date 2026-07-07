const Topic = require('../models/Topic');

const getTopics = async (req, res) => {
    try {
        const topics = await Topic.find({ userId: req.user.id }).sort({ updatedAt: -1 });
        res.json(topics);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar tópicos' });
    }
};

const getTopicById = async (req, res) => {
    try {
        const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.id });
        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }
        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar tópico' });
    }
};

const createTopic = async (req, res) => {
    try {
        const { name, notebookColor, difficulty, tags, contents, editalId } = req.body;

        const newTopic = new Topic({
            userId: req.user.id,
            name,
            notebookColor: notebookColor || 'azul',
            difficulty: difficulty || 'medio',
            editalId: editalId || null,
            tags: tags || [],
            contents: contents.map((c, index) => ({
                id: require('crypto').randomUUID(),
                title: c.title,
                importance: c.importance || 'normal',
                order: index,
                createdAt: new Date(),
                checklist: [],
                studyData: {
                    totalTimeSpent: 0,
                    notes: '',
                    startedAt: null,
                    completedAt: null,
                    lastReviewDate: null,
                    nextReviewDate: null,
                    reviewHistory: [],
                    questionLists: []
                }
            })),
            lastAccessed: new Date(),
            createdAt: new Date(),
            updatedAt: new Date()
        });

        await newTopic.save();
        res.status(201).json(newTopic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar tópico' });
    }
};

const updateTopic = async (req, res) => {
    try {
        const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.id });
        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }

        const allowedUpdates = ['name', 'notebookColor', 'difficulty', 'tags', 'contents', 'totalMinutes', 'lastAccessed', 'editalId'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                topic[field] = req.body[field];
            }
        });

        topic.updatedAt = new Date();
        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar tópico' });
    }
};

const deleteTopic = async (req, res) => {
    try {
        const topic = await Topic.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }
        res.json({ message: 'Tópico deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar tópico' });
    }
};

const addStudyMinutes = async (req, res) => {
    try {
        const { minutes } = req.body;
        const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.id });

        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }

        topic.totalMinutes = (topic.totalMinutes || 0) + minutes;
        topic.lastAccessed = new Date();
        topic.updatedAt = new Date();
        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao adicionar minutos' });
    }
};

const updateContentNotes = async (req, res) => {
    try {
        const { notes } = req.body;
        const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.id });

        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }

        const content = topic.contents.find(c => c.id === req.params.contentId);
        if (!content) {
            return res.status(404).json({ message: 'Conteúdo não encontrado' });
        }

        content.studyData.notes = notes;
        topic.updatedAt = new Date();
        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar notas' });
    }
};

const updateContentChecklist = async (req, res) => {
    try {
        const { checklist } = req.body;
        const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.id });

        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }

        const content = topic.contents.find(c => c.id === req.params.contentId);
        if (!content) {
            return res.status(404).json({ message: 'Conteúdo não encontrado' });
        }

        content.checklist = checklist;
        topic.updatedAt = new Date();
        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar checklist' });
    }
};

const updateContentQuestions = async (req, res) => {
    try {
        const { questionLists } = req.body;
        const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.id });

        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }

        const content = topic.contents.find(c => c.id === req.params.contentId);
        if (!content) {
            return res.status(404).json({ message: 'Conteúdo não encontrado' });
        }

        content.studyData.questionLists = questionLists;
        topic.updatedAt = new Date();
        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar questões' });
    }
};

const markContentAsCompleted = async (req, res) => {
    try {
        const topic = await Topic.findOne({ _id: req.params.id, userId: req.user.id });

        if (!topic) {
            return res.status(404).json({ message: 'Tópico não encontrado' });
        }

        const content = topic.contents.find(c => c.id === req.params.contentId);
        if (!content) {
            return res.status(404).json({ message: 'Conteúdo não encontrado' });
        }

        content.completed = true;
        content.studyData.completedAt = new Date();
        topic.updatedAt = new Date();
        await topic.save();

        res.json(topic);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao marcar conteúdo como concluído' });
    }
};

module.exports = {
    getTopics,
    getTopicById,
    createTopic,
    updateTopic,
    deleteTopic,
    addStudyMinutes,
    updateContentNotes,
    updateContentChecklist,
    updateContentQuestions,
    markContentAsCompleted
};