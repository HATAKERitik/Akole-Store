const express = require('express');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
    try {
        const orders = await prisma.order.findMany({
            include: { product: true, user: true }
        });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { productId, userId, quantity, address } = req.body;

        if (!address || address.trim() === "") {
            return res.status(400).json({ error: 'Address is required' });
        }

        const order = await prisma.order.create({
            data: {
                productId: parseInt(productId),
                userId: parseInt(userId),
                quantity: parseInt(quantity),
                address: address
            }
        });

        res.status(201).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.put('/:id/contacted', async (req, res) => {
    try {
        const { id } = req.params;
        const { contacted } = req.body;

        const order = await prisma.order.update({
            where: { id: parseInt(id) },
            data: { contacted: Boolean(contacted) }
        });

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        await prisma.order.delete({
            where: { id: parseInt(id) }
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
