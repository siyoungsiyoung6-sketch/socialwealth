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

function generateMockCars(budget: number, makeQuery?: string, modelQuery?: string): CarListing[] {
  let pool = MOCK_CARS;
  if (makeQuery) {
    pool = pool.filter((c) => c.make.toLowerCase().includes(makeQuery.toLowerCase()));
  }
  if (modelQuery) {
    pool = pool.filter((c) => c.model.toLowerCase().includes(modelQuery.toLowerCase()));
  }
  const inBudget = pool.filter((c) => c.price <= budget);
  const final = inBudget.length >= 3 ? inBudget : pool.slice(0, 12);
  return final.slice(0, 12).map((c, i) => ({
    ...c,
    id: `mock-${i}-${c.make}-${c.model}`,
    valuation: Math.round(c.price * 0.92),
    imageUrl: '',
  }));
}

export interface CarSearchParams {
  budget: number;
  make?: string;
  model?: string;
  year?: number;
}

export async function fetchGlobalCarData(params: CarSearchParams): Promise<{
  cars: CarListing[];
  source: 'live' | 'mock';
  error: string | null;
}> {
  const { budget, make, model, year } = params;

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

    let targetMakes = makes;
    if (make) {
      const filtered = makes.filter((m) => m.name.toLowerCase().includes(make.toLowerCase()));
      targetMakes = filtered.length > 0 ? filtered : makes.slice(0, 20);
    } else {
      targetMakes = makes.slice(0, 20);
    }

    const cars: CarListing[] = [];
    const searchYear = year || 2024;

    for (const mk of targetMakes) {
      if (cars.length >= 12) break;
      try {
        const modelsRes = await fetch(
          `${API_BASE}/models?make_id=${mk.id}&year=${searchYear}`,
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

        const filteredModels = model
          ? models.filter((m) => m.name.toLowerCase().includes(model.toLowerCase()))
          : models;

        for (const mdl of filteredModels.slice(0, 5)) {
          if (cars.length >= 12) break;
          const estimatedPrice = estimateVehiclePrice(mk.name, mdl.name);
          if (budget > 0 && estimatedPrice > budget) continue;
          cars.push({
            id: `live-${mk.id}-${mdl.id}`,
            make: mk.name,
            model: mdl.name,
            year: searchYear,
            price: estimatedPrice,
            valuation: Math.round(estimatedPrice * 0.92),
            bodyType: guessBodyType(mdl.name),
            fuelType: guessFuelType(mk.name, mdl.name),
            imageUrl: '',
          });
        }
      } catch {
        continue;
      }
    }

    if (cars.length === 0) {
      return {
        cars: generateMockCars(budget || 100000, make, model),
        source: 'mock',
        error: 'No vehicles found matching your criteria from live API.',
      };
    }

    return { cars, source: 'live', error: null };
  } catch (err) {
    return {
      cars: generateMockCars(budget || 100000, make, model),
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
  if (m.includes('suv') || m.includes('tahoe') || m.includes('explorer') || m.includes('rav4') || m.includes('cr-v') || m.includes('cx-')) return 'SUV';
  if (m.includes('truck') || m.includes('f-') || m.includes('silverado')) return 'Truck';
  if (m.includes('coupe') || m.includes('mustang')) return 'Coupe';
  return 'Sedan';
}

function guessFuelType(make: string, model: string): string {
  if (make === 'Tesla' || model.toLowerCase().includes('ev') || model.toLowerCase().includes('electric')) return 'Electric';
  if (model.toLowerCase().includes('hybrid')) return 'Hybrid';
  if (model.toLowerCase().includes('diesel')) return 'Diesel';
  return 'Gasoline';
}
