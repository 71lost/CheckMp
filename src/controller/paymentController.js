import { createPayment } from "../service/mercadopagoService.js";

export const pay = async (req, res) => {
  console.log("📥 Requisição recebida no /pay:", req.body); // log para debugar

  // Ajuste: mapeia email e amount corretamente
  const token = req.body.token;
  const email = req.body.email || req.body.payer?.email;
  const amount = req.body.amount || req.body.transaction_amount;

  if (!token || !email || !amount) {
    console.warn("⚠️ Campos obrigatórios faltando:", { token, email, amount });
    return res.status(400).json({
      error: true,
      message: "Campos obrigatórios faltando: token, email ou amount",
      received: { token, email, amount } // mostra o que chegou
    });
  }

  try {
    const payment = await createPayment({
      token,
      email,
      amount,
      payment_method_id: req.body.payment_method_id || "visa",
      installments: req.body.installments || 1
    });
    console.log("✅ Pagamento criado:", payment);

    return res.json({
      status: payment.status,
      detail: payment.status_detail,
      id: payment.id
    });
  } catch (err) {
    console.error("❌ Erro no pagamento:", err);
    return res.status(400).json({
      error: true,
      message: err.message
    });
  }
};
