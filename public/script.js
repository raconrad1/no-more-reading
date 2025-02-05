document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("allFruits").addEventListener("click", getFruits);
    document.getElementById("fruitNameSubmit").addEventListener("click", getFruitName);
    document.getElementById("familyNameSubmit").addEventListener("click", getFamilyName);
    document.getElementById("randomFruit").addEventListener("click", getRandomFruit);
    document.getElementById("nameSortArrow").addEventListener("click", sortByName);
});

function updateTable(fruits) {
    const tableBody = document.getElementById("fruitTable");
    tableBody.innerHTML = "";

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
}

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

async function getFruitName(event) {
    event.preventDefault();
    const fruitName = document.getElementById("fruitName").value.trim();
    if (!fruitName) {
        console.log("Search cannot be empty");
        return;
    }
    try {
        const response = await fetch(`/fruits/name/${fruitName}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch the fruit: ${response.statusText}`);
        }
        const fruit = await response.json();

        const fruitArray = Array.isArray(fruit) ? fruit : [fruit];
        updateTable(fruitArray);

    } catch (error) {
        console.error("Error fetching fruit by name", error);
    }
}

async function getFamilyName(event) {
    event.preventDefault();
    const familyName = document.getElementById("familyName").value.trim();
    if (!familyName) {
        console.log("Search cannot be empty");
        return;
    }
    try {
        const response = await fetch(`/fruits/family/${familyName}`);

        if (!response.ok) {
            throw new Error(`Failed to fetch the fruits by family: ${response.statusText}`);
        }
        const fruit = await response.json();

        const fruitArray = Array.isArray(fruit) ? fruit : [fruit];
        updateTable(fruitArray);

    } catch (error) {
        console.error("Error fetching fruits by family", error);
    }
}

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

let sort = "Asc";
let arrow = "↕";
const updateSortStatus = () => {
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