const Cycle = require('../models/Cycle');

const formatCycle = (cycle) => {
    if (!cycle) return null;
    const cycleObj = cycle.toObject();
    return {
        ...cycleObj,
        id: cycleObj._id,
        blocks: cycleObj.blocks.map(block => ({
            ...block,
            id: block._id,
            _id: undefined
        })),
        _id: undefined
    };
};

const getActiveCycle = async (req, res) => {
    try {
        const cycle = await Cycle.findOne({ userId: req.user.id, isActive: true });
        res.json(formatCycle(cycle));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar ciclo ativo' });
    }
};

const getAllCycles = async (req, res) => {
    try {
        const cycles = await Cycle.find({ userId: req.user.id }).sort({ createdAt: -1 });
        const formattedCycles = cycles.map(cycle => formatCycle(cycle));
        res.json(formattedCycles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar ciclos' });
    }
};

const getCycleById = async (req, res) => {
    try {
        const cycle = await Cycle.findOne({ _id: req.params.id, userId: req.user.id });
        if (!cycle) {
            return res.status(404).json({ message: 'Ciclo não encontrado' });
        }
        res.json(formatCycle(cycle));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar ciclo' });
    }
};

const createCycle = async (req, res) => {
    try {
        const { config, blocks, totalMinutes, number, startedAt } = req.body;

        await Cycle.updateMany(
            { userId: req.user.id, isActive: true },
            { isActive: false, completedAt: new Date() }
        );

        const cycleNumber = number || (await Cycle.countDocuments({ userId: req.user.id })) + 1;

        const newCycle = new Cycle({
            userId: req.user.id,
            number: cycleNumber,
            config,
            blocks,
            totalMinutes,
            completedMinutes: 0,
            remainingMinutes: totalMinutes,
            createdAt: new Date(),
            updatedAt: new Date(),
            startedAt: startedAt || new Date(),
            isActive: true
        });

        await newCycle.save();
        res.status(201).json(formatCycle(newCycle));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao criar ciclo' });
    }
};

const updateCycle = async (req, res) => {
    try {
        const cycle = await Cycle.findOne({ _id: req.params.id, userId: req.user.id });
        if (!cycle) {
            return res.status(404).json({ message: 'Ciclo não encontrado' });
        }

        const allowedUpdates = ['blocks', 'totalMinutes', 'completedMinutes', 'remainingMinutes', 'isActive', 'completedAt'];
        allowedUpdates.forEach(field => {
            if (req.body[field] !== undefined) {
                cycle[field] = req.body[field];
            }
        });

        cycle.updatedAt = new Date();
        await cycle.save();

        res.json(formatCycle(cycle));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao atualizar ciclo' });
    }
};

const completeBlock = async (req, res) => {
    try {
        const cycle = await Cycle.findOne({ _id: req.params.id, userId: req.user.id });
        if (!cycle) {
            return res.status(404).json({ message: 'Ciclo não encontrado' });
        }

        const block = cycle.blocks.find(b => b.id === req.params.blockId);
        if (!block) {
            return res.status(404).json({ message: 'Bloco não encontrado' });
        }

        if (block.completed) {
            return res.status(400).json({ message: 'Bloco já concluído' });
        }

        block.completed = true;
        block.completedAt = new Date();

        cycle.completedMinutes += block.originalMinutes || block.minutes;
        cycle.remainingMinutes -= block.originalMinutes || block.minutes;
        cycle.updatedAt = new Date();

        const allCompleted = cycle.blocks.every(b => b.completed);
        if (allCompleted) {
            cycle.completedAt = new Date();
            cycle.isActive = false;
        }

        await cycle.save();
        res.json(formatCycle(cycle));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao completar bloco' });
    }
};

const decrementBlockMinutes = async (req, res) => {
    try {
        const { minutesToDecrement } = req.body;
        const cycle = await Cycle.findOne({ _id: req.params.id, userId: req.user.id });

        if (!cycle) {
            return res.status(404).json({ message: 'Ciclo não encontrado' });
        }

        const block = cycle.blocks.find(b => b.id === req.params.blockId);
        if (!block || block.completed) {
            return res.status(400).json({ message: 'Bloco não pode ser alterado' });
        }

        const newMinutes = Math.max(0, block.minutes - minutesToDecrement);
        block.minutes = newMinutes;

        const totalMinutes = cycle.blocks.reduce((sum, b) => sum + b.minutes, 0);
        const completedMinutes = cycle.blocks
            .filter(b => b.completed)
            .reduce((sum, b) => sum + (b.originalMinutes || b.minutes), 0);

        cycle.totalMinutes = totalMinutes;
        cycle.completedMinutes = completedMinutes;
        cycle.remainingMinutes = totalMinutes - completedMinutes;
        cycle.updatedAt = new Date();

        await cycle.save();
        res.json(formatCycle(cycle));
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao decrementar minutos' });
    }
};

const deleteCycle = async (req, res) => {
    try {
        const cycle = await Cycle.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
        if (!cycle) {
            return res.status(404).json({ message: 'Ciclo não encontrado' });
        }
        res.json({ message: 'Ciclo deletado com sucesso' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao deletar ciclo' });
    }
};

const getCycleSummary = async (req, res) => {
    try {
        const totalCycles = await Cycle.countDocuments({ userId: req.user.id });
        const cycles = await Cycle.find({ userId: req.user.id });
        const totalStudyMinutes = cycles.reduce((sum, cycle) => sum + (cycle.completedMinutes || 0), 0);
        const currentCycle = await Cycle.findOne({ userId: req.user.id, isActive: true });

        res.json({
            totalCycles,
            totalStudyMinutes,
            currentCycle: currentCycle ? formatCycle(currentCycle) : null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erro ao buscar resumo' });
    }
};

module.exports = {
    getActiveCycle,
    getAllCycles,
    getCycleById,
    createCycle,
    updateCycle,
    completeBlock,
    decrementBlockMinutes,
    deleteCycle,
    getCycleSummary
};