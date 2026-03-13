const express = require('express');
const multer = require('multer');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const router = express.Router();
const prisma = new PrismaClient();

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany();
        res.json(products);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/', upload.array('images', 4), async (req, res) => {
    try {
        const { name, description, price } = req.body;

        // Store array of paths in JSON string
        const imageUrls = req.files && req.files.length > 0
            ? JSON.stringify(req.files.map(file => `/uploads/${file.filename}`))
            : null;

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: parseFloat(price),
                imageUrls
            }
        });

        res.status(201).json(product);
    } catch (error) {
        console.error("PRODUCT CREATION ERROR: ", error);
        res.status(500).json({ error: 'Internal server error', details: error.message });
    }
});

module.exports = router;
