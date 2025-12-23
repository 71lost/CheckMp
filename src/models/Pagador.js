const mongoose = require('mongoose');

const PagadorSchema = new mongoose.Schema ({
    nome: { type: String, required: true },
    email: { type: String, required: true },
    cpfCnpj: { type: String, required: true },
    telefone: { type: String },
    customerIdAsaas: { type: String } // Armazena o ID do cliente no Asaas

});

module.exports = mongoose.model('Pagador', PagadorSchema);