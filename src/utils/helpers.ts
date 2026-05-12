// Utility functions

export const formatCurrency = (value: number, currency = 'USD', decimals = 2): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
};

export const formatPercentage = (value: number, decimals = 2): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatDate = (date: string | Date, format = 'short'): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (format === 'short') {
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  
  if (format === 'long') {
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
  
  if (format === 'time') {
    return dateObj.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  
  return dateObj.toISOString();
};

export const formatNumber = (value: number, decimals = 2): string => {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
};

export const calculatePercentageChange = (current: number, previous: number): number => {
  if (previous === 0) return 0;
  return ((current - previous) / Math.abs(previous)) * 100;
};

export const calculatePortfolioMetrics = (positions: Array<{ purchasePrice: number; quantity: number; currentPrice?: number }>) => {
  let totalValue = 0;
  let totalCost = 0;

  positions.forEach((position) => {
    totalCost += position.purchasePrice * position.quantity;
    totalValue += (position.currentPrice || position.purchasePrice) * position.quantity;
  });

  const totalGain = totalValue - totalCost;
  const percentageGain = totalCost > 0 ? (totalGain / totalCost) * 100 : 0;

  return {
    totalValue,
    totalCost,
    totalGain,
    percentageGain,
  };
};

export const truncateText = (text: string, length: number): string => {
  return text.length > length ? `${text.substring(0, length)}...` : text;
};

export const cn = (...classes: Array<string | undefined | null | false | { [key: string]: boolean }>) => {
  const classNames: string[] = [];

  for (const cls of classes) {
    if (typeof cls === 'string' && cls) {
      classNames.push(cls);
    } else if (typeof cls === 'object' && cls) {
      for (const [key, value] of Object.entries(cls)) {
        if (value) classNames.push(key);
      }
    }
  }

  return classNames.join(' ');
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
