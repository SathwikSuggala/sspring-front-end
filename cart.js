const getCartAPI = "https://springsecuritytrail.onrender.com/user/getCart";
const incrementAPI = "https://springsecuritytrail.onrender.com/user/incrementProduct";
const decrementAPI = "https://springsecuritytrail.onrender.com/user/decrementProduct";
const checkoutAPI = "https://springsecuritytrail.onrender.com/user/checkOut";
const addressNamesAPI = "https://springsecuritytrail.onrender.com/user/addressNames";

// Function to fetch cart data
async function fetchCart() {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        showError("Please log in to view your cart.");
        return;
    }

    try {
        const response = await fetch(getCartAPI, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const cartData = await response.json();
            displayCart(cartData);
        } else {
            showError("Failed to load cart. Please try again later.");
        }
    } catch (error) {
        showError("Error fetching cart: " + error.message);
    }
}

// Function to fetch address names and populate dropdown
async function fetchAddressNames() {
    const jwtToken = localStorage.getItem("jwtToken");

    try {
        const response = await fetch(addressNamesAPI, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const addressNames = await response.json();
            populateAddressDropdown(addressNames);
        } else {
            showError("Failed to load address names. Please try again later.");
        }
    } catch (error) {
        showError("Error fetching addresses: " + error.message);
    }
}

// Function to populate address dropdown
function populateAddressDropdown(addressNames) {
    const addressSelect = document.getElementById("address-select");
    addressNames.forEach(address => {
        const option = document.createElement("option");
        option.value = address;
        option.textContent = address;
        addressSelect.appendChild(option);
    });
}

// Function to display cart data in the DOM
function displayCart(cartData) {
    const productList = document.getElementById("product-list");
    const totalPriceElement = document.getElementById("total-price");
    productList.innerHTML = ""; // Clear any existing product data

    cartData.products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <div class="product-info">
                <h3>${product.productName}</h3>
                <p class="product-details"><strong>Price:</strong> $${product.price}</p>
            </div>
            <div class="quantity-container">
                <button onclick="decrementQuantity('${product.productId}')">-</button>
                <span>${product.quantity}</span>
                <button onclick="incrementQuantity('${product.productId}')">+</button>
            </div>
        `;

        productList.appendChild(productCard);
    });

    totalPriceElement.textContent = `$${cartData.totalPrice}`;
}

// Function to display error messages
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
}

// Function to increment product quantity
async function incrementQuantity(productId) {
    await updateProductQuantity(incrementAPI, productId);
}

// Function to decrement product quantity
async function decrementQuantity(productId) {
    await updateProductQuantity(decrementAPI, productId);
}

// Function to update product quantity (for both increment and decrement)
async function updateProductQuantity(apiUrl, productId) {
    const jwtToken = localStorage.getItem("jwtToken");

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: productId })
        });

        if (response.ok) {
            const updatedCartData = await response.json();
            displayCart(updatedCartData); // Refresh cart with new data
        } else {
            showError("Failed to update product quantity. Please try again.");
        }
    } catch (error) {
        showError("Error updating quantity: " + error.message);
    }
}

// Checkout function
async function checkout() {
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        showError("Please log in to proceed with checkout.");
        return;
    }

    const selectedAddress = document.getElementById("address-select").value;
    if (!selectedAddress) {
        showError("Please select an address for checkout.");
        return;
    }

    try {
        const response = await fetch(checkoutAPI, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ data: selectedAddress })
        });

        if (response.ok) {
            const result = await response.json();
            alert("Order placed successfully!");
            displayCart({ products: [], totalPrice: "0" }); // Clear cart display
        } else if (response.status === 404) {
            showError("No content found in cart to place an order.");
        } else {
            const message = await response.text();
            showError(`Checkout failed: ${message}`);
        }
    } catch (error) {
        showError("Error during checkout: " + error.message);
    }
}

// Fetch cart data and address names when the page loads
window.onload = () => {
    fetchCart();
    fetchAddressNames();
};
