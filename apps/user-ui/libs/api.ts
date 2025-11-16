import { toast } from "@repo/ui/components/sonner";
import Axios from "./Axios";

export const api = {
  fetchProducts: async (params: Record<string, string>) => {
    try {
      const queryString = new URLSearchParams(params).toString();

      const url = `/products?${queryString ? `?${queryString}` : ""}`;
      const res: ServerResponse<{ products: Product[] }> = await Axios.get(url);
      return res.data;
    } catch (error) {
      toast(`Unable to fetch Products: ${(error as Error).message}`);
      return null;
    }
  },

  fetchVendor: async (id: string) => {
    try {
      const res: ServerResponse<{ products: Vendor[] }> = await Axios.get(
        `/vendors/${id}`
      );
      return res.data;
    } catch (error) {
      toast(`Unable to fetch Vendor: ${(error as Error).message}`);
      return null;
    }
  },
};
