import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {getFruits, getRandomFruit, searchFruit, getFruitByName, addFruit, deleteFruit, inDatabase} from "./database.js";
import path from "path";

// Creates the express app
const app = express();
app.use(express.static(path.join(process.cwd(), "public")));

app.use(express.json());


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

// Fetch fruit by name (used for fruit icons and adding a fruit)
app.get("/fruits/name/:name", async (req, res) => {
    const name = req.params.name.trim();
    try {
        const fruit = await getFruitByName(name);
        res.send(fruit);
    } catch(error) {
        console.error("Error fetching a fruit by name:", error.message);
        res.status(500).send( { error: "Internal server error" });
    }
})

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

// Delete fruit
app.delete("/fruits/delete/:fruit", async (req, res) => {
    const fruit = req.params.fruit.trim();

    try {
        const deleted = await deleteFruit(fruit);

        if (!deleted) {
            return res.status(404).json({ error: "Fruit not found" });
        }
        res.status(200).json({ message:`${fruit} successfully deleted`});

    } catch(error) {
        console.error("Error deleting fruit:", error.message);
        res.status(500).send( {error : "Internal server error"});
    }
})

// Check if fruit is in database from name
app.get("/fruits/check/:name", async (req, res) => {
    const name = req.params.name.trim()
    try {
        const result = await inDatabase(name);
        res.send(result);
    } catch(error) {
        console.error("Error checking if fruit is in database:", error.message);
        res.status(500).send( { error: "Internal server error" } );
    }
})

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

// Start the server
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port 8080`);
});
