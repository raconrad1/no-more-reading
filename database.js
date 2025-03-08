import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// createPool is used to manage a pool of mysql connections, using the .env variables in my own .env file to create a connection on my local host without that information displayed in the source code.
const pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise();

//Returns an array of all fruit objects
export async function getFruits() {
    const [res] = await pool.query("SELECT * FROM fruits");
    return res;
}

// Returns a single random fruit
export async function getRandomFruit() {
    const [res] = await pool.query("SELECT * FROM fruits f ORDER BY RAND( ) LIMIT 1;");
    return res[0];
}


// Searches fruit by name, id, family, order, or genus
export async function searchFruit(query) {
    const [res] = await pool.query(`
        SELECT *
        FROM fruits
        WHERE id = ?
           OR LOWER(name) LIKE CONCAT('%', ?, '%')
           OR LOWER(family) = LOWER(?)
           OR LOWER(\`order\`) = LOWER(?)
           OR LOWER(genus) = LOWER(?)
    `, [query, query, query, query, query, query]);

    return res.length ? res : null;
}

// Adds a fruit to the database
export async function addFruit(name, family, order, genus, calories, fat, sugar, carbohydrates, protein) {
    try {
        const [res] = await pool.query(`
                    INSERT INTO fruits (name, family, \`order\`, genus, calories, fat, sugar, carbohydrates, protein)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [name, family, order, genus, calories, fat, sugar, carbohydrates, protein]);
        return {
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

// Deletes a fruit given the name
export async function deleteFruit(name) {
    try {
        const [res] = await pool.query(`
            DELETE FROM fruits WHERE LOWER(name) = LOWER(?)`,
            [name]);

        if (res.affectedRows === 0) {
            console.warn("No fruit found to delete.");
            return false;
        }
        // console.log("database says it worked", res.affectedRows);
        return true;


    } catch(error) {
        console.error("Error deleting fruit:", error);
        throw error;
    }
}
