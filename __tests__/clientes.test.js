const request = require('supertest')
const app = require('../server') // Importa o app do server.js
const prisma = require('../src/prisma') // Importa o cliente Prisma

describe('Testes da API de Clientes', () => {

    // Roda antes de cada teste para garantir que o banco de dados esteja limpo
    beforeEach(async () => {
        await prisma.cliente.deleteMany()
    })

    // Roda após todos os testes para desconectar do banco de dados
    afterAll(async () => {
        await prisma.$disconnect()
    })

    // TESTES DE CRIAÇÃO (POST)
    describe('POST /clientes', () => {
        test('Deve criar um novo cliente com sucesso (código 201)', async () => {
            const novoCliente = {
                nome: 'João Silva',
                email: 'joao.silva@example.com',
                telefone: '11987654321',
            }
            const response = await request(app)
                .post('/clientes')
                .send(novoCliente)

            expect(response.statusCode).toBe(201)
            expect(response.body).toHaveProperty('id')
            expect(response.body.nome).toBe(novoCliente.nome)
        })

        test('Não deve criar um cliente com dados inválidos (código 400)', async () => {
            const clienteInvalido = {
                nome: 'Maria Souza',
                // email e telefone estão faltando
            }
            const response = await request(app)
                .post('/clientes')
                .send(clienteInvalido)

            expect(response.statusCode).toBe(400)
            expect(response.text).toBe('Dados inválidos. Nome, email e telefone são obrigatórios.')
        })

        test('Não deve criar um cliente com email duplicado (código 409)', async () => {
            // Cria um cliente inicial
            await request(app).post('/clientes').send({
                nome: 'Carlos Santos',
                email: 'carlos@example.com',
                telefone: '11999999999',
            })

            // Tenta criar outro cliente com o mesmo email
            const response = await request(app)
                .post('/clientes')
                .send({
                    nome: 'Outro Carlos',
                    email: 'carlos@example.com',
                    telefone: '11888888888',
                })

            expect(response.statusCode).toBe(409)
            expect(response.text).toBe('Email já cadastrado.')
        })
    })

    // TESTES DE LISTAGEM (GET)
    describe('GET /clientes', () => {
        test('Deve retornar a lista de todos os clientes (código 200)', async () => {
            await prisma.cliente.create({ data: { nome: 'Pedro', email: 'pedro@example.com', telefone: '123' } })
            await prisma.cliente.create({ data: { nome: 'Ana', email: 'ana@example.com', telefone: '456' } })

            const response = await request(app).get('/clientes')

            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(2)
            expect(response.body[0].nome).toBe('Pedro')
            expect(response.body[1].nome).toBe('Ana')
        })

        test('Deve retornar uma lista vazia se não houver clientes (código 200)', async () => {
            const response = await request(app).get('/clientes')
            expect(response.statusCode).toBe(200)
            expect(response.body.length).toBe(0)
        })
    })

    // TESTES DE BUSCA POR ID (GET)
    describe('GET /clientes/:id', () => {
        test('Deve retornar um cliente específico (código 200)', async () => {
            const clienteCriado = await prisma.cliente.create({ data: { nome: 'Luiza', email: 'luiza@example.com', telefone: '789' } })

            const response = await request(app).get(`/clientes/${clienteCriado.id}`)

            expect(response.statusCode).toBe(200)
            expect(response.body.nome).toBe('Luiza')
        })

        test('Deve retornar 404 se o cliente não for encontrado', async () => {
            const response = await request(app).get('/clientes/9999') // ID que não existe
            expect(response.statusCode).toBe(404)
            expect(response.text).toBe('Cliente não encontrado.')
        })
    })

    // TESTES DE ATUALIZAÇÃO (PUT)
    describe('PUT /clientes/:id', () => {
        test('Deve atualizar as informações de um cliente (código 200)', async () => {
            const clienteCriado = await prisma.cliente.create({ data: { nome: 'Rafaela', email: 'rafaela@example.com', telefone: '111' } })
            const dadosAtualizados = {
                nome: 'Rafaela Nova',
                telefone: '222',
            }

            const response = await request(app)
                .put(`/clientes/${clienteCriado.id}`)
                .send(dadosAtualizados)

            expect(response.statusCode).toBe(200)
            expect(response.body.nome).toBe('Rafaela Nova')
            expect(response.body.telefone).toBe('222')
        })

        test('Deve retornar 404 se o cliente a ser atualizado não for encontrado', async () => {
            const response = await request(app)
                .put('/clientes/9999')
                .send({ nome: 'Inexistente' })

            expect(response.statusCode).toBe(404)
            expect(response.text).toBe('Cliente não encontrado.')
        })
    })

    // TESTES DE REMOÇÃO (DELETE)
    describe('DELETE /clientes/:id', () => {
        test('Deve remover um cliente com sucesso (código 204)', async () => {
            const clienteCriado = await prisma.cliente.create({ data: { nome: 'Daniel', email: 'daniel@example.com', telefone: '333' } })

            const response = await request(app).delete(`/clientes/${clienteCriado.id}`)
            expect(response.statusCode).toBe(204)

            // Tenta buscar o cliente removido para confirmar
            const buscaRemovido = await request(app).get(`/clientes/${clienteCriado.id}`)
            expect(buscaRemovido.statusCode).toBe(404)
        })

        test('Deve retornar 404 se o cliente a ser removido não for encontrado', async () => {
            const response = await request(app).delete('/clientes/9999')
            expect(response.statusCode).toBe(404)
            expect(response.text).toBe('Cliente não encontrado.')
        })
    })

})