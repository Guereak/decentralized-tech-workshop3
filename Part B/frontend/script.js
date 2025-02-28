const API_URL = "http://localhost:3000";

// 📌 Récupérer les produits
async function getProducts() {
    const res = await fetch(`${API_URL}/products`);
    const products = await res.json();
    document.getElementById("products-list").innerHTML = products.map(p =>
        `<li>${p.name} - ${p.price}€</li>`
    ).join('');
}

// 📌 Ajouter un produit
async function addProduct() {
    const name = document.getElementById("product-name").value;
    const description = document.getElementById("product-desc").value;
    const price = document.getElementById("product-price").value;
    const category = document.getElementById("product-category").value;

    await fetch(`${API_URL}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, price, category, inStock: true })
    });

    getProducts();  // Rafraîchir la liste
}

// 📌 Récupérer les commandes d'un utilisateur
async function getOrders() {
    const userId = document.getElementById("order-user-id").value;
    const res = await fetch(`${API_URL}/orders/${userId}`);
    const orders = await res.json();
    document.getElementById("orders-list").innerHTML = orders.map(o =>
        `<li>Order ${o.id} - ${o.totalPrice}€</li>`
    ).join('');
}

// 📌 Créer une commande
async function createOrder() {
    const userId = document.getElementById("order-user-id").value;
    
    // Exemple: récupérer les produits du panier pour créer la commande
    const cartRes = await fetch(`${API_URL}/cart/${userId}`);
    const cart = await cartRes.json();

    await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, products: cart.items })
    });

    getOrders();
}

// 📌 Récupérer le panier
async function getCart() {
    const userId = document.getElementById("cart-user-id").value;
    const res = await fetch(`${API_URL}/cart/${userId}`);
    const cart = await res.json();
    document.getElementById("cart-list").innerHTML = cart.items.map(item =>
        `<li>Product ${item.productId} - ${item.quantity}</li>`
    ).join('');
}

// 📌 Ajouter un produit au panier
async function addToCart() {
    const userId = document.getElementById("cart-user-id").value;
    const productId = document.getElementById("cart-product-id").value;
    const quantity = document.getElementById("cart-quantity").value;

    await fetch(`${API_URL}/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity })
    });

    getCart();
}

// 📌 Supprimer un produit du panier
async function removeFromCart() {
    const userId = document.getElementById("cart-user-id").value;
    const productId = document.getElementById("cart-remove-product-id").value;

    await fetch(`${API_URL}/cart/${userId}/item/${productId}`, {
        method: "DELETE"
    });

    getCart();
}
