const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebSocket } = require('./websocket');

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect(
  'mongodb+srv://omnistack:omnistack@cluster0-kjzo0.mongodb.net/omnistack10?retryWrites=true&w=majority',
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.use(cors());
app.use(express.json());
app.use(routes);

// Tipos de parâmetros

// Query Params: req.query (filtros, ordenação, paginação ....)
// Route Params: req.params (Identificar um recurso na alteração ou remoção "parametro da URL")
// Body: req.body (Dados para a criação ou alteração de um registro)

// MongoDB (Não-relacional)

server.listen(3999);
