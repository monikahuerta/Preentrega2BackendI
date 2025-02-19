import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Lista de productos disponibles" });
});

router.get("/:id", (req, res) => {
    const { id } = req.params;
    res.json({ message: `Detalles del producto ${id}` });
});

export default router;

