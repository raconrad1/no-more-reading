import express from "express";
import dotenv from "dotenv";
dotenv.config();
import {getFruits, getRandomFruit, getFruitName, getFruitId, getFruitFamily, addFruit} from "./database.js";

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

app.get("/fruits/random", async (req, res)=> {
    try {
        const fruit = await getRandomFruit();
        res.send(fruit);
    } catch (error) {
        console.error("Error fetching all fruits:", error.message);
        res.status(500).send( { error: "Internal server error" });
    }
})

app.get("/", async (req, res) => {
    try {
        const message = {
            message: "Fruit app loaded!",
            endpoints: {
                allFruits: "/fruits/all",
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

// Fetch fruit by name
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

// Fetch fruit by ID
app.get("/fruits/id/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if(isNaN(id) || id <= 0) {
        return res.status(404).send("Invalid ID: ID must be a number greater than 0");
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

// Fetch fruit by family name
app.get("/fruits/family/:family", async (req, res) => {
    const family = req.params.family;

    try {
        const fruit = await getFruitFamily(family);
        if(!fruit) {
            return res.status(404).send(`Fruit not found! There are not fruits in the database in the ${family} family.`);
        }
        res.send(fruit);
    } catch (error) {
        console.error("Error fetching fruit by family:", error.message);
        res.status(500).send({ error: "Internal server error"});
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

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
})

// Start the server
app.listen(process.env.PORT || 8080, () => {
    console.log(`Server is running on port 8080`);
});
