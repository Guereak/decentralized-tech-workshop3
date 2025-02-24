const express = require('express');
const router = express.Router();
const db = require('../models/database');

// GET /products - Liste des produits
router.get('/', async (req, res) => {
    try {
        let query = "SELECT * FROM products";
        let params = [];

        if (req.query.category) {
            query += " WHERE category = $1";
            params.push(req.query.category);
        }

        const products = await db.any(query, params);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// GET /products/:id - Détails d’un produit
router.get('/:id', async (req, res) => {
    try {
        const product = await db.oneOrNone("SELECT * FROM products WHERE id = $1", [req.params.id]);
        if (!product) return res.status(404).json({ message: "Produit introuvable" });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// POST /products - Ajouter un produit
router.post('/', async (req, res) => {
    try {
        const { name, description, price, category, inStock } = req.body;
        const newProduct = await db.one(
            "INSERT INTO products (name, description, price, category, inStock) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, description, price, category, inStock]
        );
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// PUT /products/:id - Modifier un produit
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price, category, inStock } = req.body;
        const updatedProduct = await db.oneOrNone(
            "UPDATE products SET name=$1, description=$2, price=$3, category=$4, inStock=$5 WHERE id=$6 RETURNING *",
            [name, description, price, category, inStock, req.params.id]
        );
        if (!updatedProduct) return res.status(404).json({ message: "Produit introuvable" });
        res.json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// DELETE /products/:id - Supprimer un produit
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await db.result("DELETE FROM products WHERE id = $1", [req.params.id]);
        if (deleted.rowCount === 0) return res.status(404).json({ message: "Produit introuvable" });
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
