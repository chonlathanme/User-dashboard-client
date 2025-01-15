import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserTable from './components/User/UserTable';
import Login from './components/Auth/Login';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/users" 
          element={
            <ProtectedRoute>
              <UserTable />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
