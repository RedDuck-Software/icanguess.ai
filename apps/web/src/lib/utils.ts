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
