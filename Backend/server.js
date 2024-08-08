const express = require("express");
const cors = require("cors");
const db = require('./database');
const mysql = require('mysql2');
const app = express();
const bodyparser = require('body-parser');
const port = 3001;

app.use(cors());
app.use(bodyparser.json());

// Inserts an employee
app.post('/addEmployee', (req,res) => {
    let emp = req.body;
    var sql = "SET @Eeid = ?;SET @FirstName = ?;SET @LastName = ?; \
    CALL AddEmployee(@Eeid,@FirstName,@LastName);";
    
    db.query(sql, [emp.Eeid, emp.FirstName, emp.LastName], (err, rows, fields) => {
        if(!err)
            res.status(201).send({msg: 'Created User', rows});
        else
            console.log(err);
    })
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
})