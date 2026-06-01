const mongoose = require('mongoose');

const cycleRuleSchema = new mongoose.Schema({
    id: { type: String, required: true },
    topic1: { type: String, required: true },
    logicalOperator: { type: String, enum: ['deve', 'não deve'], required: true },
    timeRelation: { type: String, enum: ['antes', 'depois', 'entre'], required: true },
    topic2: { type: String, required: true }
});

const cycleConfigSchema = new mongoose.Schema({
    minutesPerTopic: { type: Number, default: 60 },
    minMinutesPerTopic: { type: Number, default: 30 },
    selectedTopics: [{ type: String }],
    rules: [cycleRuleSchema]
});

const cycleBlockSchema = new mongoose.Schema({
    id: { type: String, required: true },
    topicId: { type: String, required: true },
    topicName: { type: String, required: true },
    position: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 },
    originalMinutes: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date, default: null },
    currentContent: { type: String, default: '' }
});

const cycleSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    number: { type: Number, default: 1 },
    config: { type: cycleConfigSchema, required: true },
    blocks: [cycleBlockSchema],
    totalMinutes: { type: Number, default: 0 },
    completedMinutes: { type: Number, default: 0 },
    remainingMinutes: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    isActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Cycle', cycleSchema);