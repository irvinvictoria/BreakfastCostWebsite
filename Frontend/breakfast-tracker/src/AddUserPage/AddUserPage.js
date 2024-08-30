import React, { useRef } from 'react'
import axios from 'axios';


function AddUserPage() {

  const inputEeid = useRef();
  const inputFirst = useRef();
  const inputLast = useRef();
  const inputCompany = useRef();
  const deleteEeid = useRef();


  // Adds a new employee to the database
  function addUser(e) {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const eeid = Number(formData.get('Eeid'));
    const firstname = formData.get('FirstName').trim();
    const lastname = formData.get('LastName').trim();
    const company = formData.get('Company').trim();

    if(eeid == "" || firstname == "" || lastname == ""){
      alert("Please make sure all information is filled out.")
    }
    else{
      // Calls Backend if they entered 
      const emp = {'Eeid': eeid, "FirstName": firstname, "LastName": lastname, 'Company': company};
      axios.post('http://192.168.1.25:3001/AddEmployee', emp)
      .then(res => {
        alert("User was successfully added!");
        inputEeid.current.value = '';
        inputFirst.current.value = '';
        inputLast.current.value = '';
        inputCompany.current.value = '';
      }).catch(err => {
        console.log(err)
        alert("User was not added, check with admin.");
      });
    }
  }

  //Deletes an employee from the database along with their purchases
  function deleteUser(e){
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const eeid = Number(formData.get('DeleteEeid'));
    if(eeid == 0){
      alert("Please enter a valid employee ID number");
    }
    else{
      const emp = {'Eeid':eeid};
      axios.delete('http://192.168.1.25:3001/deleteEmployee/' + eeid)
      .then(res => {
          alert('Employee was deleted!');
          deleteEeid.current.value = '';
      })
      .catch(err => {
          console.log(err);
          var errMsg = err['request']['response'];
          alert(errMsg);
      });
    }
  }

  return (
    <div className='addUserArea'>
        <h1>Add Employee</h1>
        <form onSubmit={addUser}>
            <input name='Eeid' id='Eeid' type='number' ref={inputEeid} pattern='[0-9]*' placeholder='EEID' inputMode='numeric' min='0'></input>
            <input name='FirstName' id='FirstName' ref={inputFirst} type='text' placeholder='First Name'></input>
            <input name='LastName' id='LastName' ref={inputLast} type='text' placeholder='Last Name'></input>
            <input name='Company' id='Company' ref={inputCompany} type='text' placeholder='Company'></input>
            <button id='addEmployeeButton'>Add Employee</button>
        </form>

        <h1>Delete Employee</h1>
        <form onSubmit={deleteUser}>
            <input name='DeleteEeid' id='DeleteEeid' ref={deleteEeid} type='number' pattern='[0-9]*' inputMode='numeric' min='1' placeholder='EEID to Delete'></input>
            <button id='deleteEmployeeButton'>Delete Employee</button>
        </form>
    </div>
  );
}

export default AddUserPage;
