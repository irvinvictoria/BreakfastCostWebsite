import React from 'react'

function ReportsPage() {
  return (
    <div className='reportMainArea'>
        <h1>Reports page</h1>
        <div className='selectDatesArea'>
            <div className='dateFromArea'>
                <h2 for="dateFrom">Date From</h2>
                 <input name='dateFrom' id='dateFrom' type='date'></input>
            </div>
           <div className='dateToArea'>
                <h2 for="dateTo">Date To</h2>
                <input id='dateTo' type='date'></input>
           </div>
            <button id='createReportButton'>Create Report</button>
        </div>
    </div>
    
  );
}

export default ReportsPage;
