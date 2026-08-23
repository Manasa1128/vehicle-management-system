import { useState } from "react";
import type React from "react";

const emptyForm = {
  make: "",
  model: "",
  category: "SUV",
  price: "",
  quantity: "",
};

const categories = [
  "SUV",
  "Sedan",
  "Hatchback",
  "Truck",
  "Coupe",
  "Luxury",
  "Electric",
];

const toFormValue = (
  initialValue?: VehicleFormInitialValue
) => ({
  make: initialValue?.make || "",
  model: initialValue?.model || "",
  category: initialValue?.category || "SUV",
  price:
    initialValue?.price === undefined
      ? ""
      : String(initialValue.price),
  quantity:
    initialValue?.quantity === undefined
      ? ""
      : String(initialValue.quantity),
});

type VehicleFormInitialValue = {
  make?: string;
  model?: string;
  category?: string;
  price?: string | number;
  quantity?: string | number;
};

const VehicleForm = ({
  initialValue,
  submitLabel,
  saving,
  onSubmit,
}: {
  initialValue?: VehicleFormInitialValue;
  submitLabel: string;
  saving: boolean;
  onSubmit: (data: {
    make: string;
    model: string;
    category: string;
    price: number;
    quantity: number;
  }) => Promise<void>;
}) => {
  const [form, setForm] = useState(() =>
    initialValue ? toFormValue(initialValue) : emptyForm
  );

  const updateField = (
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLSelectElement>
  ) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    await onSubmit({
      make: form.make.trim(),
      model: form.model.trim(),
      category: form.category,
      price: Number(form.price),
      quantity: Number(form.quantity),
    });
  };

  return (
    <form className="panel form-grid" onSubmit={handleSubmit}>
      <label>
        Make
        <input
          name="make"
          value={form.make}
          onChange={updateField}
          placeholder="Toyota"
          required
        />
      </label>

      <label>
        Model
        <input
          name="model"
          value={form.model}
          onChange={updateField}
          placeholder="Fortuner"
          required
        />
      </label>

      <label>
        Category
        <select
          name="category"
          value={form.category}
          onChange={updateField}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </label>

      <label>
        Price
        <input
          name="price"
          value={form.price}
          onChange={updateField}
          min="1"
          type="number"
          placeholder="3500000"
          required
        />
      </label>

      <label>
        Stock Quantity
        <input
          name="quantity"
          value={form.quantity}
          onChange={updateField}
          min="0"
          step="1"
          type="number"
          placeholder="5"
          required
        />
      </label>

      <div className="form-actions">
        <button className="primary-button" disabled={saving}>
          {saving ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
};

export default VehicleForm;
