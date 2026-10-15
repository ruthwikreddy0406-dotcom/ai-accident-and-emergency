import { differenceInCalendarDays, parseISO, isValid } from 'date-fns';

export const MAINTENANCE_CATEGORIES = [
  'Engine oil',
  'Oil filter',
  'Air filter',
  'Tyres',
  'Brakes',
  'Battery',
  'Coolant',
  'General servicing',
  'Other'
];

/**
 * Determine dynamic status and explanation for a maintenance task
 * @param {Object} task
 * @param {Object} vehicle
 * @param {Date} [referenceDate] defaults to new Date()
 */
export function getMaintenanceStatusInfo(task, vehicle, referenceDate = new Date()) {
  if (task.completedAt || task.status === 'Completed') {
    return {
      status: 'Completed',
      badgeClass: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      reason: task.completedAt ? `Completed on ${task.completedAt.slice(0, 10)}` : 'Marked as completed',
      priority: 4
    };
  }

  let isDateOverdue = false;
  let isDateDueSoon = false;
  let daysDiff = null;

  if (task.nextServiceDate) {
    try {
      const targetDate = parseISO(task.nextServiceDate);
      if (isValid(targetDate)) {
        daysDiff = differenceInCalendarDays(targetDate, referenceDate);
        if (daysDiff < 0) {
          isDateOverdue = true;
        } else if (daysDiff <= 14) {
          isDateDueSoon = true;
        }
      }
    } catch (e) {
      console.error('Error parsing date:', e);
    }
  }

  let isOdoOverdue = false;
  let isOdoDueSoon = false;
  let kmDiff = null;

  const currentOdo = vehicle?.currentOdometer ?? task.currentOdometer;
  if (task.nextServiceOdometer && currentOdo !== null && currentOdo !== undefined && !isNaN(currentOdo)) {
    kmDiff = task.nextServiceOdometer - currentOdo;
    if (kmDiff <= 0) {
      isOdoOverdue = true;
    } else if (kmDiff <= 800) {
      isOdoDueSoon = true;
    }
  }

  // Determine highest severity
  if (isDateOverdue || isOdoOverdue) {
    let reason = 'Overdue: ';
    if (isDateOverdue && daysDiff !== null) {
      reason += `${Math.abs(daysDiff)} day${Math.abs(daysDiff) === 1 ? '' : 's'} past target date`;
    }
    if (isOdoOverdue && kmDiff !== null) {
      reason += (isDateOverdue ? ', and ' : '') + `${Math.abs(kmDiff).toLocaleString('en-IN')} km over service limit`;
    }
    return {
      status: 'Overdue',
      badgeClass: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-semibold',
      reason,
      priority: 1
    };
  }

  if (isDateDueSoon || isOdoDueSoon) {
    let reason = 'Due soon: ';
    if (isDateDueSoon && daysDiff !== null) {
      reason += `Due in ${daysDiff} day${daysDiff === 1 ? '' : 's'}`;
    }
    if (isOdoDueSoon && kmDiff !== null) {
      reason += (isDateDueSoon ? ' or in ' : '') + `${kmDiff.toLocaleString('en-IN')} km`;
    }
    return {
      status: 'Due soon',
      badgeClass: 'bg-amber-500/15 text-amber-400 border-amber-500/30 font-semibold',
      reason,
      priority: 2
    };
  }

  // Otherwise Upcoming
  let reason = 'Scheduled';
  if (daysDiff !== null && daysDiff > 14) {
    reason = `Scheduled in ${daysDiff} days`;
  } else if (kmDiff !== null && kmDiff > 800) {
    reason = `Target at +${kmDiff.toLocaleString('en-IN')} km`;
  }

  return {
    status: 'Upcoming',
    badgeClass: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    reason,
    priority: 3
  };
}
