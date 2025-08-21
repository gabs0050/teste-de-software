// server.js
const express = require('express');
const clientesRoutes = require('./src/routes/clientesRoutes');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/clientes', clientesRoutes);

// Guarde a referência do servidor
const server = app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});

// Exporte a referência do servidor para que os testes possam fechá-lo
module.exports = server;
