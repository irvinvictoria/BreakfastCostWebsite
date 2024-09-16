'use strict';

const express = require('express');
const path = require('path');
const app = express();




app.use(express.static(path.join(__dirname,'/build')));

app.use((req, res, next) => {
    if (/(.ico|.js|.css|.jpg|.png|.map)$/i.test(req.path)) {
        next();
    } else {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-1');
        res.header('Pragma', 'no-cache');
        res.sendFile(path.join(__dirname, '/build', '/index.html'));
    }
});

const port = 80;
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
})