import React from 'react'

function TransactionPage() {
  return (
    <div className='transactionArea'>
        <h1 id='header'>Transaction Page</h1>
        <div className='entryPortion'>
            <h2>
                1. Choose Employee/Elige Empleado
            </h2>
            <div id='findEeid'>
                <input id='eeid' type='number' pattern='[0-9]*' placeholder='EEID'></input>
                <button id='findEmployeeButton'>Find EEID</button>
            </div>
            <div id='date'>
                <h2>2. Select Date/Seleccione Fecha</h2>
                <input id='date' type='date'></input>
            </div>
            <div id='amount'>
                <h2>3. Enter Amount/Entre la cantidad</h2>
                <input id='moneySpent' type='number' pattern='[0-9,.]*' placeholder='XX.XX'>
                </input>
                <button id='enterMoneyButton'>Enter Amount</button>
            </div>

            
        </div>


        <div className='editEntries'>
            <h2>
                Transactions/Edit Entries
            </h2>
            <table>
                <tr>Name:</tr>
                <tr></tr>
            </table>
        </div>
        
    </div>
  );
}

export default TransactionPage;
