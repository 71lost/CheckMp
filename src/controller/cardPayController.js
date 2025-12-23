import mongoose from 'mongoose';
import Card from '../models/Card.js'; // Importando o modelo do cartão
import crypto from 'node:crypto'; // ou 'crypto' se Node 18+
import Pagador from '../models/Pagador.js';
import { createCustomer, createPayment, findCustomerByCpf } from '../service/asaasService.js';


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
   /** 1️⃣ Criar ou reutilizar cliente */
    console.log("🔄 Buscando pagador...");

    let pagador = await Pagador.findOne({ cpfCnpj });

    if (!pagador) {
      pagador = await Pagador.create({
        nome: cardholder.name,
        email,
        cpfCnpj,
        telefone: "11920718018"
      });
    }


    if (!pagador.customerIdAsaas) {
      console.log("🔎 Verificando cliente no Asaas...");

      let customer = await findCustomerByCpf(cpfCnpj);

      if (!customer) {
        console.log("🆕 Criando cliente no Asaas...");
        customer = await createCustomer({
          name: cardholder.name,
          email,
          cpfCnpj
        });
      }

      pagador.customerIdAsaas = customer.id;
      await pagador.save();
    }



    console.log("👤 Cliente Asaas:", pagador.customerIdAsaas);

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
      customer: pagador.customerIdAsaas,
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
        postalCode: '01001000', 
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
