import { Router } from 'express';
import path from 'path';
import fs from 'fs';

const router = Router();

// aquí dejo la ruta para renderizar la vista de productos en tiempo real
router.get('/realTimeProducts', async (req, res) => {
    const productsFile = path.resolve(__dirname, '../data/products.json');
    const products = JSON.parse(fs.readFileSync(productsFile, 'utf-8'));
    
    res.render('realTimeProducts', { products });
});

export default router;
