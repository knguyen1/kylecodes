"use strict";

// exports.index = (req, res) => {
//     res.render('index', {message: 'hello!!'});
// };
//
// exports.partials = (req, res) => {
//     const filename = req.params.filename;
//     const path = "partials/" + filename;
//     if(filename) res.render(path);
// };

/**********
 **********/

const router = require('express').Router();
module.exports = router;

router.use('/randomair', require('./randomair'));

router.use((req, res) => {
    res.status(404).end();
});