import { Map, NavigationControl } from "@maptiler/sdk";

export const maptilerConfig = {
  apiKey: process.env.NEXT_PUBLIC_MAPTILER_API_KEY,
};

export const DEFAULT_MAP_CENTER: [number, number] = [3.3792, 6.5244]; // Lagos, Nigeria
export const DEFAULT_MAP_ZOOM = 12;

export { Map, NavigationControl };
