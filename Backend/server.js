const express = require("express");
const cors = require("cors");
const db = require('./database');
const mysql = require('mysql2');
const app = express();
const bodyparser = require('body-parser');
const port = 3001;

app.use(cors());
app.use(bodyparser.json());

// Gets the name of the employee and their transactions of the day
app.get('/getEmpAndTransactions', (req, res) => {
    let emp = req.query;
    var sql = 'SELECT * FROM purchase WHERE purchase.employee_id = ' + emp.Eeid + ' AND purchase.day_of_purchase = "'+ emp.day_of_purchase +'";' + 'SELECT * FROM employee WHERE employee_id = ' + emp.Eeid +';';
    //var sql = 'SELECT * FROM employee WHERE employee_id = ' + emp.Eeid + '; SELECT * FROM employees.purchase WHERE purchase.employee_id = ' + emp.Eeid + ' AND purchase.day_of_purchase = '+ emp.Date +';';
    db.query(sql, (err, rows, fields) => {
        if(!err){
            console.log(rows[0]);
            res.status(200).send(rows);
        }
        else{
            console.log(err);
        }
    })
});

// Gets the report from the selected dates
app.get('/getReport', (req, res) => {

});

// Inserts an employee
app.post('/addEmployee', (req,res) => {
    let emp = req.body;
    var sql = "SET @Eeid = ?;SET @FirstName = ?;SET @LastName = ?; \
    CALL AddEmployee(@Eeid,@FirstName,@LastName);";
    
    db.query(sql, [emp.Eeid, emp.FirstName, emp.LastName], (err, rows, fields) => {
        if(!err)
            res.status(200).send({msg: 'Created User', rows});
        else
            console.log(err);
    })
});

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
})