const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Token do Mercado Pago (substitua pelo seu token real)
const mercadoPagoToken = "TEST-6636381364121176-040317-112fc95f80406947036eeb39ffdc7ddb-442470310"; // Use o token de teste ou produção

// Endpoint para criar pagamento Pix
app.post('/criar-pagamento', async (req, res) => {
  const { valor, descricao, idPasseio } = req.body;

  try {
    // Gera um UUID único para o X-Idempotency-Key
    const idempotencyKey = uuidv4();

    console.log('Criando pagamento com os seguintes dados:', {
      valor,
      descricao,
      idPasseio,
      idempotencyKey,
    });

    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        transaction_amount: valor,
        description: descricao,
        payment_method_id: 'pix',
        payer: {
          email: 'viniciusstrentin@gmail.com', // Use um e-mail válido ou fictício para testes
        },
        external_reference: idPasseio,
      },
      {
        headers: {
          Authorization: `Bearer ${mercadoPagoToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
        },
      }
    );

    console.log('Resposta do Mercado Pago:', response.data);

    // Verifica se os dados do Pix foram retornados
    if (!response.data.point_of_interaction || !response.data.point_of_interaction.transaction_data) {
      throw new Error('Dados do Pix não encontrados na resposta do Mercado Pago');
    }

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error.response ? error.response.data : error.message);
    res.status(500).json({
      error: 'Erro ao criar pagamento',
      details: error.response ? error.response.data : error.message,
    });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});