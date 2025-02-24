const express = require('express');
const router = express.Router();
const db = require('../models/database');

// POST /orders - Créer une nouvelle commande
router.post('/', async (req, res) => {
    try {
        const { userId, products } = req.body;

        if (!products || products.length === 0) {
            return res.status(400).json({ message: "Aucun produit dans la commande" });
        }

        // Vérifier si tous les produits existent
        const productIds = products.map(p => p.productId);
        const availableProducts = await db.any("SELECT * FROM products WHERE id IN ($1:csv)", [productIds]);

        if (availableProducts.length !== products.length) {
            return res.status(400).json({ message: "Certains produits sont introuvables" });
        }

        // Calcul du prix total
        let totalPrice = 0;
        products.forEach(orderItem => {
            const product = availableProducts.find(p => p.id === orderItem.productId);
            totalPrice += product.price * orderItem.quantity;
        });

        // Insérer la commande
        const order = await db.one(
            "INSERT INTO orders (userId, products, totalPrice, status) VALUES ($1, $2, $3, 'Pending') RETURNING *",
            [userId, JSON.stringify(products), totalPrice]
        );

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// GET /orders/:userId - Récupérer toutes les commandes d'un utilisateur
router.get('/:userId', async (req, res) => {
    try {
        const orders = await db.any("SELECT * FROM orders WHERE userId = $1", [req.params.userId]);
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
