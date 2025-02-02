import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatNumberWithSpaces(number: number) {
  const integerNumber = Math.floor(number);

  return new Intl.NumberFormat('en-US', {
    useGrouping: true,
  })
    .format(integerNumber)
    .replace(/,/g, ' ');
}

export const shortenAddress = (address: string) => {
  if (!address) return '';
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const formatTimeFromSecToHuman = (sec: number | null) => {
  if (!sec) return '00:00';
  const date = new Date(sec * 1000);
  const hours = date.getHours(); // 1 hour = 3600 seconds
  const minutes = date.getMinutes(); // Remaining seconds to minutes

  const formattedHours = String(hours).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');

  return `${formattedHours}:${formattedMinutes}`;
};

export const formatTimeFromSecToDate = (sec: number | null) => {
  if (!sec) return '00.00.0000';

  const date = new Date(sec * 1000); // Convert seconds to milliseconds

  // Extract day, month, and year
  const day = String(date.getDate()).padStart(2, '0'); // Ensure 2 digits for day
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed, so add 1
  const year = date.getFullYear();

  // Format as dd.mm.yyyy
  return `${day}.${month}.${year}`;
};
