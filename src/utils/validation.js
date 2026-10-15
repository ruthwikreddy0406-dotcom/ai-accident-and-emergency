/**
 * Form and input validation helpers for AutoCare Hub
 */

export function validateVehicle(formData) {
  const errors = {};

  if (!formData.model || !formData.model.trim()) {
    errors.model = 'Vehicle model is required (e.g. City ZX, Nexon, Swift).';
  }

  if (!formData.manufacturer || !formData.manufacturer.trim()) {
    errors.manufacturer = 'Manufacturer is required (e.g. Honda, Tata, Hyundai).';
  }

  const currentYear = new Date().getFullYear();
  const year = Number(formData.year);
  if (!year || isNaN(year) || year < 1980 || year > currentYear + 1) {
    errors.year = `Manufacturing year must be between 1980 and ${currentYear + 1}.`;
  }

  const odo = Number(formData.currentOdometer);
  if (formData.currentOdometer !== '' && (isNaN(odo) || odo < 0)) {
    errors.currentOdometer = 'Odometer reading must be 0 or higher.';
  }

  const mileage = Number(formData.averageMileage);
  if (!mileage || isNaN(mileage) || mileage <= 0 || mileage > 80) {
    errors.averageMileage = 'Average mileage must be greater than 0 and realistic (e.g., 12 to 35 km/L).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateMaintenance(formData) {
  const errors = {};

  if (!formData.title || !formData.title.trim()) {
    errors.title = 'Task title is required (e.g. Oil change, Brake inspection).';
  }

  if (!formData.vehicleId) {
    errors.vehicleId = 'Please select a vehicle.';
  }

  if (!formData.category) {
    errors.category = 'Please select a maintenance category.';
  }

  const cost = Number(formData.estimatedCost);
  if (formData.estimatedCost !== '' && (isNaN(cost) || cost < 0)) {
    errors.estimatedCost = 'Estimated cost must be 0 or greater.';
  }

  const nextOdo = Number(formData.nextServiceOdometer);
  if (formData.nextServiceOdometer !== '' && (isNaN(nextOdo) || nextOdo < 0)) {
    errors.nextServiceOdometer = 'Next service odometer must be positive.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateExpense(formData) {
  const errors = {};

  if (!formData.vehicleId) {
    errors.vehicleId = 'Please select a vehicle.';
  }

  if (!formData.category) {
    errors.category = 'Please select an expense category.';
  }

  const amt = Number(formData.amount);
  if (!amt || isNaN(amt) || amt <= 0) {
    errors.amount = 'Please enter a valid expense amount greater than ₹0.';
  }

  if (!formData.date) {
    errors.date = 'Transaction date is required.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
