import React, { useRef, useState } from 'react'
import axios from 'axios';


function AddUserPage() {

  const inputEeid = useRef();
  const inputFirst = useRef();
  const inputLast = useRef();

  // Adds a new employee to the database
  function addUser(e) {
    
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const eeid = Number(formData.get('Eeid'));
    const firstname = formData.get('FirstName');
    const lastname = formData.get('LastName');
    if(eeid == "" || firstname == "" || lastname == ""){
      alert("Please make sure all information is filled out.")
    }
    else{
      // Calls Backend if they entered 
      const emp = {'Eeid': eeid, "FirstName": firstname, "LastName": lastname};
      axios.post('http://192.168.1.25:3001/AddEmployee', emp)
      .then(res => {
        alert("User was successfully added!");
        inputEeid.current.value = '';
        inputFirst.current.value = '';
        inputLast.current.value = '';
      }).catch(err => {
        console.log(err)
        alert("User was not added, check with admin.");
      });
    }
  }

  return (
    <div className='addUserArea'>
        <h1>Add User</h1>
        <form onSubmit={addUser}>
            <input name='Eeid' id='Eeid' type='number' ref={inputEeid} pattern='[0-9]*' placeholder='EEID'></input>
            <input name='FirstName' id='FirstName' ref={inputFirst} type='text' placeholder='First Name'></input>
            <input name='LastName' id='LastName' ref={inputLast} type='text' placeholder='Last Name'></input>
            <button id='addEmployeeButton'>Add User</button>
        </form>
    </div>
  );
}

export default AddUserPage;
