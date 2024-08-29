const express = require("express");
const cors = require("cors");
const db = require('./database');
const mysql = require('mysql2');
const excel = require('excel4node');
const app = express();
const bodyparser = require('body-parser');
const port = 3001;

app.use(cors());
app.use(bodyparser.json());

// Gets the name of the employee and their transactions of the day
app.get('/getEmpAndTransactions', (req, res) => {
    let emp = req.query;
    var sql = 'SELECT * FROM purchase WHERE purchase.employee_id = ' + emp.Eeid + ' AND purchase.day_of_purchase = "'+ emp.day_of_purchase +'";' + 'SELECT * FROM employee WHERE employee_id = ' + emp.Eeid +';';
    db.query(sql, (err, rows, fields) => {
        if(!err){
            res.status(200).send(rows);
        }
        else{
            console.log(err);
        }
    })
});

// Gets the report from the selected dates
app.get('/getReport', (req, res) => {
    let dates = req.query;
    var sql = 'SELECT purchase.employee_id, purchase.day_of_purchase, purchase.purchase_amount, employee.first_name, employee.last_name \
    FROM purchase, employee\
    WHERE (purchase.employee_id = employee.employee_id) AND employee.company = "'+dates.company+'"\
    AND (Date(purchase.day_of_purchase) BETWEEN "'+ dates.dateFrom +'" AND "'+ dates.dateTo +'" );'
    db.query(sql, (err,rows) => {
       if(!err){
            let sums = {};
            let employees = {};
            // Gets the total spent per employee and names of employees 
            for(let i = 0; i<rows.length; i++){
                if(rows[i].employee_id in sums){
                    sums[rows[i].employee_id] += rows[i].purchase_amount *1;
                }
                else{
                    sums[rows[i].employee_id] = rows[i].purchase_amount *1;
                    employees[rows[i].employee_id] = rows[i].first_name +" "+ rows[i].last_name;
                }
            }

            // Creates Excel workbook
            const workbook = new excel.Workbook();
            const worksheet =workbook.addWorksheet("Sheet 1");
            // Adds column headers to the worksheet
            worksheet.cell(1,1).string('EEID');
            worksheet.cell(1,2).string('Name');
            worksheet.cell(1,3).string('Total');
            // Adds data to the worksheet
            let counter = 2;
            for( let key in sums){
                worksheet.cell(counter,1).number(key*1);
                worksheet.cell(counter,2).string(employees[key]);
                worksheet.cell(counter,3).number(sums[key]).style({numberFormat: '#,##0.00'});
                counter++;
            }

            let fileName = "Report.xlsx";

            //Saves Excel file
            workbook.write(fileName,(err, stats) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Excel file generated successfully!');
                    console.log(__dirname+'\\'+fileName);
                    // Sends the file to the frontend
                    res.download(__dirname+'\\'+fileName, fileName, function(err){
                        if(err){
                            next(err);
                        }
                        else{
                            console.log("File Sent:" , fileName);
                        }
                    })
                }
            });
       } 
       else{
        console.log(err);
       }
    })
});

// Deletes selected purchase
app.delete('/deletePurchase/:id', (req, res) => {
    const purchaseId = req.params.id * 1;
    var sql ='DELETE FROM purchase WHERE purchase_id ='+ purchaseId +';';
    db.query(sql, (err,rows) => {
        if(!err){
            res.status(204).send({msg: 'Purchase deleted'});
        }
        else{
            console.log(rows);
            res.status(404);
        }
    })
});

app.delete('/deleteEmployee/:id', (req, res) => {
    const employeeId = req.params.id * 1;
    var sql = 'DELETE FROM employee WHERE employee_id = '+ employeeId +';'; 
    db.query(sql, (err,rows) => {
        if(err){
            console.log(rows);
            res.status(404).send("Error in deleting employee");
        }
        else if(rows['affectedRows'] == 0){
            res.status(404).send("Employee was not found");
        }
        else{
            res.status(204).send({msg: 'Employee deleted'});
        }
    })
})

// Inserts an employee
app.post('/addEmployee', (req,res) => {
    let emp = req.body;
    var sql = "SET @Eeid = ?;SET @FirstName = ?;SET @LastName = ?;SET @Company = ?; \
    CALL AddEmployee(@Eeid,@FirstName,@LastName,@Company);";
    db.query(sql, [emp.Eeid, emp.FirstName, emp.LastName, emp.Company], (err, rows) => {
        if(!err)
            res.status(201).send({msg: 'Created User', rows});
        else
            console.log(err);
    })
});

// Adds purchase to the database
app.post('/addPurchase', (req,res) => {
    let purchase = req.body;
    var sql = "SET @Eeid = ?;SET @DayPurchase = ?;SET @PurchaseAmount = ?; \
    CALL AddPurchase(@Eeid,@DayPurchase,@PurchaseAmount)";
    db.query(sql, [purchase.Eeid, purchase.DayPurchase, purchase.PurchaseAmount], (err,rows,fields) => {
        if(!err){
            res.status(201).send({msg: 'Purchase added', rows});
        }
        else
            console.log(err);
    })
})

app.listen(port, () => {
    console.log(`API served at http://localhost:${port}`)
})