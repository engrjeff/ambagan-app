import { PaymentSchedule } from '@/app/generated/prisma';
import { clsx, type ClassValue } from 'clsx';
import { isAfter } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
};

export const toCompact = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
  }).format(amount);
};

export const toCompactWithCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
    notation: 'compact',
  }).format(amount);
};

export const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export function getLastPaymentDate(contributions: PaymentSchedule[]) {
  const c = contributions.at(0);

  if (!c?.paymentDate) return 'No payment made yet';

  return formatDate(new Date(c.paymentDate).toString());
}

export function getTotalContributionsPaid(contributions: PaymentSchedule[]) {
  const amount = contributions.reduce(
    (total, contribution) => total + contribution.actualAmountPaid,
    0
  );

  return formatCurrency(amount);
}

export function removeDuplicates<T, R = T[]>(arr: T[], key: keyof T) {
  return arr.filter((item, index) => {
    return index === arr.findIndex((a) => a[key] === item[key]);
  }) as unknown as R;
}

export function isOverdue(scheduleDate: Date) {
  const now = new Date();

  return isAfter(now, scheduleDate);
}
