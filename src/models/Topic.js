const mongoose = require('mongoose');

const checklistItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 }
});

const reviewHistoryItemSchema = new mongoose.Schema({
    id: { type: String, required: true },
    date: { type: Date, default: Date.now },
    duration: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    rating: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' }
});

const questionListSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    total: { type: Number, default: 0 },
    hits: { type: Number, default: 0 }
});

const contentStudyDataSchema = new mongoose.Schema({
    totalTimeSpent: { type: Number, default: 0 },
    notes: { type: String, default: '' },
    startedAt: { type: Date, default: null },
    completedAt: { type: Date, default: null },
    lastReviewDate: { type: Date, default: null },
    nextReviewDate: { type: Date, default: null },
    reviewHistory: [reviewHistoryItemSchema],
    questionLists: [questionListSchema]
});

const contentSchema = new mongoose.Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    importance: { type: String, enum: ['pouco', 'normal', 'muita'], default: 'normal' },
    completed: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    checklist: [checklistItemSchema],
    studyData: { type: contentStudyDataSchema, default: () => ({}) }
});

const tagSchema = new mongoose.Schema({
    id: { type: String, required: true },
    label: { type: String, required: true },
    color: { type: String }
});

const topicSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    notebookColor: { type: String, enum: ['azul', 'amarelo', 'vermelho', 'verde', 'rosa', 'preto'], default: 'azul' },
    difficulty: { type: String, enum: ['facil', 'medio', 'dificil'], default: 'medio' },
    tags: [tagSchema],
    contents: [contentSchema],
    totalMinutes: { type: Number, default: 0 },
    lastAccessed: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Topic', topicSchema);