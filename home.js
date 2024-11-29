// API URLs
const apiURL = "https://springsecuritytrail.onrender.com/user/getAllProducts";
const addToCartURL = "https://springsecuritytrail.onrender.com/user/addToCart";
const searchURL = "https://springsecuritytrail.onrender.com/user/searchProduct";
const categoryURL = "https://springsecuritytrail.onrender.com/user/getAllProducts"; // API for category filtering

// Variables for pagination
let currentPage = 0;
let pageSize = 4;
let isSearching = false;
let searchTerm = "";
let selectedCategory = ""; // Store the selected category

// Function to fetch products with pagination
async function fetchProducts(pageNumber = 0, pageSize = 4, category = "") {
  const url = category
    ? `${categoryURL}/${pageNumber}/${pageSize}/${category}`
    : `${apiURL}/${pageNumber}/${pageSize}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const products = await response.json();
      displayProducts(products.content);
      setupPaginationControls(products);
    } else {
      console.error("Failed to fetch products:", response.statusText);
    }
  } catch (error) {
    console.error("Error fetching products:", error);
  }
}

// Function to search products with pagination
async function searchProducts(pageNumber = 0, pageSize = 5) {
  const searchPayload = { data: searchTerm };

  try {
    const response = await fetch(`${searchURL}/${pageNumber}/${pageSize}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(searchPayload),
    });

    if (response.ok) {
      const products = await response.json();
      displayProducts(products.content);
      setupPaginationControls(products);
    } else if (response.status === 204) {
      console.warn("No products found for the search term.");
      document.getElementById("product-list").innerHTML =
        "<p>No products found.</p>";
      document.getElementById("pagination-controls").innerHTML = ""; // Clear pagination controls
    } else {
      console.error("Search failed:", response.statusText);
    }
  } catch (error) {
    console.error("Error searching products:", error);
  }
}

// Function to filter products by category
function filterByCategory() {
  const category = document.getElementById("category-dropdown").value;
  selectedCategory = category;
  currentPage = 0; // Reset to the first page
  isSearching
    ? searchProducts(currentPage, pageSize)
    : fetchProducts(currentPage, pageSize, selectedCategory);
}

// Function to display products
function displayProducts(products) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  products.forEach((product) => {
    const productCard = document.createElement("div");
    productCard.classList.add("product-card");
    productCard.innerHTML = `
        <div class="main">
        <div class="image">
            <img src="${product.imageUrl || "default-image.png"}" alt="${
      product.productName
    }"></div>
    <div class="content">
            <h3>${product.productName}</h3>
            <p>Price: $${product.price}</p>
            <p>Seller: ${product.createdBy}</p>
            <p>${product.description}</p>
            <button class="add-to-cart-btn" data-product-id="${
              product.id
            }">Add to Cart</button>
            </div>
            </div>
        `;
    productList.appendChild(productCard);
  });

  // Add event listeners to "Add to Cart" buttons
  document.querySelectorAll(".add-to-cart-btn").forEach((button) => {
    button.addEventListener("click", function () {
      const productId = this.getAttribute("data-product-id");
      addToCart(productId, 1);
    });
  });
}

// Function to set up pagination controls
function setupPaginationControls(products) {
  const paginationControls = document.getElementById("pagination-controls");
  paginationControls.innerHTML = "";

  if (!products.first) {
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.onclick = () => {
      currentPage--;
      isSearching
        ? searchProducts(currentPage, pageSize)
        : fetchProducts(currentPage, pageSize, selectedCategory);
    };
    paginationControls.appendChild(prevButton);
  }

  if (!products.last) {
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.onclick = () => {
      currentPage++;
      isSearching
        ? searchProducts(currentPage, pageSize)
        : fetchProducts(currentPage, pageSize, selectedCategory);
    };
    paginationControls.appendChild(nextButton);
  }
}

// Function to add a product to the cart
async function addToCart(productId, quantity) {
  const addToCartPayload = { productId, quantity };

  try {
    const response = await fetch(addToCartURL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addToCartPayload),
    });

    if (response.ok) {
      const result = await response.json();
      alert(
        result
          ? "Product added to cart successfully!"
          : "Failed to add product to cart."
      );
    } else {
      // Parse the error response from the API
      try {
        const errorResponse = await response.json(); // Parse JSON response
        alert("Failed to add product to cart: " + errorResponse.error);
        window.location.reload();
      } catch (e) {
        // Handle cases where the response body isn't JSON
        alert("An unexpected error occurred.");
        window.location.reload();
      }
    }
    
  } catch (error) {
    console.error("Error adding product to cart:", error);
  }
}

// Event listener for the search bar to trigger search on Enter key press
document.getElementById("search-bar").addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    searchTerm = event.target.value.trim();
    currentPage = 0;
    isSearching = searchTerm !== "";
    isSearching
      ? searchProducts(currentPage, pageSize)
      : fetchProducts(currentPage, pageSize, selectedCategory);
  }
});

function logout() {
  // Clear the JWT token from localStorage
  localStorage.removeItem("jwtToken");

  // Optionally, redirect the user to the login page
  window.location.href = "login.html"; // Update with your actual login page URL
}
function myAddress() {
  // Optionally, redirect the user to the login page
  window.location.href = "addresses.html"; // Update with your actual login page URL
}

function addAddress() {
  // Optionally, redirect the user to the login page
  window.location.href = "addAddress.html"; // Update with your actual login page URL
}

function cart() {
  // Optionally, redirect the user to the login page
  window.location.href = "cart.html"; // Update with your actual login page URL
}

function myOrders() {
  // Optionally, redirect the user to the login page
  window.location.href = "customerOrders.html"; // Update with your actual login page URL
}

function viewProfile() {
  // Optionally, redirect the user to the login page
  window.location.href = "userDetail.html"; // Update with your actual login page URL
}
// Initial fetch of products
fetchProducts();
