import React, { useEffect, useRef } from 'react'
import axios from 'axios';

function TransactionPage() {

    // const [inputDate, setDateValue] = useState([]);
    const inputManualDate = useRef();

    React.useEffect(()=> {
            var now = new Date(); 
            var day = ("0" + now.getDate()).slice(-2);
            var month = ("0" + (now.getMonth() + 1)).slice(-2);
            var today = now.getFullYear()+"-"+(month)+"-"+(day);
            // setDateValue(today);
            inputManualDate.current.value = today;
    }, [])

    const textName = useRef();
    const inputEeid = useRef();
    const inputAmount = useRef();
    const textBoxName = useRef();

    function getNameAndEntries(){var now = new Date(); 
        var now = new Date(); 
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear()+"-"+(month)+"-"+(day);

        var eeid = inputEeid.current.value;
        var date = today;
        console.log(eeid);
        console.log(date);
        const emp = {'Eeid': eeid, 'day_of_purchase': date};
        axios.get('http://localhost:3001/getEmpAndTransactions', {params: emp})
        .then(res => {
            console.log(res.data);
            let employee = res.data[1][0];
            let transactions = res.data[0];
            console.log(employee.first_name);
            let fullName = employee.first_name + " " +employee.last_name;
            textBoxName.current.value = "Name: " + fullName;
            textName.current.value = "Name: " + fullName;
        }).catch(err => {
            console.log(err)
            alert("User was not added, check with admin.");
        });
    }


  return (
    <div className='transactionArea'>
        <h1 id='header'>Transaction Page</h1>
        <div className='entryPortion'>
            <h2>
                1. Choose Employee/Elige Empleado
            </h2>
            <div id='findEeid'>
                <input ref={inputEeid} id='eeid' type='number' pattern='[0-9]*' placeholder='EEID'></input>
                <button onClick={getNameAndEntries} id='findEmployeeButton'>Find EEID</button>
            </div>
            <div id='date'>
                <h2>2. Select Date/Seleccione Fecha</h2>
                <input ref={inputManualDate}  id='date' type='date'></input>
            </div>
            <div id='amount'>
                <h2>3. Enter Amount/Entre la cantidad</h2>
                <input ref={inputAmount} id='moneySpent' type='number' pattern='[0-9,.]*' placeholder='XX.XX'>
                </input>
                <button id='enterMoneyButton'>Enter Amount</button>
            </div>
        </div>

        <div className='editEntries'>
            <h2>
                Todays Transactions/Edit Entries
            </h2>
            <div className='employeeName'>
                <h3 className='innerName' ref={textBoxName} value = {textBoxName}> </h3>
                <input className='innerName' id='transactionsName' readOnly='readonly' ref={textName}></input>
            </div>
            
        </div>
        
    </div>
  );
}

export default TransactionPage;
