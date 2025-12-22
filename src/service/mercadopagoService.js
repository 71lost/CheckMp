import { MercadoPagoConfig, Payment } from "mercadopago";
import dotenv from "dotenv";

dotenv.config();

const mpClient = new MercadoPagoConfig({
  accessToken: process.env.MP_ACCESS_TOKEN
});

const paymentClient = new Payment(mpClient);

export const createPayment = async ({ token, email, amount }) => {
  return await paymentClient.create({
    body: {
      transaction_amount: Number(amount),
      token,
      description: "Pagamento teste",
      installments: 1,
      payer: { email }
    }
  });
};
