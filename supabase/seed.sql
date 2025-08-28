-- Seed data pentru AutoOrder MVP
-- Rulează acest script după aplicarea migrărilor

-- Adaugă vehicule de test
INSERT INTO public.vehicles (
  make, model, year, km, fuel, transmission, price_est, 
  badges, images, source, featured, featured_position
) VALUES 
(
  'BMW', 'X5', 2020, 85000, 'diesel', 'automata', 45000,
  ARRAY['Fără accidente', 'Istoric complet'],
  ARRAY['https://res.cloudinary.com/demo/image/upload/v1/samples/car.jpg'],
  'https://example.com/bmw-x5',
  true, 1
),
(
  'Audi', 'A4', 2019, 65000, 'benzina', 'automata', 28000,
  ARRAY['Fără accidente'],
  ARRAY['https://res.cloudinary.com/demo/image/upload/v1/samples/car.jpg'],
  'https://example.com/audi-a4',
  true, 2
),
(
  'Mercedes', 'C-Class', 2021, 45000, 'diesel', 'automata', 38000,
  ARRAY['Fără accidente', 'Istoric complet', 'Primul proprietar'],
  ARRAY['https://res.cloudinary.com/demo/image/upload/v1/samples/car.jpg'],
  'https://example.com/mercedes-c-class',
  true, 3
),
(
  'Volkswagen', 'Golf', 2018, 95000, 'diesel', 'manuala', 18000,
  ARRAY['Fără accidente'],
  ARRAY['https://res.cloudinary.com/demo/image/upload/v1/samples/car.jpg'],
  'https://example.com/vw-golf',
  false, 0
),
(
  'Skoda', 'Octavia', 2020, 75000, 'benzina', 'automata', 22000,
  ARRAY['Fără accidente'],
  ARRAY['https://res.cloudinary.com/demo/image/upload/v1/samples/car.jpg'],
  'https://example.com/skoda-octavia',
  false, 0
);

-- Adaugă lead-uri de test
INSERT INTO public.leads (
  marca_model, buget, contact, extra, status
) VALUES 
(
  'BMW X5 sau Mercedes GLE',
  '40000-50000 EUR',
  'client1@example.com',
  '{"km_max": 100000, "an_min": 2019, "combustibil": "diesel"}',
  'new'
),
(
  'Audi A4/A6',
  '25000-35000 EUR',
  '+40712345678',
  '{"km_max": 80000, "an_min": 2018, "transmisie": "automata"}',
  'qualified'
),
(
  'Volkswagen Golf sau Skoda Octavia',
  '15000-25000 EUR',
  'client3@example.com',
  '{"km_max": 120000, "an_min": 2017}',
  'quoted'
);
