const ADDRESS_INDEX_KEY = "selected_address_index";

export function getAddressIndex(): number | null {
  if (typeof window === "undefined") return null;
  try {
    const val = sessionStorage.getItem(ADDRESS_INDEX_KEY);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
}

export function setAddressIndex(index: number): void {
  try {
    sessionStorage.setItem(ADDRESS_INDEX_KEY, String(index));
  } catch {}
}

export function clearAddressIndex(): void {
  try {
    sessionStorage.removeItem(ADDRESS_INDEX_KEY);
  } catch {}
}