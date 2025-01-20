import express from "express";
import {getFruits, getFruit} from "./database.js";

// Creates the express app
const app = express();
app.use(express.json());

// Fetch all notes (GET /fruits)
app.get("/all", async (req, res) => {
    const fruits = await getFruits();
    res.send(fruits);
})

// Fetch note by ID (GET /fruits/name)
app.get("/:name", async (req, res) => {
    const name = req.params.name;
    const fruit = await getFruit(name);
    res.send(fruit);
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
