import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

// createPool is used to manage a pool of mysql connections, using the .env variables in my own .env file to create a connection on my local host without that information displayed in the source code.
const pool = mysql.createPool( {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE || "notes_app"
}).promise();

//Returns an array of note objects
export async function getNotes() {
    const [rows] = await pool.query("SELECT * FROM notes");
    return rows;
}

// Returns a single note object given the id requested by the user during the HTTP request
export async function getNote(id) {
    const [rows] = await pool.query(`
    SELECT * 
    FROM notes
    WHERE id = ?
    `, [id]);
    return rows[0];
}

// Creates a new note given the user's title and contents, then returns the new note object
export async function createNote(title, contents) {
    const [result] = await pool.query(`
    INSERT INTO notes (title, contents)
    VALUES (?, ?)
    `, [title, contents]);
    const id = result.insertId;
    return getNote(id);
}

