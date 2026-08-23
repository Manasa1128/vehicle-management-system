import { NavLink, useNavigate } from "react-router-dom";
import type React from "react";
import { useAuth } from "../hooks/useAuth";

const AppShell = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user, isAdmin, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-block">
          <span className="brand-mark">CD</span>
          <div>
            <strong>CarDeck</strong>
            <small>Inventory Suite</small>
          </div>
        </div>

        <nav className="side-nav">
          <NavLink to="/dashboard">
            <span className="nav-icon">D</span>
            Dashboard
          </NavLink>
          <NavLink to="/vehicles">
            <span className="nav-icon">V</span>
            Vehicles
          </NavLink>
          <NavLink to="/purchases">
            <span className="nav-icon">P</span>
            Purchases
          </NavLink>
          {isAdmin && (
            <NavLink to="/admin">
              <span className="nav-icon">A</span>
              Admin
            </NavLink>
          )}
          {isAdmin && (
            <NavLink to="/admin/vehicles">
              <span className="nav-icon">M</span>
              Manage Stock
            </NavLink>
          )}
        </nav>
      </aside>

      <div className="workspace">
        <header className="topbar">
          <div>
            <span className="eyebrow">Dealership operations</span>
            <h1>Vehicle Inventory System</h1>
          </div>
          <div className="user-menu">
            <div>
              <strong>{user?.name}</strong>
              <small>{user?.role}</small>
            </div>
            <button className="ghost-button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </header>

        <main className="content">{children}</main>
      </div>
    </div>
  );
};

export default AppShell;
