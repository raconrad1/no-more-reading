document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("allFruits").addEventListener("click", getFruits);
    document.getElementById("randomFruit").addEventListener("click", getRandomFruit);
    document.getElementById("nameSortArrow").addEventListener("click", sortByName);
    document.getElementById("searchSubmit").addEventListener("click", searchFruits);
    document.getElementById("addFruitSubmit").addEventListener("click", addFruit)
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
        console.log("Search cannot be empty");
        return;
    }

    try {
        const response = await fetch(`fruits/search/${query}`);
        if (!response.ok) {
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
    closeModal();
    document.getElementById("searchInput").value = name;
    await searchFruits(event);
    // alert(fruit.message || "Error adding fruit");
}

// Sort all fruits by name with the arrow. Terrible.
async function sortByName() {
    if (sort === "none") {
        updateSortStatus();
        return getFruits();
    } else {
        try {
            const response = await fetch(`/fruits/sort${sort}/name`);
            updateSortStatus();

            if (!response.ok) {
                throw new Error(`Failed to sort fruits by name: ${response.statusText}`);
            }

            const fruits = await response.json();
            updateTable(fruits);
        } catch (error) {
            console.error("Error sorting fruits by name", error);
        }
    }
}

// Sorting arrow stuff. I hate it. Need to change it.
let sort = "Asc";
let arrow = "↕";
function updateSortStatus() {
    if (sort === "none") {
        sort = "Asc";
        arrow = "↕";
    } else if (sort === "Asc") {
        sort = "Desc";
        arrow = "^";
    } else if (sort === "Desc") {
        sort = "none";
        arrow = "v";
    }
    document.getElementById("nameSortArrow").textContent = arrow;
}


// Clear the search field
function clearSearchFields() {
    const searchFields = document.querySelectorAll(".searchField");
    searchFields.forEach(field => {
        field.value = "";
        field.blur();
    });
}

// Add fruit modal window
const modal = document.getElementById("modal");
document.getElementById("openModal").addEventListener("click", openModal);
document.getElementById("closeModal").addEventListener("click", closeModal);

function openModal() {
    modal.classList.add("open");
}
function closeModal() {
    modal.classList.remove("open");
}

document.querySelectorAll(".fruitIcon").forEach(icon => {
    icon.addEventListener("click", async function () {
        document.getElementById("searchInput").value = this.id;
        await searchFruits(event);
    })
});
