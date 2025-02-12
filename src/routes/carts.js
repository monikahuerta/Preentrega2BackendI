import express from "express";
import fs from "fs/promises";

const router = express.Router();
const cartsFile = "./src/data/carts.json";
const productsFile = "./src/data/products.json";

// Obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = JSON.parse(await fs.readFile(cartsFile, "utf-8"));
    res.json(carts);
  } catch (error) {
    res.status(500).json({ error: "Error al leer los carritos" });
  }
});

// Obtener un carrito por ID
router.get("/:cid", async (req, res) => {
  try {
    const carts = JSON.parse(await fs.readFile(cartsFile, "utf-8"));
    const cart = carts.find((c) => c.id === req.params.cid);
    cart ? res.json(cart) : res.status(404).json({ error: "Carrito no encontrado" });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el carrito" });
  }
});

// Crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const carts = JSON.parse(await fs.readFile(cartsFile, "utf-8"));
    const newCart = { id: `c${Date.now()}`, products: [] };
    carts.push(newCart);
    await fs.writeFile(cartsFile, JSON.stringify(carts, null, 2));
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

// Agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    let carts = JSON.parse(await fs.readFile(cartsFile, "utf-8"));
    let products = JSON.parse(await fs.readFile(productsFile, "utf-8"));

    const cartIndex = carts.findIndex((c) => c.id === req.params.cid);
    const product = products.find((p) => p.id === req.params.pid);

    if (cartIndex !== -1 && product) {
      const existingProduct = carts[cartIndex].products.find((p) => p.id === req.params.pid);
      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        carts[cartIndex].products.push({ id: req.params.pid, quantity: 1 });
      }
      await fs.writeFile(cartsFile, JSON.stringify(carts, null, 2));
      res.json(carts[cartIndex]);
    } else {
      res.status(404).json({ error: "Carrito o producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ error: "Error al agregar el producto al carrito" });
  }
});

export default router;
