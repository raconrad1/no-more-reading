document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("allFruits").addEventListener("click", getFruits);
    document.getElementById("randomFruit").addEventListener("click", getRandomFruit);
    document.getElementById("searchSubmit").addEventListener("click", searchFruits);
    document.getElementById("addFruitSubmit").addEventListener("click", addFruit);
    document.getElementById("openAddFruitModal").addEventListener("click", openModal);
    document.getElementById("closeAddFruitModal").addEventListener("click", () => closeModal("addFruitModal"));
    document.getElementById("openDeleteFruitModal").addEventListener("click", openModal);
    document.getElementById("closeDeleteFruitModal").addEventListener("click", () => closeModal("deleteFruitModal"));
    document.getElementById("deleteFruitSubmit").addEventListener("click", deleteFruit);
});

// Hides the whole table including headers
const fullTable = document.getElementById("fullTable");
fullTable.style.display = "none";

// Update table to show data via fetch functions
function updateTable(fruits) {
    const tableBody = document.getElementById("fruitTable");
    tableBody.innerHTML = "";
    console.log(fruits);
    fruits.forEach(fruit => {
        const row = `<tr>
                <td>${fruit.id}</td>
                <td>${fruit.name}</td>
                <td>${fruit.family}</td>
                <td>${fruit.order}</td>
                <td>${fruit.genus}</td>
                <td>${fruit.calories}</td>
                <td>${fruit.fat}g</td>
                <td>${fruit.sugar}g</td>
                <td>${fruit.carbohydrates}g</td>
                <td>${fruit.protein}g</td>
            </tr>`;
        tableBody.innerHTML += row;

    });
    clearSearchFields();
    fullTable.style.display = "";
}

// Get all fruits
async function getFruits() {
    try {
        const response = await fetch("/fruits/all");

        if (!response.ok) {
            throw new Error(`Failed to fetch all fruits: ${response.statusText}`);
        }

        const fruits = await response.json();
        updateTable(fruits);

    } catch (error) {
        console.error("Error fetching fruits:", error);
    }
}

// Show random fruit in table
async function getRandomFruit() {
    try {
        const response = await fetch("/fruits/random");

        if (!response.ok) {
            throw new Error(`Failed to fetch a random fruit: ${response.statusText}`);
        }

        const fruit = await response.json();
        const fruitArray = Array.isArray(fruit) ? fruit : [fruit];
        updateTable(fruitArray);
    } catch (error) {
        console.error("Error fetching a random fruit", error);
    }
}

// Search fruit by id, name, family, order, genus
async function searchFruits(event) {
    event.preventDefault();
    const query = document.getElementById("searchInput").value.trim();

    if (!query) {
        showSearchError("Search cannot be empty");
        console.log("Search cannot be empty");
        return;
    }

    try {
        const response = await fetch(`fruits/search/${query}`);
        if (!response.ok) {
            showSearchError("Fruit not found");
            throw new Error(`failed to fetch fruit ${response.statusText}`);
        }

        const fruit = await response.json();
        const fruitArray = Array.isArray(fruit) ? fruit : [fruit];
        updateTable(fruitArray);
    } catch (error) {
        console.error("Error fetching fruit", error);
    }
}

// Add fruit via modal window
async function addFruit(event) {
    event.preventDefault();

    const name = document.getElementById("nameInput").value;
    const family = document.getElementById("familyInput").value;
    const order = document.getElementById("orderInput").value;
    const genus = document.getElementById("genusInput").value;
    const calories = document.getElementById("caloriesInput").value;
    const fat = document.getElementById("fatInput").value;
    const sugar = document.getElementById("sugarInput").value;
    const carbohydrates = document.getElementById("carbohydratesInput").value;
    const protein = document.getElementById("proteinInput").value;

    const response = await fetch("fruits/add", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, family, order, genus, calories, fat, sugar, carbohydrates, protein} )
    })

    const fruit = await response.json();
    closeModal("addFruitModal");
    document.getElementById("searchInput").value = name;
    await searchFruits(event);
    // alert(fruit.message || "Error adding fruit");
}

// Clear the search field
function clearSearchFields() {
    const searchFields = document.querySelectorAll(".searchField");
    searchFields.forEach(field => {
        field.value = "";
        field.blur();
    });
}

// Open any modal using data-modal value in html
function openModal(event) {
    const modalId = event.target.getAttribute("data-modal");
    document.getElementById(modalId).classList.add("open");
}

// Close any modal using data-modal value in html
function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove("open");
    }
}

// Close modals with esc
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        document.querySelectorAll(".modal.open").forEach(modal => closeModal(modal.id));
    }
});

// Close modals by clicking outside of modal inner
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            modal.classList.remove("open");
        }
    });
});

// Listeners for fruit icons
document.querySelectorAll(".fruitIcon").forEach(icon => {
    icon.addEventListener("click", async function () {
        document.getElementById("searchInput").value = this.id;
        await searchFruits(event);
    });
});

// Invalid search error display
function showSearchError(error) {
    const message = document.getElementById("searchErrorMessage");
    message.textContent = error;
    message.style.visibility = "visible";
    clearSearchFields();
    setTimeout(() => {
        message.style.visibility = "hidden";
    }, 3000);
}

// Another try at the search arrow
document.addEventListener("DOMContentLoaded", function () {
    const table = document.getElementById("fullTable");
    const tbody = document.getElementById("fruitTable");
    const nameHeader = document.getElementById("nameSortArrow");

    let ascending = true; // Track sorting order

    nameHeader.addEventListener("click", function () {
        let rows = Array.from(tbody.querySelectorAll("tr"));

        rows.sort((rowA, rowB) => {
            let cellA = rowA.cells[1].textContent.trim().toLowerCase();
            let cellB = rowB.cells[1].textContent.trim().toLowerCase();

            return ascending ? cellA.localeCompare(cellB) : cellB.localeCompare(cellA);
        });

        ascending = !ascending; // Toggle sorting order
        nameHeader.textContent = ascending ? "↑" : "↓"; // Update sort indicator

        tbody.innerHTML = ""; // Clear table body
        rows.forEach(row => tbody.appendChild(row)); // Reinsert sorted rows
    });
});

// Delete fruit
async function deleteFruit(event) {
    event.preventDefault();
    const fruit = document.getElementById("deleteFruitNameInput").value.trim();
    const passwordInput = document.getElementById("deleteFruitPasswordInput").value.trim();
    const password = "soup";

    if (!fruit || !passwordInput) {
        console.log("Fields cannot be empty");
        return;
    }

    if (passwordInput !== password) {
        console.log("Incorrect password");
        return;
    }

    try {
        const response = await fetch(`/fruits/delete/${encodeURIComponent(fruit)}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || `Failed to delete fruit: ${response.statusText}`);
        }

        console.log(data.message);
        closeModal("deleteFruitModal");
        await getFruits();
    } catch (error) {
        console.error("Error deleting fruit:", error);
    }
}