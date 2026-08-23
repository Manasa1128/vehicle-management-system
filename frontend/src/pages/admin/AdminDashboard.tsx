import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { getVehicles } from "../../services/vehicle.service";
import type { Vehicle } from "../../types/vehicle.types";

const AdminDashboard = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);

  useEffect(() => {
    getVehicles({ limit: 100 }).then((response) =>
      setVehicles(response.vehicles)
    );
  }, []);

  const stats = useMemo(
    () => ({
      models: vehicles.length,
      lowStock: vehicles.filter(
        (vehicle) => vehicle.quantity > 0 && vehicle.quantity <= 2
      ).length,
      soldOut: vehicles.filter((vehicle) => vehicle.quantity === 0)
        .length,
      units: vehicles.reduce(
        (total, vehicle) => total + vehicle.quantity,
        0
      ),
    }),
    [vehicles]
  );

  return (
    <AppShell>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Admin command center</span>
          <h2>Inventory Control</h2>
          <p>
            Add, update, delete, and restock dealership vehicles.
          </p>
        </div>
        <div className="action-row">
          <Link className="primary-button" to="/admin/vehicles/add">
            Add Vehicle
          </Link>
          <Link className="secondary-button" to="/admin/vehicles">
            Manage Stock
          </Link>
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Vehicle Models</span>
          <strong>{stats.models}</strong>
        </article>
        <article className="stat-card">
          <span>Total Units</span>
          <strong>{stats.units}</strong>
        </article>
        <article className="stat-card">
          <span>Low Stock</span>
          <strong>{stats.lowStock}</strong>
        </article>
        <article className="stat-card">
          <span>Sold Out</span>
          <strong>{stats.soldOut}</strong>
        </article>
      </section>
    </AppShell>
  );
};

export default AdminDashboard;
