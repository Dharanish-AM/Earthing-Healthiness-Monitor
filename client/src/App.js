import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Details from './components/Details';
import Map from './pages/Map';
import History from './pages/History';
import Technician from './components/Technician'
import ManageSensors from './components/ManageSensors';
import AuthPage from "./pages/AuthPage.js"
import Admin from "./pages/Admin.js"

function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="home/details" element={<Details />} />
      <Route path="/map" element={<Map />} />
      <Route path="/history" element={<History />} />
      <Route path="home/manage-technicians" element={<Technician />} />
      <Route path="home/manage-sensors" element={<ManageSensors />} />
    </Routes>
  );
}

export default App;
