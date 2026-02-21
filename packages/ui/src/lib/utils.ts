// packages/ui/src/lib/utils.ts
import { cx } from "class-variance-authority";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind classes intelligently.
 */
export function cn(...inputs: Parameters<typeof cx>) {
  return twMerge(cx(...inputs));
}
