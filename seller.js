const apiUrl = "https://springsecuritytrail.onrender.com"; // Update with your backend API URL

// Function to display all products
function fetchAndDisplayProducts() {
  let token = localStorage.getItem("jwtToken"); // Retrieve the token

  if (!token) {
    alert("You need to log in first");
    return;
  }

  fetch(`${apiUrl}/seller/myProducts`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error("No products available");
    })
    .then((products) => {
      const productList = document.getElementById("productList");
      productList.innerHTML = ""; // Clear previous content

      products.forEach((product) => {
        const productItem = document.createElement("div");
        productItem.className = "product-item";
        productItem.setAttribute("data-product-id", product.id); // Store product ID in a data attribute

        productItem.innerHTML = `
        <div class="main">
              <div class="product">  <img src="${product.imageUrl}" alt="${
          product.productName
        }" class="product-image"></div>
        <div class="content">
                <h3>${product.productName}</h3>
                <p>Category: ${product.category}</p>
                <p>Description: ${product.description}</p>
                <p>Quantity: ${product.quantity}</p>
                <p class="price">Price: $${product.price}</p>
                <p>Created At: ${new Date(
                  product.createdAt
                ).toLocaleString()}</p>
                <p>Updated At: ${new Date(
                  product.updatedAt
                ).toLocaleString()}</p>
                <button class="update-btn" onclick="updateProduct('${
                  product.id
                }')">Update</button>
                <button class="delete-btn" onclick="deleteProduct('${
                  product.productName
                }')">Delete</button>
                </div>
                </div>
            `;

        productList.appendChild(productItem);
      });
    })
    .catch((error) => {
      console.error("Error fetching products:", error);
      alert("Error fetching products");
    });
}

// Function to handle product delete
function deleteProduct(productId) {
  let token = localStorage.getItem("jwtToken"); // Retrieve the token

  if (!token) {
    alert("You need to log in first");
    return;
  }

  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`${apiUrl}/seller/deleteProduct/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Product deleted successfully");
          fetchAndDisplayProducts(); // Refresh the product list after deletion
        } else {
          throw new Error("Error deleting product");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      });
  }
}

// Function to view profile and redirect to account details page
function viewProfile() {
  let token = localStorage.getItem("jwtToken"); // Ensure token is correctly named

  if (!token) {
    alert("You need to log in first");
    return;
  }

  fetch(`${apiUrl}/getMyAccount`, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data) {
        localStorage.setItem("userAccountDetails", JSON.stringify(data));
        window.location.href = "userDetail.html";
      } else {
        alert("No user data found");
      }
    })
    .catch((error) => {
      console.error("Error fetching account details:", error);
      alert("Error fetching user details");
    });
}

function logout() {
  // Remove the JWT token from localStorage
  localStorage.removeItem("jwtToken");

  // Redirect the user to the login page
  window.location.href = "login.html";
}

// Function to handle product update
function updateProduct(productId) {
  alert(`Update product with ID: ${productId}`);
  // Redirect to update page or open a modal with product details for updating
  // For now, it just alerts the product ID
  window.location.href = `updateProduct.html?id=${productId}`;
}

// Function to handle product delete
function deleteProduct(productId) {
  let token = localStorage.getItem("jwtToken"); // Retrieve the token

  if (!token) {
    alert("You need to log in first");
    return;
  }

  if (confirm("Are you sure you want to delete this product?")) {
    fetch(`${apiUrl}/seller/deleteProduct/${productId}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          alert("Product deleted successfully");
          fetchAndDisplayProducts(); // Refresh the product list after deletion
        } else {
          throw new Error("Error deleting product");
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
        alert("Error deleting product");
      });
  }
}

// Function to redirect to the Add Product page
function addProduct() {
  window.location.href = "addProduct.html"; // Redirect to the product addition form page
}

// Function to fetch and display orders
function viewOrders() {
  let token = localStorage.getItem("jwtToken"); // Retrieve the JWT token

  if (!token) {
    alert("You need to log in first");
    return;
  }

  fetch(`${apiUrl}/seller/getMyOrders`, {
    method: "GET",
    headers: {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (response.ok) return response.json();
      throw new Error(
        "No orders available right now. Please check back later."
      );
    })
    .then((orders) => {
      if (Array.isArray(orders) && orders.length > 0) {
        displayOrders(orders); // Display orders in a toggled section
      } else {
        alert("No orders found");
      }
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      alert("Error fetching orders");
    });
}

// Function to display orders in a modal or new section
function displayOrders(orders) {
  let orderList = document.getElementById("orderList");

  // Check if orderList container exists; if not, create it
  if (!orderList) {
    orderList = document.createElement("div");
    orderList.id = "orderList";
    orderList.className = "order-list";
    document.body.appendChild(orderList);
  } else {
    // Clear the order list content to prevent duplicate entries on repeated clicks
    orderList.innerHTML = "";
  }

  orderList.innerHTML = "<h2>My Orders</h2>";

  // Loop through each order message and display it
  orders.forEach((orderMessage) => {
    const orderItem = document.createElement("div");
    orderItem.className = "order-item";

    // Display the message as plain text, preserving line breaks
    orderItem.innerHTML = `<pre>${orderMessage}</pre>`;

    orderList.appendChild(orderItem);
  });

  // Toggle visibility of the order list when the button is clicked
  orderList.style.display =
    orderList.style.display === "none" ? "block" : "none";
}

// Load products on page load
document.addEventListener("DOMContentLoaded", fetchAndDisplayProducts);
