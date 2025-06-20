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
import Member from "./Admin/Pages/Member";
import PrivateRoute from "./MainPage/PrivateRoute";
import AuthProvider from "./MainPage/AuthProvider"; // <-- NEW
import AddMember from "./Admin/Pages/AddMember";
import ViewMember from "./Admin/Pages/ViewMember";
import UpdateWatchmen from "./Admin/Pages/UpdateWatchmen";
import Watchmenrecord from "./Admin/Pages/watchmenrecord"
import AddWatchmen from "./Admin/Pages/AddWatchmen";
import Agency from "./Admin/Pages/Agency";
import Visiter from "./Admin/Pages/Visiter";
import Expenses from "./Admin/Pages/Expenses";
import Complain from "./Admin/Pages/Complain";
import AllComplain from "./Admin/Pages/AllComplain";
import Suggestion from "./Admin/Pages/Suggestion";
import AddSuggestion from "./Admin/Pages/AddSuggestion";
import SuggestionDetail from "./Admin/Pages/SuggestionDetail";
import Maintenance from "./Admin/Pages/Maintenance";
import MemberSuggestion from "./Member/Pages/Suggestion";
import MemberAddSuggestion from "./Member/Pages/AddSuggestion";
import MemberSuggestionDetail from "./Member/Pages/SuggestionDetail";
import MemberVisiter from "../src/Member/Pages/Visiter";
import MemberAgency from "../src/Member/Pages/Agency";
import MemberExpenses from "../src/Member/Pages/Expenses";
import MemberComplain from "../src/Member/Pages/Complain";
import MemberComplainDetail from "../src/Member/Pages/ComplainDetail";
import MemberMaintenance from "../src/Member/Pages/Maintenance";
import MemberMaintenanceDetail from "../src/Member/Pages/MaintenanceDetail";
import Profile from "./Member/Pages/Profile";

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
                <Route path="ViewMember/:id" element={<ViewMember />} />
                <Route path="Watchmenrecord" element={<Watchmenrecord />} />
                <Route path="Watchmenrecord/AddWatchmen" element={<AddWatchmen />} />
                <Route path="UpdateWatchmen/:id" element={<UpdateWatchmen />} />
                <Route path="Suggestion" element={<Suggestion />} />
                <Route path="SuggestionDetail/:id" element={<SuggestionDetail />} />
                <Route path="AddSuggestion" element={<AddSuggestion />} />
                <Route path="Maintenance" element={<Maintenance />} />
                <Route path="Complain" element={<Complain />} />
                <Route path="AllComplain" element={<AllComplain />} />
                <Route path="Expenses" element={<Expenses />} />
                <Route path="Agency" element={<Agency />} />
                <Route path="Visiter" element={<Visiter />} />
              </Route>
            </Route>

            <Route element={<PrivateRoute allowRole="Member" />}>
              <Route path="/Member" element={<MemberPanel />}>
                <Route index element={<MemberDashboard />} />
                <Route path="Maintenance" element={<MemberMaintenance/>}/>
                <Route path="MaintenanceDetail/:id" element={<MemberMaintenanceDetail/>} />
                <Route path="Suggestion" element={<MemberSuggestion />} />
                <Route path="SuggestionDetail/:id" element={<MemberSuggestionDetail />} />
                <Route path="AddSuggestion" element={<MemberAddSuggestion />} />
                <Route path="Complain" element={<MemberComplain />} />
                <Route path="ComplainDetail/:id" element={<MemberComplainDetail />} />
                <Route path="Expenses" element={<MemberExpenses />} />
                <Route path="Agency" element={<MemberAgency />} />
                <Route path="Visiter" element={<MemberVisiter />} />
                <Route path="Profile" element={<Profile /> }/>
              </Route>
            </Route>
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;
