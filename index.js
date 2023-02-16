require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser')
const router = require('./routes/index.js');

const port = process.env.PORT;
const app = express();

app.use(express.json());
app.use(cors({
    origin: true
}));
app.use(cookieParser());
app.use('/', router);


mongoose.set('strictQuery', true);
mongoose.connect(process.env.MongoBDurl).then((res)=>console.log('Connected to DB')).catch((e)=>console.log(e));

app.listen(port, ()=>{
    console.log('Server started on port: '+port)
})
