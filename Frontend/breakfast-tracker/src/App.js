import './App.css';
import Menu from './Menu/Menu';
import TransactionPage from './TransactionPage/TransactionPage';
import ReportsPage from './ReportsPage/ReportsPage';
import AddUserPage from './AddUserPage/AddUserPage';

import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";

function App() {
  return (
    <Router className="App">
      <Menu/>
      <div className="mainContainer">
        <Routes>
          <Route path='/' element={<TransactionPage/>} />
          <Route path='/ReportsPage' element={<ReportsPage/>} />
          <Route path='/AddUserPage' element={<AddUserPage/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
