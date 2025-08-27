export const fmtPrice = (n?: number) => 
  new Intl.NumberFormat("ro-RO", {
    style: "currency", 
    currency: "EUR", 
    maximumFractionDigits: 0
  }).format(n ?? 0);

export const fmtKm = (n?: number) => 
  `${new Intl.NumberFormat("ro-RO").format(n ?? 0)} km`;

export const mapFuel = (s?: string) => {
  const fuelMap = {
    Benzina: "Benzină",
    Diesel: "Diesel", 
    Hybrid: "Hybrid",
    Electric: "Electric"
  } as const;
  return fuelMap[s as keyof typeof fuelMap] ?? s ?? "-";
};

export const mapGear = (s?: string) => {
  const gearMap = {
    Automata: "Automată",
    Manuala: "Manuală"
  } as const;
  return gearMap[s as keyof typeof gearMap] ?? s ?? "-";
};

export const mapBody = (s?: string) => {
  const bodyMap = {
    SUV: "SUV",
    Sedan: "Sedan", 
    Hatchback: "Hatchback",
    Break: "Break",
    Coupe: "Coupé",
    MPV: "MPV",
    Pickup: "Pick-up",
    Alt: "Alt tip"
  } as const;
  return bodyMap[s as keyof typeof bodyMap] ?? s ?? "-";
};
