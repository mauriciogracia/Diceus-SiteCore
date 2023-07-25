const apiUrl = 'https://ContactsApi-mgg.azurewebsites.net/api/Contacts/'; // Replace with your API base URL

var searchTextElement = document.getElementById("searchText");

if (searchTextElement) {
    searchTextElement.addEventListener("input", function () {
        var searchText = searchTextElement.value;
        var url = `/index?handler=OnGet&searchText=${encodeURIComponent(searchText)}`;

        fetch(url)
            .then(response => response.text())
            .then(html => {
                // Update the existing div with the new search results HTML
                var div = document.createElement('div');
                div.innerHTML = html;
                var newTable = div.querySelector('table');
                var oldTable = document.querySelector('table');
                oldTable.parentNode.replaceChild(newTable, oldTable);
                // Reinitialize event listeners for any dynamic elements in the search results
                initializeEventListeners();
            })
            .catch(error => console.error('Error:', error));
    });
}

// Variable to track whether the modal is opened for creating or editing
let isCreatingContact = true;

// Function to handle opening the modal for editing
function openEditModal(contact) {
    isCreatingContact = false;
    console.log(contact);
    // Add logic to fetch the contact details using the contactId
    // and pre-populate the form fields with the existing contact information

    document.getElementById("Id").value = contact.id;
    document.getElementById("UserId").value = contact.userId;
    document.getElementById("contactName").value = contact.name;
    document.getElementById("contactPhone").value = contact.phone;
    document.getElementById("contactEmail").value = contact.email;
}

// Event handler for "CREATE" button click
document.getElementById("saveContactBtn").addEventListener("click", function () {
    // Logic for saving a new contact if isCreatingContact is true
    if (isCreatingContact) {
        saveNewContact();
        console.log("Saving new contact...");
    } else {
        // Logic for updating an existing contact 
        updateContact();
        console.log("Updating existing contact...");
    }

    // Close the modal after saving/updating the contact
    closeModal();
});

// Event handler for "Cancel" button click
var cancelBtn = document.querySelector("#contactModal .modal-footer .btn-secondary");
cancelBtn.addEventListener("click", function () {
    closeModal();
});

// Event handler for "X" button (close button) click
var closeButton = document.querySelector("#contactModal .modal-header .btn-close");
closeButton.addEventListener("click", function () {
    closeModal();
});

// Event handler for "EDIT" link click
var editLinks = document.getElementsByClassName("edit-link");
for (var i = 0; i < editLinks.length; i++) {
    editLinks[i].addEventListener("click", function (event) {
        event.preventDefault();
        var contact = {
            id: event.target.dataset.id,
            userId: event.target.dataset.userId,
            name: event.target.dataset.name,
            phone: event.target.dataset.phone,
            email: event.target.dataset.email,
        };
        openEditModal(contact);
    });
}

function closeModal() {
    var contactModal = new bootstrap.Modal(document.getElementById("contactModal"));
    contactModal.hide();
}

function prepareContact() {
    // Get the contact details from the form fields
    var id = document.getElementById("Id").value;
    var userId = document.getElementById("UserId").value;
    var name = document.getElementById("contactName").value;
    var phone = document.getElementById("contactPhone").value;
    var email = document.getElementById("contactEmail").value;

    // Prepare the contact object to send in the request body
    var contact = {
        Id: id,
        UserId: userId,
        Name: name,
        Phone: phone,
        Email: email
    };

    return contact;
}


function updateContact() {
    var contact = prepareContact();

    // Make the API call using Fetch API with POST method
    fetch(apiUrl + contact.Id, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact) // Convert the contact object to JSON
    })
        .then(response => {
            if (response.ok || response.status === 204) {
                // The contact was successfully updated. 
                console.log("Contact updated successfully.");
                location.reload();
            } else {
                // Handle the API error response if needed.
                console.log("Failed to update contact. Status: " + response.status);
            }
        })
        .catch(error => {
            // Handle any network-related errors if needed.
            console.log("Network error: " + error);
        });
}

function saveNewContact() {
    var contact = prepareContact();

    // Make the API call using Fetch API with POST method
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(contact) // Convert the contact object to JSON
    })
        .then(response => {
            if (response.ok) {
                // The contact was successfully created.
                console.log("New contact saved successfully.");
                location.reload();
            } else {
                // Handle the API error response if needed.
                console.log("Failed to save new contact. Status: " + response.status);
            }
        })
        .catch(error => {
            // Handle any network-related errors if needed.
            console.log("Network error: " + error);
        });
}

//Handle DELETE click
document.addEventListener('DOMContentLoaded', function () {
    var deleteLinks = document.getElementsByClassName('delete-link');
    for (var i = 0; i < deleteLinks.length; i++) {
        deleteLinks[i].addEventListener('click', function (event) {
            event.preventDefault(); // Prevent default link behavior

            // Retrieve the contactId from the data attribute
            var contactId = event.target.dataset.contactId;

            // Make the API call using Fetch API
            fetch(apiUrl + contactId, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        // The contact was successfully deleted. Perform any further actions if needed.
                        console.log("Contact with ID " + contactId + " deleted successfully.");
                        location.reload();
                    } else {
                        // Handle the API error response if needed.
                        console.log("Failed to delete contact with ID " + contactId + ". Status: " + response.status);
                    }
                })
                .catch(error => {
                    // Handle any network-related errors if needed.
                    console.log("Network error: " + error);
                });
        });
    }
});