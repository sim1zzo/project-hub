// utils/dateHelpers.ts - Utility per gestione date

/**
 * Calcola il numero di giorni lavorativi tra due date (escludendo sabato e domenica)
 */
export const calculateWorkingDays = (
  startDate: Date,
  endDate: Date
): number => {
  let count = 0;
  const current = new Date(startDate);

  while (current <= endDate) {
    const dayOfWeek = current.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      count++;
    }
    current.setDate(current.getDate() + 1);
  }

  return count;
};

/**
 * Calcola i giorni lavorativi rimanenti dalla data odierna alla data di fine
 */
export const getRemainingWorkingDays = (endDate: string): number => {
  try {
    const today = new Date();
    const end = new Date(endDate);

    if (isNaN(end.getTime()) || end < today) {
      return 0;
    }

    return calculateWorkingDays(today, end);
  } catch (error) {
    console.error('Error calculating remaining working days:', error);
    return 0;
  }
};

/**
 * Calcola il numero totale di giorni tra due date
 */
export const getTotalDays = (startDate: string, endDate: string): number => {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return 0;
    }

    const diff = end.getTime() - start.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  } catch (error) {
    console.error('Error calculating total days:', error);
    return 0;
  }
};

/**
 * Formatta una data nel formato locale
 */
export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }
    return date.toLocaleDateString('it-IT');
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Verifica se una data è valida
 */
export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};
