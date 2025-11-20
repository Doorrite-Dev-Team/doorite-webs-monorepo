import { toast } from "@repo/ui/components/sonner";
import Axios from "./Axios";

export const api = {
  fetchProducts: async (params: Record<string, string>) => {
    try {
      const queryString = new URLSearchParams(params).toString();

      const url = `/products?${queryString ? `?${queryString}` : ""}`;
      const res: SuccessResponse<{ products: Product[] }> =
        await Axios.get(url);
      return res.products;
    } catch (error) {
      toast(`Unable to fetch Products: ${(error as Error).message}`);
      return null;
    }
  },

  fetchVendor: async (id: string) => {
    try {
      const res: SuccessResponse<{ Vendors: Vendor[] }> = await Axios.get(
        `/vendors/${id}`
      );
      return res.Vendors;
    } catch (error) {
      toast(`Unable to fetch Vendor: ${(error as Error).message}`);
      return null;
    }
  },
};
