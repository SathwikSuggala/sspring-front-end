const addAddressAPI = "https://springsecuritytrail.onrender.com/user/addNewAddress";

// Function to handle form submission
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent the form from refreshing the page

    // Gather form data
    const addressData = {
        addressName: document.getElementById("addressName").value,
        fullName: document.getElementById("fullName").value,
        mobileNumber: document.getElementById("mobileNumber").value,
        houseNumber: document.getElementById("houseNumber").value,
        street: document.getElementById("street").value,
        landMark: document.getElementById("landMark").value,
        pinCode: document.getElementById("pinCode").value,
        city: document.getElementById("city").value,
        state: document.getElementById("state").value,
        country: document.getElementById("country").value
    };

    // Fetch JWT token from localStorage
    const jwtToken = localStorage.getItem("jwtToken");

    if (!jwtToken) {
        showError("Please log in to add an address.");
        return;
    }

    // Send POST request to the API
    try {
        const response = await fetch(addAddressAPI, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${jwtToken}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(addressData)
        });

        if (response.ok) {
            alert("Address added successfully!");
            document.getElementById("address-form").reset(); // Reset the form
        } else {
            showError("Failed to add address. Please try again.");
        }
    } catch (error) {
        showError("Error adding address: " + error.message);
    }
}

// Function to display error messages
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
}
