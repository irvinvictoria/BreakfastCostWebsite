'use strict';

const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname,'/build')));

const port = 80;
app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
})