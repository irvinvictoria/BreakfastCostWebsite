import React from 'react'
import metrolinaLogo from '../MetrolinaLogo.jpg';

import {
    Link
  } from "react-router-dom";

function Menu() {
  return (
    <div className="menu" role='menubar'>
        <div className='imgBox'>
                <img src={metrolinaLogo} alt="Logo" />
            </div>
        <nav>
            <Link to="/" itemProp='url'>Transactions</Link>
            <Link to="/ReportsPage" itemProp='url'>Reports</Link>
            <Link to="/AddUserPage" itemProp='url'>Add Users</Link>
        </nav>
    </div>
  );
}

export default Menu;
