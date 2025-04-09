import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {Bootstrap} from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from "./MainPage/AuthContext";
import Login from './MainPage/Login';
import AdminDashboard from './Admin/Pages/AdminDashboard';
import AdminPanel from './Admin/AdminPanel';
import MemberDashboard from './Member/Pages/MemberDashboard';
import MemberPanel from './Member/MemberPanel';
import SocietyMemberType from "./Admin/Pages/SocietyMemberType";
import SocietyMemberRecord from "./Admin/Pages/SocietyMemberRecord";
import Watchmen from "./Admin/Pages/Watchmen";
import Member from "./Admin/Pages/Member";

function App() {
  return (
    <div className="App">
      {/* <AuthContext> */}
        <Router>
          <Routes>
            <Route path="/" element={<Login/>}/>
            {/* Admin route */}
            <Route path="/Admin" element={<AdminPanel/>}>
              <Route index element={<AdminDashboard/>}/>
              <Route path="Member" element={<Member/>}/>
              <Route path="Watchmen" element={<Watchmen/>}/>
              <Route path="SocietyMember" element={<SocietyMemberType/>} />
              <Route path="SocietyMemberRecord" element={<SocietyMemberRecord/>}/>
             </Route>
            
            <Route path="/Member" element={<MemberPanel/>}>
              <Route index element={<MemberDashboard/>}/>
            </Route> 
          </Routes>
        </Router>   
      {/* </AuthContext> */}
    </div>
  );
}

export default App;
