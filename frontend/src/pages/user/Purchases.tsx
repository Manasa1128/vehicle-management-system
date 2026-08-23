import { useEffect, useState } from "react";
import AppShell from "../../components/AppShell";
import { getMyPurchases } from "../../services/purchase.service";
import type { Purchase } from "../../types/purchase.types";

const currency = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const Purchases = () => {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPurchases = async () => {
      try {
        setPurchases(await getMyPurchases());
      } finally {
        setLoading(false);
      }
    };

    loadPurchases();
  }, []);

  return (
    <AppShell>
      <section className="page-heading">
        <div>
          <span className="eyebrow">Order history</span>
          <h2>My Purchases</h2>
          <p>Every completed vehicle purchase from your account.</p>
        </div>
      </section>

      <section className="panel">
        {loading ? (
          <p>Loading purchases...</p>
        ) : purchases.length === 0 ? (
          <p className="empty-state">No purchases yet.</p>
        ) : (
          <div className="responsive-table">
            <table>
              <thead>
                <tr>
                  <th>Vehicle</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Purchased On</th>
                </tr>
              </thead>
              <tbody>
                {purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td>
                      {purchase.vehicle?.make}{" "}
                      {purchase.vehicle?.model}
                    </td>
                    <td>{purchase.quantity}</td>
                    <td>{currency.format(purchase.totalPrice)}</td>
                    <td>
                      {new Date(
                        purchase.createdAt
                      ).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </AppShell>
  );
};

export default Purchases;
