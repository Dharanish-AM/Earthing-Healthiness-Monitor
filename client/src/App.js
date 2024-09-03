import "./App.css";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Details from "./pages/Details.js";
import Map from "./pages/Map";
import History from "./pages/History";
import ManageTechnicians from "./components/ManageTechnicians";
import AuthPage from "./pages/AuthPage.js";
import Admin from "./pages/Admin.js";

function App() {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/login" element={<AuthPage />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/dashboard/poles" element={<Details />} />
      <Route path="/map" element={<Map />} />
      <Route path="/history" element={<History />} />
      <Route path="/dashboard/technicians" element={<ManageTechnicians />} />
    </Routes>
  );
}

export default App;
