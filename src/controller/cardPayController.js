import { createCustomer, createPayment } from '../service/asaasService.js';
import mongoose from 'mongoose';
import Card from '../models/Card.js'; // Importando o modelo do cartão
import crypto from 'node:crypto'; // ou 'crypto' se Node 18+


export const generateCard = async (req, res) => {
  try {
    const {
      card_number,
      expiration_month,
      expiration_year,
      security_code,
      cardholder,
      email,
      amount,
      cpfCnpj
    } = req.body;

    // Logando os dados recebidos na requisição para verificar
    console.log("🔎 Dados recebidos:", req.body);

    // Validação: Verificar se todos os campos obrigatórios estão presentes
    if (!card_number || !expiration_month || !expiration_year || !security_code || !email || !amount || !cpfCnpj || !cardholder || !cardholder.name) {
      console.error("❌ Campos obrigatórios faltando");
      return res.status(400).json({
        error: true,
        message: 'Campos obrigatórios faltando'
      });
    }

    console.log("✅ Todos os campos obrigatórios estão presentes");

    /** 1️⃣ Criar cliente */
    console.log("🔄 Criando cliente...");
    const customer = await createCustomer({
      name: cardholder.name,
      email,
      cpfCnpj
    });

    console.log("👤 Cliente criado com sucesso:", customer.id);

    /** 2️⃣ Criar e salvar o cartão no banco de dados (usando Mongoose) */
    console.log("🔄 Criando e salvando o cartão...");
    const card = new Card({
      card_number,
      expiration_month,
      expiration_year,
      security_code,
      cardholder,
      email,
      amount,
      cpfCnpj
    });

    // Gerando o token para o cartão
    if (!card.token) {
      card.token = crypto.randomBytes(32).toString('hex');
    }

    // Salvando o cartão no banco
    await card.save();
    console.log("💳 Cartão salvo com sucesso:", card.id);

    /** 3️⃣ Criar pagamento */
    console.log("🔄 Criando pagamento...");
    const payment = await createPayment({
      customer: customer.id,
      amount,
      creditCard: {
        holderName: cardholder.name,
        number: card_number,
        expiryMonth: expiration_month,
        expiryYear: expiration_year,
        ccv: security_code
      },
      creditCardHolderInfo: {
        name: cardholder.name,
        email,
        cpfCnpj,
        phone: "11920718018", // Adicione um telefone válido com DDD
        postalCode: '01001-000', 
        addressNumber: '123'
      }
    });


    console.log("💳 Pagamento criado com sucesso:", payment);

    // Retorna a resposta com o status e ID do pagamento
    return res.json({
      id: payment.id,
      status: payment.status
    });

  } catch (error) {
    // Logando erro detalhado
    console.error("❌ Erro ao processar o pagamento:", error.response?.data || error.message);

    return res.status(400).json({
      error: true,
      message: 'Erro ao processar pagamento',
      details: error.response?.data || error.message
    });
  }
};
