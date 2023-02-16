const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.js')

router.use('/', authRoutes);

router.get("/", (req, res)=>{
    console.log('Client requested "name"')
    res.set('Content-Type', 'application/json')
    res.json({name: "NewRouter"});
})

module.exports = router;