import React, { useRef } from 'react'
import axios from 'axios';

function ReportsPage() {
  const inputDateFrom = useRef();
  const inputDateTo = useRef();

  // Calls the backend to download the report
  function getReport() {
    const dateFrom = inputDateFrom.current.value;
    const dateTo = inputDateTo.current.value;
    if(dateFrom == "" || dateTo == ""){
      alert("Please select desired dates.");
    }
    else{
      const dates = {'dateFrom':dateFrom, 'dateTo':dateTo};
      axios.get('http://192.168.1.25:3001/getReport', {params: dates, responseType:'blob'})
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'Report'+dateFrom+'TO'+dateTo+'.xlsx');
        document.body.appendChild(link);
        link.click();
        link.remove();
      })
      .catch(err =>{
        console.log(err);
        alert("Could not create report")
      })
    }
    
  }


  return (
    <div className='reportMainArea'>
        <h1>Reports page</h1>
        <div className='selectDatesArea'>
            <div className='dateFromArea'>
                <h2 htmlFor="dateFrom">Date From</h2>
                 <input ref={inputDateFrom} name='dateFrom' id='dateFrom' type='date'></input>
            </div>
           <div className='dateToArea'>
                <h2 htmlFor="dateTo">Date To</h2>
                <input ref={inputDateTo} id='dateTo' type='date'></input>
           </div>
            <button onClick={getReport} id='createReportButton'>Create Report</button>
        </div>
    </div>
  );
}

export default ReportsPage;
