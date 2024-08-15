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
    let dates = req.query;
    console.log(dates);
    var sql = 'SELECT purchase.employee_id, purchase.day_of_purchase, purchase.purchase_amount, employee.first_name, employee.last_name \
    FROM purchase, employee\
    WHERE (purchase.employee_id = employee.employee_id)\
    AND (Date(purchase.day_of_purchase) BETWEEN "'+ dates.dateFrom +'" AND "'+ dates.dateTo +'" );'
    db.query(sql, (err,rows) => {
       if(!err){

            console.log(rows);
            let sums = {};
            let employees = {};
            console.log(rows[0].employee_id);
            for(let i = 0; i<rows.length; i++){
                console.log("for loop")
                if(rows[i].employee_id in sums){
                    sums[rows[i].employee_id] += rows[i].purchase_amount *1;
                    console.log(sums);
                }
                else{
                    sums[rows[i].employee_id] = rows[i].purchase_amount *1;

                    employees[rows[i].employee_id] = rows[i].first_name +" "+ rows[i].last_name;
                }
                
            }

            // Creates Excel workbook
            const workbook = new excel.Workbook();
            const worksheet =workbook.addWorksheet("Sheet 1");
            // Adds data to workbook
            worksheet.cell(1,1).string('EEID');
            worksheet.cell(1,2).string('Name');
            worksheet.cell(1,3).string('Total');

            let counter = 2;
            for( let key in sums){
                worksheet.cell(counter,1).number(key*1);
                worksheet.cell(counter,2).string(employees[key]);
                worksheet.cell(counter,3).number(sums[key]);
                counter++;
            }
            let fileName = "Reportfor"+dates.dateFrom+"-" + dates.dateTo+".xlsx";
            //Saves Excel file
            workbook.write(fileName,(err, stats) => {
                if(err){
                    console.log(err);
                }
                else{
                    console.log('Excel file generated successfully!');
                    console.log(__dirname+'\\'+fileName);
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

            //create file
       } 
       else{
        console.log(err);
       }
    })



});

// Deletes selected purchase
app.delete('/deletePurchase/:id', (req, res) => {
    const purchaseId = req.params.id * 1;
    console.log(purchaseId);
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