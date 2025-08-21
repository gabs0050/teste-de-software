// src/routes/clientesRoutes.js
const express = require('express');
const router = express.Router();
const clienteModel = require('../models/clienteModel');

// POST /clientes (Criação)
router.post('/', async (req, res) => {
    const { nome, email, telefone } = req.body;
    if (!nome || !email || !telefone) {
        return res.status(400).send('Dados inválidos. Nome, email e telefone são obrigatórios.');
    }
    try {
        const novoCliente = await clienteModel.create({ nome, email, telefone });
        res.status(201).json(novoCliente);
    } catch (error) {
        if (error.code === 'P2002') return res.status(409).send('Email já cadastrado.');
        res.status(500).send('Erro ao criar cliente.');
    }
});

// GET /clientes (Listagem)
router.get('/', async (req, res) => {
    const clientes = await clienteModel.findAll();
    res.status(200).json(clientes);
});

// GET /clientes/:id (Busca por ID)
router.get('/:id', async (req, res) => {
    try {
        const cliente = await clienteModel.findById(req.params.id);
        if (cliente) {
            res.status(200).json(cliente);
        } else {
            res.status(404).send('Cliente não encontrado.');
        }
    } catch (error) {
        res.status(404).send('Cliente não encontrado.');
    }
});

// PUT /clientes/:id (Atualização)
router.put('/:id', async (req, res) => {
    try {
        const updated = await clienteModel.update(req.params.id, req.body);
        res.status(200).json(updated);
    } catch (error) {
        res.status(404).send('Cliente não encontrado.');
    }
});

// DELETE /clientes/:id (Remoção)
router.delete('/:id', async (req, res) => {
    try {
        await clienteModel.remove(req.params.id);
        res.status(204).send(); // 204 No Content para remoções bem-sucedidas
    } catch (error) {
        res.status(404).send('Cliente não encontrado.');
    }
});

module.exports = router;