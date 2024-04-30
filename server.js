import express from "express";
const app = express();

import { fileURLToPath } from "url";
import { dirname } from "path";

import mysql from "mysql2";
import expressLayouts from "express-ejs-layouts";
import dotenv from "dotenv"
dotenv.config();

//routes
import indexRouter from "./routes/index.js";

//getting directory name of the current file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(expressLayouts);

//setting config variables
app.set('view engine', 'ejs');
app.set('views', __dirname + "/views");
app.set('layout', "layouts/layout");

app.use(express.static("public"));

//importing routers
app.use('/', indexRouter);

//error handling
app.use((err, res, req, next) => {
    console.error("something broke !");
})

const pool = mysql.createPool({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
}).promise();

pool.on('error', (err) => {
    console.error('pool error:', err);
});

(async() => {
    try {
        const [rows] = await pool.query("SHOW TABLES;");
        console.log("tables in notes db : " + rows[0]['Tables_in_note_app']);
    }catch(err){
        console.log("Error executing query !");
    }finally{
        pool.end();
    }
})(); 

app.listen(process.env.PORT || 3000, () => {
    console.log("The server is running at http://localhost:3000 NOW !");
});