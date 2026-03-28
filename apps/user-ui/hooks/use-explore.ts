import {
  parseAsString,
  parseAsBoolean,
  parseAsInteger,
  useQueryStates,
} from "nuqs";
import { useQuery } from "@tanstack/react-query";
import { useDebounceValue } from "usehooks-ts";
import { api } from "@/actions/api";

export function useExplore({
  userCoords,
}: { userCoords?: { lat: number; long: number } | null } = {}) {
  const [state, setParams] = useQueryStates(
    {
      q: parseAsString.withDefault(""),
      cuisine: parseAsString.withDefault("all"),
      sort: parseAsString.withDefault("recommended"),
      open: parseAsBoolean.withDefault(false),
      top_rated: parseAsBoolean.withDefault(false),
      page: parseAsInteger.withDefault(1),
    },
    { history: "replace", shallow: false },
  );

  const [debouncedQ] = useDebounceValue(state.q, 300);
  const isProductSearch = debouncedQ.length >= 2;

  const getCleanParams = (extra: Record<string, unknown> = {}) => {
    const params = new URLSearchParams();
    const merged = {
      ...state,
      ...extra,
      lat: userCoords?.lat,
      lng: userCoords?.long,
    };

    Object.entries(merged).forEach(([key, val]) => {
      if (val && val !== "all" && val !== "recommended")
        params.append(key, String(val));
    });
    return params.toString();
  };

  const vendorsQuery = useQuery({
    queryKey: ["vendors", state, userCoords],
    queryFn: () => api.fetchVendors(getCleanParams({ limit: 12, q: "" })),
    enabled: !isProductSearch,
    staleTime: 60000,
    placeholderData: (prev) => prev,
  });

  const productsQuery = useQuery({
    queryKey: ["product-search", debouncedQ, userCoords],
    queryFn: () => api.fetchProducts(getCleanParams({ q: debouncedQ })),
    enabled: isProductSearch,
    staleTime: 30000,
  });

  const cuisinesQuery = useQuery({
    queryKey: ["cuisines"],
    queryFn: api.getCuisines, // ← swap here
    staleTime: Infinity, // static data, never refetch
    gcTime: Infinity, // keep in cache forever
  });

  const hasActiveFilters = Object.entries(state).some(([k, v]) =>
    k === "q"
      ? v !== ""
      : k === "cuisine"
        ? v !== "all"
        : k === "sort"
          ? v !== "recommended"
          : !!v,
  );

  const clearFilters = () =>
    setParams({
      q: "",
      cuisine: "all",
      sort: "recommended",
      open: false,
      top_rated: false,
      page: 1,
    });

  const handlePageChange = (page: number) => {
    setParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return {
    //states
    state,
    debouncedQ,
    isProductSearch,
    hasActiveFilters,

    //Queries
    vendorsQuery,
    productsQuery,
    cuisinesQuery,

    //Actions
    setParams,
    clearFilters,
    handlePageChange,
    handleCuisineChange: (cuisine: string) => setParams({ cuisine, page: 1 }),
    handleQuickFilterToggle: (id: "open" | "top_rated") =>
      setParams({ [id]: !state[id], page: 1 }),
  };
}
