import { Router } from "express";
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { io } from '../app.js';

const router = Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const productsFile = path.resolve(__dirname, '../data/products.json');

router.get('/', async (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    res.json(products);
});

// aquí agrego productos
router.post('/', async (req, res) => {
    const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    const newProduct = { id: products.length + 1, ...req.body };
    products.push(newProduct);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

    io.emit('newProduct', newProduct);
    res.status(201).json(newProduct);
});

// aqui elimino los producto
router.delete('/:id', async (req, res) => {
    let products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    const productId = parseInt(req.params.id);
    products = products.filter(prod => prod.id !== productId);
    fs.writeFileSync(productsFile, JSON.stringify(products, null, 2));

    io.emit('deleteProduct', productId);
    res.status(200).json({ message: 'Producto eliminado' });
});

export default router;