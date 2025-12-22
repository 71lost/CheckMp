import {User} from "../models/User";

export const createCard = async (req, res) => {
  try {
    console.log('📥 Body recebido:', req.body);

    const card = new User(req.body);

    console.log('📌 Antes do save');
    await card.save();
    console.log('✅ Depois do save');

    res.status(201).json({
      message: 'Card registrado com sucesso',
      token: card.token
    });

  } catch (error) {
    console.error('🔥 ERRO COMPLETO:', error);
    console.error('🔥 STACK:', error.stack);

    res.status(500).json({
      message: 'Erro ao salvar card',
      error: error.message
    });
  }
};
