const mongoose = require('mongoose');

const editalSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    nome: { type: String, required: true },
    banca: { type: String, required: true },
    dataProva: { type: Date, required: true },
    local: { type: String, required: true },
    archived: { type: Boolean, default: false },
    archivedAt: { type: Date, default: null },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Edital', editalSchema);