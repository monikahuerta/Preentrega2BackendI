import express from "express";
import fs from "fs/promises";

const router = express.Router();
const productsFile = "./src/data/products.json";

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(productsFile, "utf-8"));
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: "Error al leer los productos" });
  }
});

// Obtener un producto por su ID
router.get("/:pid", async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(productsFile, "utf-8"));
    const product = products.find((p) => p.id === req.params.pid);
    product ? res.json(product) : res.status(404).json({ error: "Producto no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

// Agregar un nuevo producto
router.post("/", async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile(productsFile, "utf-8"));
    const newProduct = { id: `p${Date.now()}`, ...req.body };
    products.push(newProduct);
    await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto" });
  }
});

// Actualizar un producto
router.put("/:pid", async (req, res) => {
  try {
    let products = JSON.parse(await fs.readFile(productsFile, "utf-8"));
    const index = products.findIndex((p) => p.id === req.params.pid);
    if (index !== -1) {
      products[index] = { ...products[index], ...req.body };
      await fs.writeFile(productsFile, JSON.stringify(products, null, 2));
      res.json(products[index]);
    } else {
      res.status(404).json({ error: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar el producto" });
  }
});

// Eliminar un producto
router.delete("/:pid", async (req, res) => {
  try {
    let products = JSON.parse(await fs.readFile(productsFile, "utf-8"));
    const filteredProducts = products.filter((p) => p.id !== req.params.pid);
    await fs.writeFile(productsFile, JSON.stringify(filteredProducts, null, 2));
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar el producto" });
  }
});

export default router;
