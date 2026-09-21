export interface CarListing {
  id: string;
  make: string;
  model: string;
  year: number;
  price: number;
  valuation: number;
  bodyType: string;
  fuelType: string;
  imageUrl: string;
}

const API_TOKEN = 'carapi_4db62a9babaead66cfec213c9db55c96';
const API_BASE = 'https://carapi.dev/api';

const MOCK_CARS: Omit<CarListing, 'id' | 'valuation' | 'imageUrl'>[] = [
  { make: 'Toyota', model: 'Camry', year: 2024, price: 28400, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Honda', model: 'Civic', year: 2024, price: 24200, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Ford', model: 'Mustang', year: 2024, price: 32920, bodyType: 'Coupe', fuelType: 'Gasoline' },
  { make: 'Tesla', model: 'Model 3', year: 2024, price: 40630, bodyType: 'Sedan', fuelType: 'Electric' },
  { make: 'BMW', model: '330i', year: 2024, price: 44500, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Mercedes-Benz', model: 'C-Class', year: 2024, price: 47100, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Audi', model: 'A4', year: 2024, price: 41900, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Lexus', model: 'IS 350', year: 2024, price: 43300, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Toyota', model: 'RAV4', year: 2024, price: 29500, bodyType: 'SUV', fuelType: 'Gasoline' },
  { make: 'Honda', model: 'CR-V', year: 2024, price: 30450, bodyType: 'SUV', fuelType: 'Gasoline' },
  { make: 'Tesla', model: 'Model Y', year: 2024, price: 48990, bodyType: 'SUV', fuelType: 'Electric' },
  { make: 'Ford', model: 'F-150', year: 2024, price: 36770, bodyType: 'Truck', fuelType: 'Gasoline' },
  { make: 'Chevrolet', model: 'Silverado', year: 2024, price: 38700, bodyType: 'Truck', fuelType: 'Gasoline' },
  { make: 'Jeep', model: 'Grand Cherokee', year: 2024, price: 37995, bodyType: 'SUV', fuelType: 'Gasoline' },
  { make: 'Subaru', model: 'Outback', year: 2024, price: 29100, bodyType: 'SUV', fuelType: 'Gasoline' },
  { make: 'Mazda', model: 'CX-5', year: 2024, price: 29300, bodyType: 'SUV', fuelType: 'Gasoline' },
  { make: 'Hyundai', model: 'Sonata', year: 2024, price: 27250, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Kia', model: 'K5', year: 2024, price: 26500, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Volkswagen', model: 'Jetta', year: 2024, price: 22995, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Nissan', model: 'Altima', year: 2024, price: 26370, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Acura', model: 'TLX', year: 2024, price: 46500, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Genesis', model: 'G70', year: 2024, price: 41500, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Volvo', model: 'S60', year: 2024, price: 43100, bodyType: 'Sedan', fuelType: 'Gasoline' },
  { make: 'Porsche', model: 'Macan', year: 2024, price: 62900, bodyType: 'SUV', fuelType: 'Gasoline' },
];

function generateMockCars(budget: number): CarListing[] {
  const filtered = MOCK_CARS.filter((c) => c.price <= budget);
  const pool = filtered.length >= 6 ? filtered : MOCK_CARS.slice(0, 12);
  return pool.slice(0, 12).map((c, i) => ({
    ...c,
    id: `mock-${i}-${c.make}-${c.model}`,
    valuation: Math.round(c.price * 0.92),
    imageUrl: `https://images.unsplash.com/photo-1503376780353-1546113a4f34?w=400&q=80`,
  }));
}

export async function fetchGlobalCarData(budget: number): Promise<{
  cars: CarListing[];
  source: 'live' | 'mock';
  error: string | null;
}> {
  try {
    const makesRes = await fetch(`${API_BASE}/makes`, {
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        Accept: 'application/json',
      },
    });

    if (!makesRes.ok) {
      throw new Error(`CarAPI makes request failed (${makesRes.status})`);
    }

    const makesData = await makesRes.json();
    const makes: Array<{ id: number; name: string }> = makesData.data || makesData || [];
    if (!Array.isArray(makes) || makes.length === 0) {
      throw new Error('CarAPI returned no makes.');
    }

    const affordableMakes = makes.slice(0, 20);
    const cars: CarListing[] = [];

    for (const make of affordableMakes) {
      if (cars.length >= 12) break;
      try {
        const modelsRes = await fetch(
          `${API_BASE}/models?make_id=${make.id}&year=2024`,
          {
            headers: {
              Authorization: `Bearer ${API_TOKEN}`,
              Accept: 'application/json',
            },
          },
        );
        if (!modelsRes.ok) continue;
        const modelsData = await modelsRes.json();
        const models: Array<{ id: number; name: string }> = modelsData.data || modelsData || [];
        for (const model of models.slice(0, 3)) {
          if (cars.length >= 12) break;
          const estimatedPrice = estimateVehiclePrice(make.name, model.name);
          if (estimatedPrice <= budget) {
            cars.push({
              id: `live-${make.id}-${model.id}`,
              make: make.name,
              model: model.name,
              year: 2024,
              price: estimatedPrice,
              valuation: Math.round(estimatedPrice * 0.92),
              bodyType: guessBodyType(model.name),
              fuelType: 'Gasoline',
              imageUrl: `https://images.unsplash.com/photo-1503376780353-1546113a4f34?w=400&q=80`,
            });
          }
        }
      } catch {
        continue;
      }
    }

    if (cars.length === 0) {
      return { cars: generateMockCars(budget), source: 'mock', error: 'No vehicles found within budget from live API.' };
    }

    return { cars, source: 'live', error: null };
  } catch (err) {
    return {
      cars: generateMockCars(budget),
      source: 'mock',
      error: err instanceof Error ? err.message : 'CarAPI unreachable — using fallback data.',
    };
  }
}

function estimateVehiclePrice(make: string, model: string): number {
  const premiumMakes = ['BMW', 'Mercedes-Benz', 'Audi', 'Porsche', 'Lexus', 'Genesis', 'Volvo', 'Acura'];
  const base = premiumMakes.includes(make) ? 42000 : 28000;
  const modelHash = model.split('').reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
  const variance = (modelHash % 20000) - 5000;
  return Math.max(22000, base + variance);
}

function guessBodyType(model: string): string {
  const m = model.toLowerCase();
  if (m.includes('suv') || m.includes('tahoe') || m.includes('explorer')) return 'SUV';
  if (m.includes('truck') || m.includes('f-') || m.includes('silverado')) return 'Truck';
  if (m.includes('coupe') || m.includes('mustang')) return 'Coupe';
  return 'Sedan';
}
