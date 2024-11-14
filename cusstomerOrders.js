const getOrdersAPI = "https://springsecuritytrail.onrender.com/user/getMyOrders";

// Function to fetch orders data
async function fetchOrders() {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        showError("Please log in to view your orders.");
        return;
    }

    try {
        const response = await fetch(getOrdersAPI, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const ordersData = await response.json();
            displayOrders(ordersData);
        } else if (response.status === 204) {
            showError("No orders found.");
        } else {
            showError("Failed to load orders. Please try again later.");
        }
    } catch (error) {
        showError("Error fetching orders: " + error.message);
    }
}

// Function to display orders data in the DOM
function displayOrders(ordersData) {
    const ordersContainer = document.getElementById("orders-container");
    ordersContainer.innerHTML = ""; // Clear any existing data

    ordersData.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.classList.add("order-card");

        // Display Order Header with User Name
        orderCard.innerHTML = `
            <div class="order-header">Order for ${order.userName}</div>
            <div class="address">
                <strong>Address:</strong><br>
                ${order.address.fullName}<br>
                ${order.address.houseNumber}, ${order.address.street}, ${order.address.landMark}<br>
                ${order.address.city}, ${order.address.state}, ${order.address.country}<br>
                <strong>Mobile:</strong> ${order.address.mobileNumber}<br>
                <strong>Pin Code:</strong> ${order.address.pinCode}
            </div>
            <div class="cart-products">
                <strong>Cart Products:</strong>
            </div>
            <div class="total-amount">Total Amount: $${order.totalAmount}</div>
        `;

        // Display Cart Products
        const cartProductsContainer = orderCard.querySelector(".cart-products");
        order.cartProducts.forEach(product => {
            const productItem = document.createElement("div");
            productItem.classList.add("product-item");

            productItem.innerHTML = `
                <div class="product-details">
                    <strong>Product Name:</strong> ${product.productName}<br>
                    <strong>Price:</strong> $${product.price}<br>
                    <strong>Quantity:</strong> ${product.quantity}<br>
                </div>
            `;

            cartProductsContainer.appendChild(productItem);
        });

        ordersContainer.appendChild(orderCard);
    });
}

// Function to display error messages
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
}

// Fetch orders when the page loads
window.onload = fetchOrders;
