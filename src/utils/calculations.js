/**
 * Automotive and Fuel Calculations Utility for AutoCare Hub
 */

/**
 * Calculate single trip fuel consumption and cost
 */
export function calculateTripCost({ distance, mileage, fuelPrice, tripsCount = 1, isReturnTrip = false }) {
  const d = Number(distance) || 0;
  const m = Number(mileage) || 0;
  const p = Number(fuelPrice) || 0;
  const multiplier = (isReturnTrip ? 2 : 1) * (Number(tripsCount) || 1);

  if (d <= 0 || m <= 0 || p <= 0) {
    return {
      distance: d * multiplier,
      fuelRequired: 0,
      estimatedCost: 0,
      costPerKm: 0,
      isValid: false,
      breakdown: 'Enter valid positive values for distance, mileage, and fuel price.'
    };
  }

  const effectiveDistance = d * multiplier;
  const fuelRequired = effectiveDistance / m;
  const estimatedCost = fuelRequired * p;
  const costPerKm = p / m;

  return {
    distance: effectiveDistance,
    fuelRequired: Number(fuelRequired.toFixed(2)),
    estimatedCost: Math.round(estimatedCost),
    costPerKm: Number(costPerKm.toFixed(2)),
    singleTripCost: Math.round((d / m) * p),
    singleTripFuel: Number((d / m).toFixed(2)),
    multiplier,
    isValid: true,
    breakdown: `${effectiveDistance} km ÷ ${m} km/L = ${fuelRequired.toFixed(2)} L × ₹${p}/L = ₹${Math.round(estimatedCost).toLocaleString('en-IN')}`
  };
}

/**
 * Compare two vehicles for a trip and for monthly commute
 */
export function compareVehiclesSavings({
  vehicleAMileage,
  vehicleBMileage,
  tripDistance,
  fuelPrice,
  tripsPerMonth = 30
}) {
  const vA = calculateTripCost({
    distance: tripDistance,
    mileage: vehicleAMileage,
    fuelPrice,
    tripsCount: 1
  });

  const vB = calculateTripCost({
    distance: tripDistance,
    mileage: vehicleBMileage,
    fuelPrice,
    tripsCount: 1
  });

  const monthlyA = Math.round(vA.estimatedCost * tripsPerMonth);
  const monthlyB = Math.round(vB.estimatedCost * tripsPerMonth);
  const monthlyDifference = Math.abs(monthlyA - monthlyB);
  const annualDifference = monthlyDifference * 12;

  let moreEfficient = null;
  if (vA.costPerKm < vB.costPerKm) {
    moreEfficient = 'A';
  } else if (vB.costPerKm < vA.costPerKm) {
    moreEfficient = 'B';
  }

  return {
    vehicleA: {
      ...vA,
      monthlyCost: monthlyA,
      annualCost: monthlyA * 12
    },
    vehicleB: {
      ...vB,
      monthlyCost: monthlyB,
      annualCost: monthlyB * 12
    },
    monthlyDifference,
    annualDifference,
    moreEfficient,
    tripsPerMonth
  };
}

/**
 * Aggregate expenses by Month for charts
 */
export function getMonthlyExpenseTrends(expenses) {
  if (!Array.isArray(expenses) || expenses.length === 0) return [];

  // Group by 'YYYY-MM'
  const monthMap = {};
  expenses.forEach(exp => {
    if (!exp.date) return;
    const monthKey = exp.date.slice(0, 7); // e.g., '2026-10'
    const amt = Number(exp.amount) || 0;
    monthMap[monthKey] = (monthMap[monthKey] || 0) + amt;
  });

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  // Sort chronologically
  return Object.keys(monthMap)
    .sort()
    .map(key => {
      const [year, month] = key.split('-');
      const label = `${monthNames[parseInt(month, 10) - 1]} ${year.slice(2)}`;
      return {
        key,
        label,
        total: monthMap[key]
      };
    });
}

/**
 * Aggregate expenses by Category for charts
 */
export function getCategoryExpenseBreakdown(expenses) {
  if (!Array.isArray(expenses) || expenses.length === 0) return [];

  const categoryMap = {};
  let total = 0;

  expenses.forEach(exp => {
    const cat = exp.category || 'Other';
    const amt = Number(exp.amount) || 0;
    categoryMap[cat] = (categoryMap[cat] || 0) + amt;
    total += amt;
  });

  const colors = {
    'Fuel': '#06B6D4',
    'Servicing': '#3B82F6',
    'Repairs': '#F59E0B',
    'Insurance': '#8B5CF6',
    'Tyres': '#10B981',
    'Washing': '#EC4899',
    'Parking': '#64748B',
    'Other': '#94A3B8'
  };

  return Object.keys(categoryMap).map(category => ({
    name: category,
    value: categoryMap[category],
    percentage: total > 0 ? Math.round((categoryMap[category] / total) * 100) : 0,
    color: colors[category] || '#64748B'
  })).sort((a, b) => b.value - a.value);
}
