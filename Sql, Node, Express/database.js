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

async function fetchData() {
    try {
        const fruitResponse = await axios.get(`https://www.fruityvice.com/api/fruit/`);
        return JSON.stringify(fruitResponse.data);
    } catch (error) {
        console.error(`Error fetching data`, error);
    }
}

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

// Creates a new note given the user's title and contents, then returns the new note object
// Comment this out for now since it is not relevant to the fruit app
// export async function createNote(title, contents) {
//     const [result] = await pool.query(`
//     INSERT INTO notes (title, contents)
//     VALUES (?, ?)
//     `, [title, contents]);
//     const id = result.insertId;
//     return getNote(id);
// }

