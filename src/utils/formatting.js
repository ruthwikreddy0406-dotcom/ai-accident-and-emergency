import { format, parseISO, isValid } from 'date-fns';

/**
 * Format numbers as Indian Rupee currency (INR)
 */
export function formatCurrency(amount, currencySymbol = '₹') {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return `${currencySymbol}0`;
  }
  const numericAmount = Math.round(Number(amount));
  return `${currencySymbol}${numericAmount.toLocaleString('en-IN')}`;
}

/**
 * Format distance in kilometers
 */
export function formatDistance(distance, unit = 'km') {
  if (distance === null || distance === undefined || isNaN(distance)) {
    return `0 ${unit}`;
  }
  const numericVal = Math.round(Number(distance));
  return `${numericVal.toLocaleString('en-IN')} ${unit}`;
}

/**
 * Format fuel efficiency / mileage
 */
export function formatMileage(mileage, unit = 'km/L') {
  if (mileage === null || mileage === undefined || isNaN(mileage)) {
    return `0 ${unit}`;
  }
  const val = Number(mileage);
  return `${val.toFixed(1)} ${unit}`;
}

/**
 * Format date string safely
 */
export function formatDate(dateStr, pattern = 'dd MMM yyyy') {
  if (!dateStr) return 'N/A';
  try {
    const parsed = typeof dateStr === 'string' ? parseISO(dateStr) : new Date(dateStr);
    if (!isValid(parsed)) return 'N/A';
    return format(parsed, pattern);
  } catch (err) {
    return dateStr;
  }
}
