import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {getFruits, getRandomFruit, sortByNameAsc, sortByNameDesc, searchFruit, addFruit} from "./database.js";
import path from "path";

// Creates the express app
const app = express();
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());

// Load root URL
app.get("/", async (req, res) => {
    try {
        const message = {
            message: "Fruit app loaded!",
            endpoints: {
                allFruits: "/fruits/all",
                randomFruit: "/fruits/random",
                sortByName: "/fruits/sort/name",
                fruitById: "/fruits/id/:id",
                fruitByName: "/fruits/name/:name",
                fruitsByFamily: "/fruits/family/:family",
            },
            note: "Enjoy!"
        };
        res.send(message);
    } catch (error) {
        console.error("Error loading page", error.message);
        res.status(500).send( { error: "Internal server error" });
    }
})

// Fetch all fruits in order by id (default)
app.get("/fruits/all", async (req, res) => {
    try {
        const fruits = await getFruits();
        res.send(fruits);
    } catch (error) {
        console.error("Error fetching all fruits:" , error.message);
        res.status(500).send({ error: "Internal server error" });
    }
})

// Fetch random fruit
app.get("/fruits/random", async (req, res)=> {
    try {
        const fruit = await getRandomFruit();
        res.send(fruit);
    } catch (error) {
        console.error("Error fetching a random fruit:", error.message);
        res.status(500).send( { error: "Internal server error" });
    }
})

// Sort all fruits by name ascending
app.get("/fruits/sortAsc/name", async (req, res) => {
    try {
        const fruits = await sortByNameAsc();
        res.send(fruits);
    } catch (error) {
        console.error("Error sorting fruits asc", error.message);
        res.status(500).send( { error: "Internal server error" });
    }
})

// Sort all fruits by name descending
app.get("/fruits/sortDesc/name", async (req, res) => {
    try {
        const fruits = await sortByNameDesc();
        res.send(fruits);
    } catch (error) {
        console.error("Error sorting fruits desc", error.message);
        res.status(500).send( { error: "Internal server error" });
    }
})

// Fetch fruit by search input
app.get("/fruits/search/:query", async (req, res) => {
    const query = req.params.query.trim();
    try {
        const fruits = await searchFruit(query); // Use the unified search function

        if (!fruits) {
            return res.status(404).send(`No fruits found matching: ${query}`);
        }
        res.send(fruits);

    } catch (error) {
        console.error("Error fetching fruits:", error.message);
        res.status(500).send({ error: "Internal server error" });
    }
});

// Add fruit
app.post("/fruits/add", async (req, res) => {
    const {name, family, order, genus, calories, fat, sugar, carbohydrates, protein} = req.body;

    if (!name || !family || !order || !genus || calories == null || fat == null || sugar == null || carbohydrates == null || protein == null){
        return res.status(400).send("Missing required fields in request body!");
    }

    try {
        const newFruit = await addFruit(name, family, order, genus, calories, fat, sugar, carbohydrates, protein);

        res.status(201).send({
            message: "Fruit added successfully!",
            fruit: newFruit,
        });
    } catch(error) {
        console.error("Error adding fruit:", error.message);
        res.status(500).send({error: "Internal server error"});
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

// Start the server
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port 8080`);
});
