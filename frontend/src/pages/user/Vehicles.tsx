import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import type React from "react";
import { Link } from "react-router-dom";
import AppShell from "../../components/AppShell";
import { getVehicles } from "../../services/vehicle.service";
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

const Vehicles = () => {
  const { showToast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState("all");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [buyingId, setBuyingId] = useState<number | null>(null);

  const loadVehicles = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getVehicles({
        search: search || undefined,
        category: category || undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        inStock:
          inStock === "all" ? undefined : inStock === "available",
        limit: 100,
        sortBy: "price",
        sortOrder: "asc",
      });
      setVehicles(response.vehicles);
    } finally {
      setLoading(false);
    }
  }, [category, inStock, maxPrice, search]);

  useEffect(() => {
    loadVehicles();
  }, [loadVehicles]);

  const categories = useMemo(
    () =>
      Array.from(
        new Set(vehicles.map((vehicle) => vehicle.category))
      ).sort(),
    [vehicles]
  );

  const handleSearch = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    loadVehicles();
  };

  const handlePurchase = async (vehicle: Vehicle) => {
    setMessage("");
    setBuyingId(vehicle.id);
    try {
      await purchaseVehicle(vehicle.id, 1);
      const successMessage = `${vehicle.make} ${vehicle.model} purchased successfully.`;
      setMessage(successMessage);
      showToast(successMessage, "success");
      await loadVehicles();
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(
        error,
        "Purchase failed. Please try again."
      );
      setMessage(errorMessage);
      showToast(errorMessage, "error");
    } finally {
      setBuyingId(null);
    }
  };

  return (
    <AppShell>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Customer inventory</span>
          <h2>Available Vehicles</h2>
          <p>
            Search by make, model, category, or budget and purchase
            directly from live stock.
          </p>
        </div>
      </section>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search make, model, or category"
        />
        <select
          value={category}
          onChange={(event) => setCategory(event.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((item) => (
            <option value={item} key={item}>
              {item}
            </option>
          ))}
        </select>
        <input
          value={maxPrice}
          onChange={(event) => setMaxPrice(event.target.value)}
          type="number"
          min="0"
          placeholder="Max price"
        />
        <select
          value={inStock}
          onChange={(event) => setInStock(event.target.value)}
        >
          <option value="all">All stock</option>
          <option value="available">Available only</option>
          <option value="soldout">Sold out only</option>
        </select>
        <button className="primary-button">Search</button>
      </form>

      {message && <div className="notice">{message}</div>}

      {loading ? (
        <section className="vehicle-grid">
          {Array.from({ length: 6 }).map((_, index) => (
            <article className="vehicle-card skeleton-card" key={index}>
              <div className="vehicle-image skeleton-block" />
              <div className="skeleton-line short" />
              <div className="skeleton-line" />
              <div className="skeleton-line medium" />
            </article>
          ))}
        </section>
      ) : (
        <section className="vehicle-grid">
          {vehicles.map((vehicle) => {
            const visual = getVehicleVisual(vehicle);

            return (
            <article
              className={`vehicle-card ${visual.accentClass}`}
              key={vehicle.id}
            >
              <div className="vehicle-image">
                <img
                  src={visual.image}
                  alt={`${vehicle.make} ${vehicle.model}`}
                  loading="lazy"
                />
                <span className="image-badge">{visual.label}</span>
              </div>
              <div>
                <span className="pill">{vehicle.category}</span>
                <h3>
                  {vehicle.make} {vehicle.model}
                </h3>
                <p>{currency.format(vehicle.price)}</p>
              </div>
              <div className="stock-line">
                <span
                  className={
                    vehicle.quantity > 0
                      ? "stock available"
                      : "stock out"
                  }
                >
                  {vehicle.quantity > 0
                    ? `${vehicle.quantity} in stock`
                    : "Out of stock"}
                </span>
              </div>
              <div className="card-actions">
                <Link
                  className="secondary-button"
                  to={`/vehicles/${vehicle.id}`}
                >
                  Details
                </Link>
                <button
                  className="primary-button"
                  disabled={
                    vehicle.quantity === 0 || buyingId === vehicle.id
                  }
                  onClick={() => handlePurchase(vehicle)}
                >
                  {buyingId === vehicle.id ? "Buying..." : "Purchase"}
                </button>
              </div>
            </article>
            );
          })}
          {vehicles.length === 0 && (
            <div className="panel empty-state">
              No vehicles match your filters.
            </div>
          )}
        </section>
      )}
    </AppShell>
  );
};

export default Vehicles;
