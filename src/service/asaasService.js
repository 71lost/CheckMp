import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Criando instância do Axios para API do Asaas
const api = axios.create({
  baseURL: process.env.ASAAS_API_URL || 'https://www.asaas.com/api/v3',
  headers: {
    'Content-Type': 'application/json',
    'access_token': process.env.ASAAS_API_KEY // Atenção: usar access_token
  }
});

/**
 * Cria cliente no Asaas
 * @param {Object} param0 
 * @param {string} param0.name - Nome do cliente
 * @param {string} param0.email - Email do cliente
 * @param {string} param0.cpfCnpj - CPF ou CNPJ do cliente
 * @returns {Object} Dados do cliente criado
 */
export const createCustomer = async ({ name, email, cpfCnpj }) => {
  try {
    const response = await api.post('/customers', {
      name,
      email,
      cpfCnpj
    });
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar cliente:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Cria pagamento com cartão de crédito no Asaas
 * @param {Object} param0 
 * @param {string} param0.customer - ID do cliente
 * @param {number} param0.amount - Valor do pagamento
 * @param {Object} param0.creditCard - Dados do cartão
 * @param {Object} param0.creditCardHolderInfo - Dados do titular do cartão
 * @returns {Object} Dados do pagamento criado
 */
export const createPayment = async ({ customer, amount, creditCard, creditCardHolderInfo }) => {
  try {
    const response = await api.post('/payments', {
      customer,
      billingType: 'CREDIT_CARD',
      value: Number(amount),
      dueDate: new Date().toISOString().split('T')[0], // data atual
      creditCard,
      creditCardHolderInfo
    });
    return response.data;
  } catch (error) {
    console.error('❌ Erro ao criar pagamento:', error.response?.data || error.message);
    throw error;
  }
};

export const findCustomerByCpf = async (cpfCnpj) => {
  const response = await api.get('/customers', {
    params: { cpfCnpj }
  });

  return response.data?.data?.[0] || null;
};
