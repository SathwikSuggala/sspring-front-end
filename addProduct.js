const apiUrl = 'https://springsecuritytrail.onrender.com'; // Update with your backend API URL

// Function to handle adding a new product
function addProduct(event) {
    event.preventDefault(); // Prevent the form from reloading the page

    const productName = document.getElementById('productName').value;
    const category = document.getElementById('category').value; // Get the selected category
    const quantity = document.getElementById('quantity').value;
    const price = document.getElementById('price').value;
    const description = document.getElementById('description').value;
    const imageUrl = document.getElementById('imageUrl').value;
    
    let token = localStorage.getItem('jwtToken'); // Retrieve the token from local storage
    
    if (!token) {
        alert('You need to log in first');
        return;
    }

    // Create the product data object
    const productData = {
        productName,
        category,
        quantity,
        price,
        description,
        imageUrl
    };

    // Send a POST request to add the product
    fetch(`${apiUrl}/seller/addProduct`, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token, // Add the JWT token to the Authorization header
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    })
    .then(response => {
        if (response.ok) {
            alert('Product added successfully');
            document.getElementById('addProductForm').reset(); // Clear the form after success

            // Redirect to seller page
            window.location.href = 'seller.html'; // Redirect to seller.html
        } else {
            throw new Error('Error adding product');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Error adding product');
    });
}

// Attach the event listener for form submission
document.getElementById('addProductForm').addEventListener('submit', addProduct);
