import express from "express";
import {getFruits, getFruitName, getFruitId} from "./database.js";

// Creates the express app
const app = express();
app.use(express.json());

// Fetch all fruits (GET /fruits)
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
            return res.status(400).send({ error: "Fruit not found!" });
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
        res.status(404).send({ error: "Invalid ID: ID must be a number greater than 0" });
    }
    try {
        const fruit = await getFruitId(id);

        if(!fruit) {
            return res.status(404).send({ error: "Fruit not found!" });
        }

        res.send(fruit);
    } catch (error) {
        console.error("Error fetching fruit by ID:" ,error.message);
        res.status(500).send({ error: "Internal server error" });
    }
})

// Create a new note (POST /notes)
// Comment this out for now since it is not relevant to the fruit app
// app.post("/notes", async (req, res) => {
//     const { title, contents } = req.body;
//     const note = await createNote(title, contents);
//     res.status(201).send(note);
// })

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

// Start the server
app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});
