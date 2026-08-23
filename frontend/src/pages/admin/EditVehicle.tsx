import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import AppShell from "../../components/AppShell";
import VehicleForm from "../../components/VehicleForm";
import {
  getVehicleById,
  updateVehicle,
} from "../../services/vehicle.service";
import type { Vehicle } from "../../types/vehicle.types";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useToast } from "../../hooks/useToast";

const EditVehicle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;

    getVehicleById(Number(id))
      .then(setVehicle)
      .catch(() => setError("Vehicle not found."));
  }, [id]);

  const handleSubmit = async (data: {
    make: string;
    model: string;
    category: string;
    price: number;
    quantity: number;
  }) => {
    if (!id) return;

    setSaving(true);
    setError("");
    try {
      await updateVehicle(Number(id), data);
      showToast("Vehicle updated successfully.", "success");
      navigate("/admin/vehicles");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to update vehicle."
      );
      setError(message);
      showToast(message, "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Admin inventory</span>
          <h2>Edit Vehicle</h2>
          <p>Update pricing, category, or stock quantity.</p>
        </div>
        <Link className="secondary-button" to="/admin/vehicles">
          Back
        </Link>
      </section>

      {error && <div className="error-message">{error}</div>}

      {vehicle ? (
        <VehicleForm
          key={vehicle.id}
          initialValue={vehicle}
          submitLabel="Save Changes"
          saving={saving}
          onSubmit={handleSubmit}
        />
      ) : (
        <div className="panel">Loading vehicle...</div>
      )}
    </AppShell>
  );
};

export default EditVehicle;
