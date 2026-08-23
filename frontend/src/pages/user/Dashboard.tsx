import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { getVehicles } from "../../services/vehicle.service";
import { getMyPurchases } from "../../services/purchase.service";
import { useAuth } from "../../hooks/useAuth";
import type { Vehicle } from "../../types/vehicle.types";
import type { Purchase } from "../../types/purchase.types";

const Dashboard = () => {
  const { isAdmin } = useAuth();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [vehicleResponse, purchaseResponse] =
          await Promise.all([
            getVehicles({ limit: 100, sortBy: "createdAt" }),
            getMyPurchases(),
          ]);

        setVehicles(vehicleResponse.vehicles);
        setPurchases(purchaseResponse);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const stats = useMemo(() => {
    const inventoryValue = vehicles.reduce(
      (total, vehicle) =>
        total + vehicle.price * vehicle.quantity,
      0
    );

    return {
      totalVehicles: vehicles.length,
      availableVehicles: vehicles.filter(
        (vehicle) => vehicle.quantity > 0
      ).length,
      stockUnits: vehicles.reduce(
        (total, vehicle) => total + vehicle.quantity,
        0
      ),
      purchases: purchases.length,
      inventoryValue,
    };
  }, [vehicles, purchases]);

  return (
    <AppShell>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Live overview</span>
          <h2>Dealership Dashboard</h2>
          <p>
            Track available inventory, purchasing activity, and
            stock value from one place.
          </p>
        </div>
        <div className="action-row">
          <Link className="primary-button" to="/vehicles">
            Browse Vehicles
          </Link>
          {isAdmin && (
            <Link className="secondary-button" to="/admin/vehicles/add">
              Add Vehicle
            </Link>
          )}
        </div>
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <span>Total Models</span>
          <strong>{loading ? "--" : stats.totalVehicles}</strong>
        </article>
        <article className="stat-card">
          <span>Available Models</span>
          <strong>{loading ? "--" : stats.availableVehicles}</strong>
        </article>
        <article className="stat-card">
          <span>Stock Units</span>
          <strong>{loading ? "--" : stats.stockUnits}</strong>
        </article>
        <article className="stat-card">
          <span>My Purchases</span>
          <strong>{loading ? "--" : stats.purchases}</strong>
        </article>
      </section>

      <section className="panel two-column">
        <div>
          <span className="eyebrow">Inventory value</span>
          <h3>
            {stats.inventoryValue.toLocaleString("en-IN", {
              style: "currency",
              currency: "INR",
              maximumFractionDigits: 0,
            })}
          </h3>
          <p>
            Calculated from live stock quantity multiplied by each
            vehicle price.
          </p>
        </div>
        <div>
          <span className="eyebrow">Recent stock</span>
          <div className="mini-list">
            {vehicles.slice(0, 4).map((vehicle) => (
              <Link to={`/vehicles/${vehicle.id}`} key={vehicle.id}>
                <span>
                  {vehicle.make} {vehicle.model}
                </span>
                <strong>{vehicle.quantity} units</strong>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </AppShell>
  );
};

export default Dashboard;
