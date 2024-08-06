import React from 'react'

function AddUserPage() {
  return (
    <div className='addUserArea'>
        <h1>Add User</h1>
        <form>
            <input type='number' pattern='[0-9]*' placeholder='EEID'></input>
            <input type='text' placeholder='First Name'></input>
            <input type='text' placeholder='Last Name'></input>
            <button id='addEmployeeButton'>Add User</button>
        </form>
    </div>
    
  );
}

export default AddUserPage;
