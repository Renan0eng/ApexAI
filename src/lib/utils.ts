import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isRedirectError(error: any) {
  return error instanceof Error && error.message === "NEXT_REDIRECT";
}

export const formatDate = (date: Date) => {
  const d = new Date(date);
  // 15/11/2021 05:00
  const day = d.getDate() < 10 ? `0${d.getDate()}` : d.getDate();
  const month = d.getMonth() < 10 ? `0${d.getMonth() + 1}` : d.getMonth() + 1;
  const year = d.getFullYear();
  const hour = d.getHours() < 10 ? `0${d.getHours()}` : d.getHours();
  const minutes = d.getMinutes() < 10 ? `0${d.getMinutes()}` : d.getMinutes();
  return `${day}/${month}/${year} ${hour}:${minutes}`;
}