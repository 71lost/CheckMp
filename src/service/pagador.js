import Pagador from '../models/Pagador.js';
import { createCustomer } from './asaas.js';

export const getOrCreatePagador = async ({ nome, email, cpfCnpj, telefone }) => {
  // 1️⃣ procura no banco pelo CPF
  let pagador = await Pagador.findOne({ cpfCnpj });

  // 2️⃣ se já existir e tiver customerId → reutiliza
  if (pagador && pagador.customerIdAsaas) {
    return pagador;
  }

  // 3️⃣ se não existir no banco, cria registro
  if (!pagador) {
    pagador = await Pagador.create({
      nome,
      email,
      cpfCnpj,
      telefone
    });
  }

  // 4️⃣ cria customer no Asaas
  const customer = await createCustomer({
    name: nome,
    email,
    cpfCnpj
  });

  // 5️⃣ salva o customerId
  pagador.customerIdAsaas = customer.id;
  await pagador.save();

  return pagador;
};
