import './App.css';
import { Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Details from './components/Details';
import Map from './pages/Map';
import History from './pages/History';
import Technician from './components/Technician'
import ManageSensors from './components/ManageSensors';
import AuthPage from "./pages/AuthPage.js"

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
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
