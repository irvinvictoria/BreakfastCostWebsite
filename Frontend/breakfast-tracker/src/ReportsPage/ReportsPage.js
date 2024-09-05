import React, { useRef } from 'react'
import axios from 'axios';

function ReportsPage() {
  const inputDateFrom = useRef();
  const inputDateTo = useRef();
  const inputCompany = useRef();

  // Calls the backend to download the report
  function getReport() {
    const dateFrom = inputDateFrom.current.value;
    const dateTo = inputDateTo.current.value;
    const company = inputCompany.current.value;
    if(dateFrom == "" || dateTo == ""){
      alert("Please select desired dates.");
    }
    else{
      const filter = {'dateFrom':dateFrom, 'dateTo':dateTo, 'company':company};
      axios.get('http://192.168.1.25:3001/getReport', {params: filter, responseType:'blob'})
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', company+'-Report'+dateFrom+'TO'+dateTo+'.xlsx');
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

  function getBackupReport() {
    const dateFrom = inputDateFrom.current.value;
    const dateTo = inputDateTo.current.value;
    const company = inputCompany.current.value;
    if(dateFrom == "" || dateTo == ""){
      alert("Please select desired dates.");
    }
    else{
      const filter = {'dateFrom':dateFrom, 'dateTo':dateTo, 'company':company};
      axios.get('http://192.168.1.25:3001/getBackupReport', {params: filter, responseType:'blob'})
      .then(res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', company+'-BackupReport'+dateFrom+'TO'+dateTo+'.xlsx');
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
            <div>
                <h2 htmlFor='Select Company'>Select Company</h2>
                <select name='company' id='company' ref={inputCompany}>
                    <option value={"MLC"}>MLC</option>
                    <option value={"MDR"}>MDR</option>
                    <option value={"DL"}>DL</option>
                    <option value={"VF"}>VF</option>
                    <option value={"SS"}>SS</option>
                    <option value={"CH"}>CH</option>
                </select>
            </div>
            <div className='dateFromArea'>
                <h2 htmlFor="dateFrom">Date From</h2>
                <input ref={inputDateFrom} name='dateFrom' id='dateFrom' type='date'></input>
            </div>
           <div className='dateToArea'>
                <h2 htmlFor="dateTo">Date To</h2>
                <input ref={inputDateTo} id='dateTo' type='date'></input>
           </div>
            <button onClick={getReport} className='reportButtons' id='createReportButton'>Create Report</button>
            <button onClick={getBackupReport} className='reportButtons' id='createBackupReportButton'>Create Backup Report</button>
        </div>
    </div>
  );
}

export default ReportsPage;
