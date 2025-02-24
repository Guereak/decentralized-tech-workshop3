const express = require('express');
const router = express.Router();
const db = require('../models/database');

// GET /cart/:userId - Récupérer le panier d'un utilisateur
router.get('/:userId', async (req, res) => {
    try {
        const cart = await db.oneOrNone("SELECT * FROM carts WHERE userId = $1", [req.params.userId]);
        if (!cart) {
            return res.json({ userId: req.params.userId, items: [], totalPrice: 0 });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// POST /cart/:userId - Ajouter un produit au panier
router.post('/:userId', async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        // Vérifier si le produit existe
        const product = await db.oneOrNone("SELECT * FROM products WHERE id = $1", [productId]);
        if (!product) {
            return res.status(404).json({ message: "Produit introuvable" });
        }

        let cart = await db.oneOrNone("SELECT * FROM carts WHERE userId = $1", [req.params.userId]);
        
        if (!cart) {
            cart = await db.one(
                "INSERT INTO carts (userId, items, totalPrice) VALUES ($1, $2, $3) RETURNING *",
                [req.params.userId, JSON.stringify([{ productId, quantity }]), product.price * quantity]
            );
        } else {
            let items = cart.items;
            let itemIndex = items.findIndex(item => item.productId === productId);
            
            if (itemIndex > -1) {
                items[itemIndex].quantity += quantity;
            } else {
                items.push({ productId, quantity });
            }

            const newTotalPrice = items.reduce((total, item) => {
                const itemProduct = product.id === item.productId ? product : null;
                return total + (item.quantity * (itemProduct ? itemProduct.price : 0));
            }, 0);

            cart = await db.one(
                "UPDATE carts SET items = $1, totalPrice = $2 WHERE userId = $3 RETURNING *",
                [JSON.stringify(items), newTotalPrice, req.params.userId]
            );
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

// DELETE /cart/:userId/item/:productId - Supprimer un produit du panier
router.delete('/:userId/item/:productId', async (req, res) => {
    try {
        let cart = await db.oneOrNone("SELECT * FROM carts WHERE userId = $1", [req.params.userId]);

        if (!cart) {
            return res.status(404).json({ message: "Panier introuvable" });
        }

        let items = cart.items.filter(item => item.productId !== req.params.productId);
        const newTotalPrice = items.reduce((total, item) => total + (item.quantity * item.price), 0);

        if (items.length === 0) {
            await db.none("DELETE FROM carts WHERE userId = $1", [req.params.userId]);
            return res.json({ message: "Panier supprimé" });
        }

        cart = await db.one(
            "UPDATE carts SET items = $1, totalPrice = $2 WHERE userId = $3 RETURNING *",
            [JSON.stringify(items), newTotalPrice, req.params.userId]
        );

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
});

module.exports = router;
