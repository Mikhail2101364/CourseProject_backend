const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.js')
const collectionsRoutes = require('./collections.js')

router.use('/', authRoutes);
router.use('/collections', collectionsRoutes);

router.get("/", (req, res)=>{
    console.log('Client requested "name"')
    res.set('Content-Type', 'application/json')
    res.json({name: "Test Server"});
})

module.exports = router;