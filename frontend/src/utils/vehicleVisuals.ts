import type { Vehicle } from "../types/vehicle.types";

const categoryImages: Record<string, string> = {
  suv: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
  sedan: "https://images.unsplash.com/photo-1494905998402-395d579af36f?auto=format&fit=crop&w=900&q=80",
  hatchback: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80",
  truck: "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=900&q=80",
  coupe: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=80",
  luxury: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
  electric: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=900&q=80",
};

const categoryAccent: Record<string, string> = {
  suv: "accent-blue",
  sedan: "accent-amber",
  hatchback: "accent-green",
  truck: "accent-slate",
  coupe: "accent-red",
  luxury: "accent-violet",
  electric: "accent-cyan",
};

const categoryLabel: Record<string, string> = {
  suv: "All-terrain comfort",
  sedan: "City-ready drive",
  hatchback: "Compact utility",
  truck: "Heavy-duty power",
  coupe: "Performance line",
  luxury: "Premium collection",
  electric: "Electric mobility",
};

export const getVehicleVisual = (vehicle: Vehicle) => {
  const category = vehicle.category.toLowerCase();

  return {
    image:
      categoryImages[category] ||
      "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80",
    accentClass: categoryAccent[category] || "accent-blue",
    label: categoryLabel[category] || "Featured model",
  };
};
