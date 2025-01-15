import express from "express";
import { getNotes, getNote, createNote } from "./database.js";

// Creates the express app
const app = express();
app.use(express.json());

// Fetch all notes (GET /notes)
app.get("/notes", async (req, res) => {
    const notes = await getNotes();
    res.send(notes);
})

// Fetch note by ID (GET /notes/id)
app.get("/notes/:id", async (req, res) => {
    const id = req.params.id;
    const note = await getNote(id);
    res.send(note);
})

// Create a new note (POST /notes)
app.post("/notes", async (req, res) => {
    const { title, contents } = req.body;
    const note = await createNote(title, contents);
    res.status(201).send(note);
})

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

// Start the server
app.listen(8080, () => {
    console.log(`Server is running on port 8080`);
});