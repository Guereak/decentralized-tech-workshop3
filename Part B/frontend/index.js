const API_BASE = "http://localhost:3000";
const userId = "123"; // Simuler un utilisateur

// 🔹 Récupérer les produits
async function fetchProducts() {
    const response = await fetch(`${API_BASE}/products`);
    const products = await response.json();
    let html = "<ul>";
    products.forEach(product => {
        html += `<li>
            ${product.name} - ${product.price}€
            <button onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price}, '${product.category}', ${product.stock})">✏️</button>
            <button onclick="deleteProduct(${product.id})">🗑️</button>
            <button onclick="addToCart(${product.id})">🛒</button>
        </li>`;
    });
    html += "</ul>";
    document.getElementById("products").innerHTML = html;
}

// 🔹 Ajouter ou modifier un produit
async function addOrUpdateProduct(event) {
    event.preventDefault();
    const id = document.getElementById("productId").value;
    const product = {
        name: document.getElementById("productName").value,
        description: document.getElementById("productDesc").value,
        price: parseFloat(document.getElementById("productPrice").value),
        category: document.getElementById("productCategory").value,
        stock: parseInt(document.getElementById("productStock").value)
    };

    const method = id ? "PUT" : "POST";
    const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;

    await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product)
    });

    alert("Product saved!");
    fetchProducts();
}

// 🔹 Préparer la modification d'un produit
function editProduct(id, name, description, price, category, stock) {
    document.getElementById("productId").value = id;
    document.getElementById("productName").value = name;
    document.getElementById("productDesc").value = description;
    document.getElementById("productPrice").value = price;
    document.getElementById("productCategory").value = category;
    document.getElementById("productStock").value = stock;
}

// 🔹 Supprimer un produit
async function deleteProduct(id) {
    await fetch(`${API_BASE}/products/${id}`, { method: "DELETE" });
    alert("Product deleted!");
    fetchProducts();
}

// 🔹 Ajouter au panier
async function addToCart(productId) {
    await fetch(`${API_BASE}/cart/${userId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity: 1 })
    });
    alert("Product added to cart!");
}

// 🔹 Voir le panier
async function fetchCart() {
    const response = await fetch(`${API_BASE}/cart/${userId}`);
    const cart = await response.json();
    let html = "<ul>";
    cart.items.forEach(item => {
        html += `<li>Product ${item.productId} - Quantity: ${item.quantity} 
            <button onclick="removeFromCart(${item.productId})">🗑️</button>
        </li>`;
    });
    html += "</ul>";
    document.getElementById("cart").innerHTML = html;
}

// 🔹 Supprimer du panier
async function removeFromCart(productId) {
    await fetch(`${API_BASE}/cart/${userId}/item/${productId}`, { method: "DELETE" });
    alert("Removed from cart!");
    fetchCart();
}

// 🔹 Passer une commande
async function placeOrder() {
    const response = await fetch(`${API_BASE}/cart/${userId}`);
    const cart = await response.json();

    if (cart.items.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    await fetch(`${API_BASE}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, products: cart.items })
    });

    alert("Order placed successfully!");
    document.getElementById("cart").innerHTML = "";
}

// 🔹 Voir les commandes
async function fetchOrders() {
    const response = await fetch(`${API_BASE}/orders/${userId}`);
    const orders = await response.json();
    let html = "<ul>";
    orders.forEach(order => {
        html += `<li>Order ${order.id} - ${order.totalPrice}€ - ${order.status}</li>`;
    });
    html += "</ul>";
    document.getElementById("orders").innerHTML = html;
}
