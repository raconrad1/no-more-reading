document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("allFruits").addEventListener("click", getFruits);
    document.querySelector("form").addEventListener("submit", getFruitName);
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
                <td>${fruit.fat}</td>
                <td>${fruit.sugar}</td>
                <td>${fruit.carbohydrates}</td>
                <td>${fruit.protein}</td>
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

