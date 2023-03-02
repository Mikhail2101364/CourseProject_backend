const express = require('express');
const router = express.Router();

const authRoutes = require('./auth.js')
const collectionsRoutes = require('./collections.js')
const itemsRoutes = require('./items.js')

router.use('/', authRoutes);
router.use('/collections', collectionsRoutes);
router.use('/items', itemsRoutes);

router.get("/", (req, res)=>{
    console.log('Test server')
    res.set('Content-Type', 'application/json')
    res.json({name: "Test Server"});
})

module.exports = router;