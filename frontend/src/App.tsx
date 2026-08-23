import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

import Dashboard from "./pages/user/Dashboard";
import Vehicles from "./pages/user/Vehicles";
import VehicleDetails from "./pages/user/VehicleDetails";
import Purchases from "./pages/user/Purchases";

import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageVehicles from "./pages/admin/ManageVehicles";
import AddVehicle from "./pages/admin/AddVehicle";
import EditVehicle from "./pages/admin/EditVehicle";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC ==================== */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />


        {/* ==================== USER ==================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            path="/vehicles"
            element={<Vehicles />}
          />

          <Route
            path="/vehicles/:id"
            element={<VehicleDetails />}
          />

          <Route
            path="/purchases"
            element={<Purchases />}
          />

        </Route>


        {/* ==================== ADMIN ==================== */}

        <Route element={<AdminRoute />}>

          <Route
            path="/admin"
            element={<AdminDashboard />}
          />

          <Route
            path="/admin/vehicles"
            element={<ManageVehicles />}
          />

          <Route
            path="/admin/vehicles/add"
            element={<AddVehicle />}
          />

          <Route
            path="/admin/vehicles/edit/:id"
            element={<EditVehicle />}
          />

        </Route>


        {/* ==================== DEFAULT ==================== */}

        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="*" element={<Navigate to="/dashboard" replace />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
