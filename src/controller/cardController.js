import axios from 'axios';

export const generateCardToken = async (req, res) => {
  try {
    // Log the incoming request body (card data) to verify that it's reaching the backend
    console.log("Received card data:", req.body);

    const cardDataList = req.body; // Array of card details from the front-end

    const tokens = [];

    // Iterate over each card and generate the token
    for (let cardData of cardDataList) {
      const { card_number, expiration_month, expiration_year, security_code, cardholder } = cardData;

      // Log the current card being processed
      console.log(`Processing card: ${card_number}, Expiry: ${expiration_month}/${expiration_year}`);

      // Send the request to Mercado Pago API to generate the token
      const response = await axios.post(
        'https://api.mercadopago.com/v1/card_tokens',
        {
          card_number,
          expiration_month,
          expiration_year,
          security_code,
          cardholder
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Log the response from Mercado Pago API
      console.log(`Received response for card ${card_number}:`, response.data);

      // Add the token and other details to the tokens array
      tokens.push({
        card_number,
        token: response.data.id,
        first_six_digits: response.data.first_six_digits,
        last_four_digits: response.data.last_four_digits
      });
    }

    // Log the tokens generated before returning the response
    console.log("Generated tokens:", tokens);

    // Return the tokens to the front-end
    return res.status(201).json({
      tokens: tokens // Return an array of token details
    });

  } catch (error) {
    // Log the error if it occurs during the process
    console.error('🔥 Mercado Pago error:', error.response?.data || error);

    return res.status(400).json({
      error: true,
      message: 'Erro ao gerar token do cartão',
      details: error.response?.data
    });
  }
};
