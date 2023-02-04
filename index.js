require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors({
    origin: true
}));
app.use(cookieParser());

app.get("/", (req, res)=>{
    console.log('Client requested "name"')
    res.set('Content-Type', 'application/json')
    res.json({name: "GitHub"});
})

app.listen(port, ()=>{
    console.log('Server started')
})