// src/models/clienteModel.js
const prisma = require('../prisma');

exports.findAll = () => prisma.cliente.findMany();
exports.findById = (id) => prisma.cliente.findUnique({ where: { id: parseInt(id) } });
exports.create = (data) => prisma.cliente.create({ data });
exports.update = (id, data) => prisma.cliente.update({ where: { id: parseInt(id) }, data });
exports.remove = (id) => prisma.cliente.delete({ where: { id: parseInt(id) } });
exports.clear = async () => prisma.cliente.deleteMany();