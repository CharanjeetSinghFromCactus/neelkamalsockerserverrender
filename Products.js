const express = require('express');
const router = express.Router();
const Products = require('./ProductData');


router.get('/', function (req, res) {
    res.json(Products);
})

module.exports = router;