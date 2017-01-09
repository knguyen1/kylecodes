/**
 * Created by Khoa on 1/8/2017.
 */

"use strict;"

const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/get_airports', (req, res, next) => {
    fs.readFile('./src/randomair/airports.json', (error, data) => {
        if(error)
            res.sendStatus(500);

        let airports;
        try {
            airports = JSON.parse(data).filter(a => a.status === 1 && a.size ==='large' && a.type === 'airport');
        } catch (exc) {
            next();
        }

        res.json(airports);
    });
});

module.exports = router;