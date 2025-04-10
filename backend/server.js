const express = require('express');
const axios = require('axios');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid'); // Importa a função para gerar UUID

const app = express();
const port = 3000;

// Middleware para permitir requisições CORS do frontend
app.use(cors());
app.use(express.json());

// Token do Mercado Pago (substitua pelo seu token real)
const mercadoPagoToken = "TEST-6636381364121176-040317-112fc95f80406947036eeb39ffdc7ddb-442470310";

// Endpoint para criar pagamento Pix
app.post('/criar-pagamento', async (req, res) => {
  const { valor, descricao, idPasseio } = req.body;

  try {
    // Gera um UUID único para o X-Idempotency-Key
    const idempotencyKey = uuidv4();

    const response = await axios.post(
      'https://api.mercadopago.com/v1/payments',
      {
        transaction_amount: valor,
        description: descricao,
        payment_method_id: 'pix',
        payer: {
          email: 'cavalo.vendado@gmail.com', // Substitua por um e-mail válido
        },
        external_reference: idPasseio,
      },
      {
        headers: {
          Authorization: `Bearer ${mercadoPagoToken}`,
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey, // Adiciona o cabeçalho X-Idempotency-Key
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error('Erro ao criar pagamento:', error.response ? error.response.data : error.message);
    res.status(500).json({ error: 'Erro ao criar pagamento', details: error.response ? error.response.data : error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});