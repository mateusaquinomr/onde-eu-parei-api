const Task = require('../models/Task');

const getAllTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id }).sort({ createdAt: -1 });
        res.json(tasks);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar tarefas' });
    }
};

const createTask = async (req, res) => {
    try {
        const { title, description, dueDate } = req.body;

        if (!title || !title.trim()) {
            return res.status(400).json({ message: 'Título da tarefa é obrigatório' });
        }

        const newTask = new Task({
            userId: req.user.id,
            title: title.trim(),
            description,
            dueDate,
            createdAt: new Date()
        });

        await newTask.save();
        res.status(201).json(newTask);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar tarefa' });
    }
};

const updateTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'ID da tarefa inválido' });
        }

        const task = await Task.findOne({ _id: id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        const allowedUpdates = ['title', 'description', 'dueDate', 'completed'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                task[field] = req.body[field];
            }
        });

        if (req.body.completed === true && !task.completedAt) {
            task.completedAt = new Date();
        } else if (req.body.completed === false) {
            task.completedAt = undefined;
        }

        await task.save();
        res.json(task);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar tarefa' });
    }
};

const deleteTask = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id || id === 'undefined') {
            return res.status(400).json({ message: 'ID da tarefa inválido' });
        }

        const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });
        if (!task) {
            return res.status(404).json({ message: 'Tarefa não encontrada' });
        }

        res.json({ message: 'Tarefa deletada com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar tarefa' });
    }
};

module.exports = {
    getAllTasks,
    createTask,
    updateTask,
    deleteTask
};