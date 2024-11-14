const addressAPI = "http://localhost:8080/user/getAddresses";

// Function to fetch addresses from the API
async function fetchAddresses() {
    try {
        const response = await fetch(addressAPI, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            const addresses = await response.json();
            displayAddresses(addresses);
        } else if (response.status === 204) {
            showError("No addresses found.");
        } else {
            showError("Failed to load addresses. Please try again later.");
        }
    } catch (error) {
        showError("Error fetching addresses: " + error.message);
    }
}

// Function to display addresses in the DOM
function displayAddresses(addresses) {
    const addressList = document.getElementById("address-list");
    addressList.innerHTML = ""; // Clear loading text

    addresses.forEach(address => {
        const addressCard = document.createElement("div");
        addressCard.classList.add("address-card");

        addressCard.innerHTML = `
            <h3>${address.addressName}</h3>
            <p><span class="address-label">Full Name:</span> ${address.fullName}</p>
            <p><span class="address-label">Mobile:</span> ${address.mobileNumber}</p>
            <p><span class="address-label">House No:</span> ${address.houseNumber}</p>
            <p><span class="address-label">Street:</span> ${address.street}</p>
            <p><span class="address-label">Landmark:</span> ${address.landMark}</p>
            <p><span class="address-label">Pin Code:</span> ${address.pinCode}</p>
            <p><span class="address-label">City:</span> ${address.city}</p>
            <p><span class="address-label">State:</span> ${address.state}</p>
            <p><span class="address-label">Country:</span> ${address.country}</p>

            <!-- Update and Delete buttons -->
            <div class="button-container">
                <button class="update-btn" onclick="updateAddress('${address.addressName}')">Update</button>
                <button class="delete-btn" onclick="deleteAddress('${address.id}')">Delete</button>
            </div>
        `;

        addressList.appendChild(addressCard);
    });
}

// Function to display error messages
function showError(message) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.style.display = "block";
    errorMessage.innerText = message;
}

// Function to handle address update using prompt
async function updateAddress(addressName) {
    const address = await fetchAddressById(addressName);

    if (!address) {
        alert("Address not found!");
        return;
    }

    // Get new address details from the user using prompts
    //const newAddressName = prompt("Enter new address name:", address.addressName);
    const newFullName = prompt("Enter new full name:", address.fullName);
    const newMobileNumber = prompt("Enter new mobile number:", address.mobileNumber);
    const newHouseNumber = prompt("Enter new house number:", address.houseNumber);
    const newStreet = prompt("Enter new street:", address.street);
    const newLandMark = prompt("Enter new landmark:", address.landMark);
    const newPinCode = prompt("Enter new pin code:", address.pinCode);
    const newCity = prompt("Enter new city:", address.city);
    const newState = prompt("Enter new state:", address.state);
    const newCountry = prompt("Enter new country:", address.country);

    const updatedAddress = {
        addressName: addressName,
        fullName: newFullName,
        mobileNumber: newMobileNumber,
        houseNumber: newHouseNumber,
        street: newStreet,
        landMark: newLandMark,
        pinCode: newPinCode,
        city: newCity,
        state: newState,
        country: newCountry
    };

    const updateAPI = "http://localhost:8080/user/updateAddress";

    try {
        const response = await fetch(updateAPI, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updatedAddress)
        });

        if (response.ok) {
            alert("Address updated successfully!");
            fetchAddresses(); // Refresh address list after update
        } else {
            alert("Failed to update the address. Please try again later.");
        }
    } catch (error) {
        alert("Error updating address: " + error.message);
    }
}

// Function to fetch address by ID for updating
async function fetchAddressById(addressId) {
    const addressAPIById = `http://localhost:8080/user/getAddress/${addressId}`;

    try {
        const response = await fetch(addressAPIById, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            return await response.json();
        } else {
            showError("Failed to fetch the address for updating.");
            return null;
        }
    } catch (error) {
        showError("Error fetching address: " + error.message);
        return null;
    }
}

// Function to handle address deletion
async function deleteAddress(addressId) {
    const deleteAPI = `http://localhost:8080/user/deleteAddress/${addressId}`;

    try {
        const response = await fetch(deleteAPI, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("jwtToken")}`,
                "Content-Type": "application/json"
            }
        });

        if (response.ok) {
            alert(`Address with ID: ${addressId} deleted successfully.`);
            fetchAddresses(); // Re-fetch addresses after delete
        } else {
            showError("Failed to delete the address. Please try again later.");
        }
    } catch (error) {
        showError("Error deleting address: " + error.message);
    }
}

// Fetch addresses when the page loads
window.onload = fetchAddresses;
