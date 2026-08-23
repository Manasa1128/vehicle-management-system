import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import ConfirmDialog from "../../components/ConfirmDialog";
import {
  deleteVehicle,
  getVehicles,
  restockVehicle,
} from "../../services/vehicle.service";
import type { Vehicle } from "../../types/vehicle.types";
import { getErrorMessage } from "../../utils/getErrorMessage";
import { useToast } from "../../hooks/useToast";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const ManageVehicles = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [restockValues, setRestockValues] = useState<
    Record<number, string>
  >({});
  const [loading, setLoading] = useState(true);
  const [vehicleToDelete, setVehicleToDelete] =
    useState<Vehicle | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadVehicles = async () => {
    setLoading(true);
    try {
      const response = await getVehicles({
        limit: 100,
        sortBy: "createdAt",
      });
      setVehicles(response.vehicles);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadVehicles();
  }, []);

  const handleDelete = async () => {
    if (!vehicleToDelete) return;

    setDeleting(true);
    try {
      await deleteVehicle(vehicleToDelete.id);
      showToast(
        `${vehicleToDelete.make} ${vehicleToDelete.model} deleted.`,
        "success"
      );
      setVehicleToDelete(null);
      await loadVehicles();
    } catch (error: unknown) {
      showToast(
        getErrorMessage(error, "Unable to delete vehicle."),
        "error"
      );
    } finally {
      setDeleting(false);
    }
  };

  const handleRestock = async (vehicle: Vehicle) => {
    const quantity = Number(restockValues[vehicle.id] || 0);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      showToast("Enter a positive restock quantity.", "error");
      return;
    }

    try {
      await restockVehicle(vehicle.id, quantity);
      showToast(
        `${vehicle.make} ${vehicle.model} restocked successfully.`,
        "success"
      );
      setRestockValues((current) => ({
        ...current,
        [vehicle.id]: "",
      }));
      await loadVehicles();
    } catch (error: unknown) {
      showToast(
        getErrorMessage(
          error,
          "Restock failed. Please try again."
        ),
        "error"
      );
    }
  };

  return (
    <AppShell>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Admin inventory</span>
          <h2>Manage Vehicles</h2>
          <p>Update listings, restock inventory, or remove models.</p>
        </div>
        <Link className="primary-button" to="/admin/vehicles/add">
          Add Vehicle
        </Link>
      </section>

      <section className="panel">
        {loading ? (
          <p>Loading vehicles...</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Restock</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vehicles.map((vehicle) => (
                  <tr key={vehicle.id}>
                    <td>
                      {vehicle.make} {vehicle.model}
                    </td>
                    <td>{vehicle.category}</td>
                    <td>{currency.format(vehicle.price)}</td>
                    <td>{vehicle.quantity}</td>
                    <td>
                      <div className="inline-control">
                        <input
                          type="number"
                          min="1"
                          value={restockValues[vehicle.id] || ""}
                          onChange={(event) =>
                            setRestockValues((current) => ({
                              ...current,
                              [vehicle.id]: event.target.value,
                            }))
                          }
                          placeholder="Qty"
                        />
                        <button
                          className="secondary-button"
                          onClick={() => handleRestock(vehicle)}
                        >
                          Restock
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="table-actions">
                        <Link
                          className="secondary-button"
                          to={`/admin/vehicles/edit/${vehicle.id}`}
                        >
                          Edit
                        </Link>
                        <button
                          className="danger-button"
                          onClick={() => setVehicleToDelete(vehicle)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <ConfirmDialog
        open={Boolean(vehicleToDelete)}
        title="Delete vehicle?"
        message={
          vehicleToDelete
            ? `This will permanently remove ${vehicleToDelete.make} ${vehicleToDelete.model} from inventory.`
            : ""
        }
        confirmLabel="Delete Vehicle"
        loading={deleting}
        onCancel={() => setVehicleToDelete(null)}
        onConfirm={handleDelete}
      />
    </AppShell>
  );
};

export default ManageVehicles;
