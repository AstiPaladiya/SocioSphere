import './App.css';
import { BrowserRouter as Router,Route,Routes } from 'react-router-dom';        
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import Login from './MainPages/Login';
import AdminPanel from './Admin/AdminPanel';
import MemberDashboard from './Member/Pages/MemberDashboard';
import AdminDashboard from './Admin/Pages/AdminDashboard';
import CommitteType from './Admin/Pages/CommitteType';


function App() {
  return (
   <>
      <AuthProvider>
        <Router>
            <Routes>
              <Route path="/" element={<Login/>}/>
            </Routes>
            {/* Admin Routes */}
            <Route path="/admin" element={<PrivateRoute element={<AdminPanel/>} role="Admin" />}>
                <Route index path="admin/dahboard"  element={<AdminDashboard/>}/>
                <Route  element={<CommitteType/>}/>

            </Route>
            {/* Member Routes */}
            <Route path="/member" element={<PrivateRoute element={<MemberPanel/>} role="Member" />}>
                <Route index path="member/dahboard" element={<MemberDashboard/>}/>
            </Route>
        </Router>
      </AuthProvider>
   </>
  );
}

export default App;
