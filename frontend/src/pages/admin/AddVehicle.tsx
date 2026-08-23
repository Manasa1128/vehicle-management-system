import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppShell from "../../components/AppShell";
import VehicleForm from "../../components/VehicleForm";
import { createVehicle } from "../../services/vehicle.service";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useToast } from "../../hooks/useToast";

const AddVehicle = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (data: {
    make: string;
    model: string;
    category: string;
    price: number;
    quantity: number;
  }) => {
    setSaving(true);
    setError("");
    try {
      await createVehicle(data);
      showToast("Vehicle created successfully.", "success");
      navigate("/admin/vehicles");
    } catch (error: unknown) {
      const message = getErrorMessage(
        error,
        "Unable to create vehicle."
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
          <h2>Add Vehicle</h2>
          <p>Create a new dealership inventory item.</p>
        </div>
        <Link className="secondary-button" to="/admin/vehicles">
          Back
        </Link>
      </section>

      {error && <div className="error-message">{error}</div>}

      <VehicleForm
        submitLabel="Create Vehicle"
        saving={saving}
        onSubmit={handleSubmit}
      />
    </AppShell>
  );
};

export default AddVehicle;
