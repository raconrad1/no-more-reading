import express from "express";
import {getFruits, getFruitName, getFruitId, addFruit} from "./database.js";

// Creates the express app
const app = express();
app.use(express.json());

// Fetch all fruits (GET /fruits/all)
app.get("/fruits/all", async (req, res) => {
    try {
        const fruits = await getFruits();
        res.send(fruits);
    } catch (error) {
        console.error("Error fetching all fruits:" , error.message);
        res.status(500).send({ error: "Internal server error" });
    }
})

// Fetch fruit by name (GET /fruits/name)
app.get("/fruits/name/:name", async (req, res) => {
    const name = req.params.name;
    try {
        const fruit = await getFruitName(name);
        if(!fruit) {
            return res.status(400).send("Fruit not found!");
        }

        res.send(fruit);
    } catch (error) {
        console.error("Error fetching fruit by name:", error.message);
        res.status(500).send({ error: "Internal server error" });
    }
})

// Fetch fruit by ID (GET /fruits/id)
app.get("/fruits/id/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id) || id <= 0) {
        res.status(404).send("Invalid ID: ID must be a number greater than 0");
    }
    try {
        const fruit = await getFruitId(id);

        if(!fruit) {
            return res.status(404).send("Fruit not found!");
        }

        res.send(fruit);
    } catch (error) {
        console.error("Error fetching fruit by ID:" ,error.message);
        res.status(500).send({ error: "Internal server error" });
    }
})

// Add fruit (POST /fruits/add)
app.post("/fruits/add", async (req, res) => {
    const {id, name, family, order, genus, calories, fat, sugar, carbohydrates, protein} = req.body;

    if (!id || !name || !family || !order || !genus || calories == null || fat == null || sugar == null || carbohydrates == null || protein == null){
        return res.status(400).send("Missing required fields in request body!");
    }

    try {
        const newFruit = await addFruit(id, name, family, order, genus, calories, fat, sugar, carbohydrates, protein);

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
app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});
