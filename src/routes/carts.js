import { Router } from "express";

const router = Router();

// Obtener lista de carritos
router.get("/", (req, res) => {
    res.json({ message: "Lista de carritos de compra" });
});

// Agregar producto a un carrito
router.post("/:id/product", (req, res) => {
    const { id } = req.params;
    res.json({ message: `Producto agregado al carrito ${id}` });
});

export default router;
