// src/lib/utils.ts

import { clsx, type ClassValue } from 'clsx';
import { format } from 'date-fns'; // <-- Assuming you use date-fns for date formatting
import { twMerge } from 'tailwind-merge';

// 1. Export cn (already present)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// 2. Export formatDuration (Example implementation based on your test)
export function formatDuration(ms: number): string {
  const safeMs = Math.max(0, ms);
  const totalSeconds = Math.round(safeMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  // Pads seconds with a leading zero if necessary
  const paddedSeconds = String(seconds).padStart(2, '0');
  return `${minutes}:${paddedSeconds}`;
}

// 3. Export formatDate (Example implementation based on your test)
export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    return format(date, 'MMMM d, yyyy');
  } catch {
    return 'Invalid Date';
  }
}

export function formatNumber(num: number | undefined): string {
  if (num === undefined || isNaN(num)) return '0';

  return Math.round(num).toLocaleString();
}
