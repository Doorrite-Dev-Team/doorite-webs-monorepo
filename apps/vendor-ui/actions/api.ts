import apiClient from "@/libs/api/client";

type SuccessResponse<T = { message: string }> = {
  data: {
    ok: true;
  } & T;
};

const api = {
  fetchOrders: async (limit: string) => {
    const res: SuccessResponse<{
      orders: Order;
    }> = await apiClient.get(`/orders?limit=${limit}`);

    return res.data.orders;
  },
  fetchMyProducts: async (id: string) => {
    const { data }: SuccessResponse<{ product: Product }> = await apiClient.get(
      `/products/${id}`,
    );

    return data.product;
  },
  fetchProduct: async (id: string) => {
    const { data }: SuccessResponse<{ product: Product }> = await apiClient.get(
      `/products/${id}`,
    );

    return data.product;
  },
  fetchProfile: async () => {
    const { data }: SuccessResponse<{ vendor: Vendor }> =
      await apiClient.get(`/users/me`);
    return data.vendor;
  },
};

export default api;
