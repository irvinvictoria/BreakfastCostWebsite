import React, { useRef } from 'react'
import axios from 'axios';

function ReportsPage() {
  const inputDateFrom = useRef();
  const inputDateTo = useRef();

  function getReport() {
    const dateFrom = inputDateFrom.current.value;
    const dateTo = inputDateTo.current.value;
    console.log(dateFrom + dateTo)
    const dates = {'dateFrom':dateFrom, 'dateTo':dateTo};
    axios.get('http://192.168.1.25:3001/getReport', dates)
    .then(res => {

    })
    .catch(err =>{
      console.log(err);
      alert("Could not create report")
    })

  }


  return (
    <div className='reportMainArea'>
        <h1>Reports page</h1>
        <div className='selectDatesArea'>
            <div className='dateFromArea'>
                <h2 for="dateFrom">Date From</h2>
                 <input ref={inputDateFrom} name='dateFrom' id='dateFrom' type='date'></input>
            </div>
           <div className='dateToArea'>
                <h2 for="dateTo">Date To</h2>
                <input ref={inputDateTo} id='dateTo' type='date'></input>
           </div>
            <button onClick={getReport} id='createReportButton'>Create Report</button>
        </div>
    </div>
  );
}

export default ReportsPage;
