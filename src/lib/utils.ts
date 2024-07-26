import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function dialogCloseFn() {
  document.getElementById("dialogClose")?.click()
}

//iso string to date time string
export function formatDateTime(date: string | undefined) {
  if (!date) return ""
  return new Date(date).toLocaleString()
} 
