import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { getVehicleById } from "../../services/vehicle.service";
import { purchaseVehicle } from "../../services/purchase.service";
import type { Vehicle } from "../../types/vehicle.types";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { getVehicleVisual } from "../../utils/vehicleVisuals";
import { useToast } from "../../hooks/useToast";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const VehicleDetails = () => {
  const { id } = useParams();
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const loadVehicle = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      setVehicle(await getVehicleById(Number(id)));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    loadVehicle();
  }, [loadVehicle]);

  const handlePurchase = async () => {
    if (!vehicle) return;

    setSaving(true);
    setMessage("");
    try {
      await purchaseVehicle(vehicle.id, quantity);
      const successMessage = "Purchase completed successfully.";
      setMessage(successMessage);
      showToast(successMessage, "success");
      await loadVehicle();
      setQuantity(1);
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Purchase failed. Please try again."
      );
      setMessage(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Vehicle profile</span>
          <h2>
            {vehicle
              ? `${vehicle.make} ${vehicle.model}`
              : "Vehicle Details"}
          </h2>
          <p>Review price, stock, and purchase quantity.</p>
        </div>
        <Link className="secondary-button" to="/vehicles">
          Back to Vehicles
        </Link>
      </section>

      {loading && <div className="panel">Loading vehicle...</div>}

      {!loading && vehicle && (() => {
        const visual = getVehicleVisual(vehicle);

        return (
        <section className="panel detail-layout">
          <div className={`vehicle-hero ${visual.accentClass}`}>
            <img
              src={visual.image}
              alt={`${vehicle.make} ${vehicle.model}`}
            />
            <div className="vehicle-hero-content">
            <span className="pill">{vehicle.category}</span>
            <small>{visual.label}</small>
            <h3>
              {vehicle.make} {vehicle.model}
            </h3>
            <strong>{currency.format(vehicle.price)}</strong>
            </div>
          </div>

          <div className="detail-list">
            <div>
              <span>Vehicle ID</span>
              <strong>#{vehicle.id}</strong>
            </div>
            <div>
              <span>Stock Quantity</span>
              <strong>{vehicle.quantity}</strong>
            </div>
            <div>
              <span>Status</span>
              <strong>
                {vehicle.quantity > 0 ? "Available" : "Out of stock"}
              </strong>
            </div>
          </div>

          <div className="purchase-box">
            <label>
              Purchase Quantity
              <input
                type="number"
                min="1"
                max={Math.max(vehicle.quantity, 1)}
                value={quantity}
                onChange={(event) =>
                  setQuantity(Number(event.target.value))
                }
              />
            </label>
            <button
              className="primary-button"
              disabled={vehicle.quantity === 0 || saving}
              onClick={handlePurchase}
            >
              {saving ? "Processing..." : "Purchase Vehicle"}
            </button>
          </div>

          {message && <div className="notice">{message}</div>}
        </section>
        );
      })()}
    </AppShell>
  );
};

export default VehicleDetails;
