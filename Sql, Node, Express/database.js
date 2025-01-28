import mysql from "mysql2";
import dotenv from "dotenv";
import axios from "axios";
dotenv.config();

// createPool is used to manage a pool of mysql connections, using the .env variables in my own .env file to create a connection on my local host without that information displayed in the source code.
const pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE
}).promise();

//Returns an array of fruit objects
export async function getFruits() {
    const [res] = await pool.query("SELECT * FROM fruits");
    return res;
}

// Returns a single fruit via name
export async function getFruitName(name) {
    const [res] = await pool.query(`
    SELECT * 
    FROM fruits
    WHERE name = ?
    `, [name]);
    return res[0];
}
// Returns a single fruit via id
export async function getFruitId(id) {
    const [res] = await pool.query(`
    SELECT *
    FROM fruits
    WHERE id = ?
    `, [id]);
    return res[0];
}


export async function addFruit(id, name, family, order, genus, calories, fat, sugar, carbohydrates, protein) {
    try {
        const [res] = await pool.query(`
                    INSERT INTO fruits (id, name, family, \`order\`, genus, calories, fat, sugar, carbohydrates, protein)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [id, name, family, order, genus, calories, fat, sugar, carbohydrates, protein]);
        return {
            id,
            name,
            family,
            order,
            genus,
            calories,
            fat,
            sugar,
            carbohydrates,
            protein
        };
    } catch(error) {
        console.error("Error adding fruit:", error);
        throw error;
    }
}
