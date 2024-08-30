import React, { useEffect, useRef, useState } from 'react'
import axios from 'axios';

function TransactionPage() {

    // const [inputDate, setDateValue] = useState([]);
    const inputManualDate = useRef();
    const [pdata, setPdata] = useState([]);

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

    function getNameAndEntries(){
        // Gets todays date
        var now = new Date(); 
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear()+"-"+(month)+"-"+(day);
        // Creates employee json to be used by axios get method
        var eeid = inputEeid.current.value;
        // Calls axios get method
        const emp = {'Eeid': eeid, 'day_of_purchase': today};
        axios.get('http://192.168.1.25:3001/getEmpAndTransactions', {params: emp})
        .then(res => {
            let employee = res.data[1][0];
            let transactions = res.data[0];
            setPdata(transactions);
            let fullName = employee.first_name + " " +employee.last_name;
            textName.current.value = fullName;
            document.getElementById('moneySpent').focus();
            document.getElementById('moneySpent').scrollIntoView();

        }).catch(err => {
            console.log(err);
            textName.current.value = "";
            alert("Cannot find user");
        });
    }

    //deletes the purchase selected
    const deletePurchase = (purchase_id) => {
        axios.delete('http://192.168.1.25:3001/deletePurchase/' + purchase_id)
        .then(res => {
            getNameAndEntries();
        })
        .catch(err => {
            console.log(err);
            alert("Transaction was not deleted!")
        });
    }

    function addPurchase(){
        // Gets todays date
        var now = new Date(); 
        var day = ("0" + now.getDate()).slice(-2);
        var month = ("0" + (now.getMonth() + 1)).slice(-2);
        var today = now.getFullYear()+"-"+(month)+"-"+(day);
        // Gets the eeid 
        var eeid = inputEeid.current.value;
        var amount = inputAmount.current.value;
        if(eeid == "" || today == "" || amount == "" || (amount*1 == 0)){
            alert("Please make sure all information is filled out and purchase amount is not 0.")
        }
        else{
            const purchase = {'Eeid':eeid, 'DayPurchase':today,'PurchaseAmount':amount};
            axios.post('http://192.168.1.25:3001/AddPurchase', purchase)
            .then(res => {
                alert('Purchase was added successfully / La compra fue agregada');
                inputAmount.current.value='';
                getNameAndEntries();
            })
        }
    }

  return (
    <div className='transactionArea'>
        <h1 id='header'>Transaction Page</h1>
        <div className='entryPortion'>
            <h2>
                1. Choose Employee/Elige Empleado
            </h2>
            <div id='findEeid'>
                <input ref={inputEeid} id='eeid' type='text' pattern='[0-9]*' placeholder='EEID' inputMode='numeric' min='0'></input>
                <button onClick={getNameAndEntries} id='findEmployeeButton'>Find EEID</button>
                <input className='innerName' id='transactionsName' readOnly='readonly' ref={textName} placeholder='Name/Nombre'></input>
            </div>
            <div id='date'>
                <h2>2. Today's Date/Fecha de Hoy</h2>
                <input ref={inputManualDate}  id='date' type='date'></input>
            </div>
            <div id='amount'>
                <h2>3. Enter Amount/Ingresa la Cantidad</h2>
                <input ref={inputAmount} id='moneySpent' type='number' pattern='[0-9,.]*' placeholder='XX.XX' inputMode='decimal' min='0' step='.01'>
                </input>
                <button id='enterMoneyButton' onClick={addPurchase}>Enter Amount</button>
            </div>
        </div>

        <div className='editEntries'>
            <h2>
                Todays Transactions /Compras de hoy
            </h2>
            <div className='employeeName'>
                {/* <input className='innerName' id='transactionsName' readOnly='readonly' ref={textName}></input> */}
            </div>
            <div className='todaysTransactions'>
                <table className='purchaseTable'>
                    <thead>
                        <tr>
                            <th>Day of purchase/ Dia</th>
                            <th>Purchase amount/ Cantidad</th>
                            <th>Delete/ Borrar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            pdata.map((purchase, index) => (
                                <tr key= {index}>
                                   <td>{purchase.day_of_purchase.substr(0,10)}</td>
                                   <td>{purchase.purchase_amount}</td>
                                   <td>
                                        <button id='tableButton' onClick={() => deletePurchase(purchase.purchase_id)}>Delete/Borrar</button>
                                   </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    </div>
  );
}

export default TransactionPage;
