import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { Bootstrap } from "react-bootstrap";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AuthContext from "./MainPage/AuthContext";
import Login from './MainPage/Login';
import AdminDashboard from './Admin/Pages/AdminDashboard';
import AdminPanel from './Admin/AdminPanel';
import MemberDashboard from './Member/Pages/MemberDashboard';
import MemberPanel from './Member/MemberPanel';
import SocietyMemberType from "./Admin/Pages/SocietyMemberType";
import SocietyMemberRecord from "./Admin/Pages/SocietyMemberRecord";
import Member from "./Admin/Pages/Member";
import PrivateRoute from "./MainPage/PrivateRoute";
import AuthProvider from "./MainPage/AuthProvider"; // <-- NEW
import AddMember from "./Admin/Pages/AddMember";
import ViewMember from "./Admin/Pages/ViewMember";
import Watchmenrecord from "./Admin/Pages/watchmenrecord";
import AddWatchmen from "./Admin/Pages/AddWatchmen";


function App() {
  return (
    <div className="App">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Login />} />
            {/* Admin route */}
            <Route element={<PrivateRoute allowRole="Admin" />}>
              <Route path="/Admin" element={<AdminPanel />}>
                <Route index element={<AdminDashboard />} />
                <Route path="Member" element={<Member />} />
                <Route path="Member/AddMember" element={<AddMember />} />
                <Route path="Watchmenrecord" element={<Watchmenrecord/>}/>
                <Route path="Watchmenrecord/AddWatchmen" element={<AddWatchmen/>}/>
                <Route path="SocietyMemberType" element={<SocietyMemberType />} />
                <Route path="SocietyMemberRecord" element={<SocietyMemberRecord />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute allowRole="Member"/>}>
              <Route path="/Member" element={<MemberPanel />}>
                <Route index element={<MemberDashboard />} />
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
