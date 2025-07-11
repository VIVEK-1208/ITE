import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminLayout from "./layouts/AdminLayout";
import './App.css';

function App() {
  return (
    <div className="main-wrapper">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
