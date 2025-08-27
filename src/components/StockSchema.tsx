import { ApiVehicle } from '@/types/vehicle';

interface StockSchemaProps {
  vehicles: ApiVehicle[];
  currentPage: number;
  totalPages: number;
}

export function StockSchema({ vehicles, currentPage, totalPages }: StockSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Explorare oportunități - AutoOrder",
    "description": "Găsește mașina dorită din licitații B2B europene (Buy Now & Licitație). Filtrează după marcă, model, an, preț și altele.",
    "numberOfItems": vehicles.length,
    "itemListElement": vehicles.map((vehicle, index) => ({
      "@type": "ListItem",
      "position": (currentPage - 1) * 12 + index + 1,
      "item": {
        "@type": "Product",
        "name": `${vehicle.brand} ${vehicle.model} ${vehicle.year}`,
        "description": vehicle.description,
        "brand": {
          "@type": "Brand",
          "name": vehicle.brand
        },
        "model": vehicle.model,
        "vehicleModelDate": vehicle.year.toString(),
        "mileageFromOdometer": {
          "@type": "QuantitativeValue",
          "value": vehicle.km,
          "unitCode": "SMI"
        },
        "fuelType": vehicle.fuel,
        "vehicleTransmission": vehicle.gearbox,
        "vehicleBodyType": vehicle.body,
        "offers": {
          "@type": "Offer",
          "priceCurrency": "EUR",
          "price": vehicle.price.toString(),
          "url": `https://autoorder.ro/stock/${vehicle.id}`,
          "availability": vehicle.type === 'BUY_NOW' ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
          "seller": {
            "@type": "Organization",
            "name": "AutoOrder"
          }
        },
        "image": vehicle.image || undefined,
        "url": `https://autoorder.ro/stock/${vehicle.id}`
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
