const apiUrl = 'https://springsecuritytrail.onrender.com'; // Update with your backend API URL

// Function to fetch seller requests
async function fetchSellerRequests() {
    try {
        // Get the JWT token from localStorage
        const jwtToken = localStorage.getItem('jwtToken');
        
        // Check if the token exists
        if (!jwtToken) {
            alert("No JWT token found. Please log in.");
            return;
        }

        const response = await fetch(`${apiUrl}/admin/getAllRequests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Add JWT token to the Authorization header
            }
        });

        if (response.ok) {
            const requests = await response.json();
            displayRequests(requests);
        } else if (response.status === 204) {
            document.getElementById("requests-list").innerHTML = "<p>No requests available.</p>";
        } else {
            throw new Error("Failed to fetch requests.");
        }
    } catch (error) {
        console.error("Error fetching requests:", error);
    }
}

// Function to display requests on the page
function displayRequests(requests) {
    const requestsList = document.getElementById("requests-list");
    requestsList.innerHTML = '';

    requests.forEach(request => {
        const requestDiv = document.createElement("div");
        requestDiv.className = "request";

        requestDiv.innerHTML = `
            <p><strong>Username:</strong> ${request.userName}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Mobile:</strong> ${request.mobileNumber}</p>
            <p><strong>First Name:</strong> ${request.firstName}</p>
            <p><strong>Last Name:</strong> ${request.lastName}</p>
            <p><strong>Date of Birth:</strong> ${request.dateOfBirth}</p>
            <p><strong>Gender:</strong> ${request.gender}</p>
            <button onclick="handleRequest('${request.userName}', 'approve')">Approve</button>
            <button onclick="handleRequest('${request.userName}', 'reject')">Reject</button>
        `;

        requestsList.appendChild(requestDiv);
        // console.log(request.userName);
    });
}

// Function to handle accept/reject request
async function handleRequest(userName, action) {
    //console.log(userName)
    try {
        // Get the JWT token from localStorage
        const jwtToken = localStorage.getItem('jwtToken');
        
        // Check if the token exists
        if (!jwtToken) {
            alert("No JWT token found. Please log in.");
            return;
        }

        const response = await fetch(`${apiUrl}/admin/${action}Request`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Add JWT token to the Authorization header
            },
            body: JSON.stringify({ data: userName })

    
        });

        if (response.ok) {
            alert(`Request ${action}d successfully.`);
            fetchSellerRequests(); // Refresh list
        } else {
            alert(`Failed to ${action} request. Status: ${response.status}`);
        }
    } catch (error) {
        console.error(`Error ${action}ing request:`, error);
    }
}


// Function to fetch rejected requests
async function fetchRejectedRequests() {
    try {
        // Get the JWT token from localStorage
        const jwtToken = localStorage.getItem('jwtToken');
        
        // Check if the token exists
        if (!jwtToken) {
            alert("No JWT token found. Please log in.");
            return;
        }

        const response = await fetch(`${apiUrl}/admin/getAllRejectedRequests`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}` // Add JWT token to the Authorization header
            }
        });

        if (response.ok) {
            const rejectedRequests = await response.json();
            displayRejectedRequests(rejectedRequests);
        } else if (response.status === 204) {
            document.getElementById("requests-list").innerHTML = "<p>No rejected requests available.</p>";
        } else {
            throw new Error("Failed to fetch rejected requests.");
        }
    } catch (error) {
        console.error("Error fetching rejected requests:", error);
    }
}

// Function to display rejected requests with detailed info
function displayRejectedRequests(rejectedRequests) {
    const requestsList = document.getElementById("requests-list");
    requestsList.innerHTML = '';

    rejectedRequests.forEach(request => {
        const requestDiv = document.createElement("div");
        requestDiv.className = "request";

        requestDiv.innerHTML = `
            <p><strong>Username:</strong> ${request.userName}</p>
            <p><strong>Email:</strong> ${request.email}</p>
            <p><strong>Mobile:</strong> ${request.mobileNumber}</p>
            <p><strong>First Name:</strong> ${request.firstName}</p>
            <p><strong>Last Name:</strong> ${request.lastName}</p>
            <p><strong>Date of Birth:</strong> ${request.dateOfBirth}</p>
            <p><strong>Gender:</strong> ${request.gender}</p>
            <p><strong>Rejection Reason:</strong> ${request.rejectionReason}</p>
        `;

        requestsList.appendChild(requestDiv);
    });
}

// Fetch requests when the page loads
fetchSellerRequests();

// Function to view profile and redirect to account details page
function viewProfile() {
    // Retrieve the token from localStorage or cookies
    let token = localStorage.getItem('jwtToken'); // Ensure token is correctly named
    
    if (!token) {
        alert('You need to log in first');
        return;
    }

    // Fetch the user details using the token
    fetch('https://springsecuritytrail.onrender.com/getMyAccount', {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data) {
            // Store the data in localStorage or sessionStorage
            localStorage.setItem('userAccountDetails', JSON.stringify(data));  // Save user details

            // Redirect to the user details page
            window.location.href = 'userDetail.html';  // Redirect to user details page
        } else {
            alert('No user data found');
        }
    })
    .catch(error => {
        console.error('Error fetching account details:', error);
        alert('Error fetching user details');
    });
}

function logout() {
    // Clear the JWT token from localStorage
    localStorage.removeItem('jwtToken');

    // Optionally, redirect the user to the login page
    window.location.href = 'login.html'; // Update with your actual login page URL
}

function allOrders() {

    // Optionally, redirect the user to the login page
    window.location.href = 'allOrders.html'; // Update with your actual login page URL
}
function Accounts() {

    // Optionally, redirect the user to the login page
    window.location.href = 'allAccounts.html'; // Update with your actual login page URL
}


// Add event listener for the 'Fetch Rejected Requests' button
document.getElementById('fetchRejectedRequests').addEventListener('click', function() {
    fetchRejectedRequests();
});
