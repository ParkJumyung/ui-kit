import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function extractDefaultVariants<
  T extends { [K in keyof T]: { [key: string]: string } }
>(variantsConfig: T): { [K in keyof T]: keyof T[K] } {
  return Object.fromEntries(
    (Object.entries(variantsConfig) as [keyof T, T[keyof T]][]).map(
      ([key, value]) => [key, Object.keys(value)[0] as keyof T[keyof T]]
    )
  ) as { [K in keyof T]: keyof T[K] };
}
