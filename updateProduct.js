// Get the product ID from the URL (query parameter)
const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

const apiUrl = "https://springsecuritytrail.onrender.com"; // Update with your backend API URL

// Function to fetch product details and populate the form
function fetchProductDetails() {
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
      throw new Error("Product not found");
    })
    .then((products) => {
      const product = products.find((p) => p.id === productId);

      if (product) {
        // Populate form fields with the product data
        document.getElementById("productId").value = product.id;
        document.getElementById("productName").value = product.productName;
        document.getElementById("category").value = product.category;
        document.getElementById("quantity").value = product.quantity;
        document.getElementById("price").value = product.price;
        document.getElementById("description").value = product.description;
        document.getElementById("imageUrl").value = product.imageUrl;
      } else {
        alert("Product not found");
      }
      console.log(product.imageUrl);
    })
    .catch((error) => {
      console.error("Error fetching product details:", error);
      alert("Error fetching product details");
    });
}

// Function to handle the form submission and update the product
document
  .getElementById("updateProductForm")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form from reloading the page

    let token = localStorage.getItem("jwtToken"); // Retrieve the token
    const productData = {
      id: document.getElementById("productId").value,
      productName: document.getElementById("productName").value,
      category: document.getElementById("category").value,
      quantity: document.getElementById("quantity").value,
      price: document.getElementById("price").value,
      description: document.getElementById("description").value,
      imageUrl: document.getElementById("imageUrl").value,
    };

    fetch(`${apiUrl}/seller/updateMyProduct`, {
      method: "PUT",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(productData),
    })
      .then((response) => {
        if (response.ok) {
          alert("Product updated successfully");
          window.location.href = "seller.html"; // Redirect to seller dashboard after successful update
        } else {
          console.log(productData);
          throw new Error("Error updating product");
        }
      })
      .catch((error) => {
        console.error("Error updating product:", error);
        alert("Error updating product");
      });
  });

// Fetch and display the product details when the page loads
document.addEventListener("DOMContentLoaded", fetchProductDetails);
