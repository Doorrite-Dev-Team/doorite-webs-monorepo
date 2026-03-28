import apiClient from "./client";

export interface ModifierOption {
  id: string;
  modifierGroupId: string;
  name: string;
  priceAdjustment: number;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ModifierGroup {
  id: string;
  vendorId: string;
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  createdAt: string;
  updatedAt: string;
  options: ModifierOption[];
  usedInProducts?: number;
}

export interface CreateModifierGroupPayload {
  name: string;
  isRequired: boolean;
  minSelect: number;
  maxSelect: number;
  options: Array<{
    name: string;
    priceAdjustment: number;
  }>;
}

export interface UpdateModifierGroupPayload {
  name?: string;
  isRequired?: boolean;
  minSelect?: number;
  maxSelect?: number;
}

export interface CreateModifierOptionPayload {
  name: string;
  priceAdjustment: number;
}

export interface UpdateModifierOptionPayload {
  name?: string;
  priceAdjustment?: number;
  isAvailable?: boolean;
}

export const modifierApi = {
  // Modifier Groups
  getModifierGroups: async () => {
    const { data } = await apiClient.get<{
      ok: boolean;
      data: { modifierGroups: ModifierGroup[] };
    }>("/vendors/modifiers");
    return data.data;
  },

  getModifierGroupById: async (id: string) => {
    const { data } = await apiClient.get<{
      ok: boolean;
      data: { modifierGroup: ModifierGroup };
    }>(`/vendors/modifiers/${id}`);
    return data.data;
  },

  createModifierGroup: async (payload: CreateModifierGroupPayload) => {
    const { data } = await apiClient.post<{
      ok: boolean;
      data: { modifierGroup: ModifierGroup };
    }>("/vendors/modifiers", payload);
    return data.data;
  },

  updateModifierGroup: async (
    id: string,
    payload: UpdateModifierGroupPayload,
  ) => {
    const { data } = await apiClient.put<{
      ok: boolean;
      data: { modifierGroup: ModifierGroup };
    }>(`/vendors/modifiers/${id}`, payload);
    return data.data;
  },

  deleteModifierGroup: async (id: string) => {
    const { data } = await apiClient.delete<{
      ok: boolean;
      data: { message: string };
    }>(`/vendors/modifiers/${id}`);
    return data.data;
  },

  // Modifier Options
  createModifierOption: async (
    groupId: string,
    payload: CreateModifierOptionPayload,
  ) => {
    const { data } = await apiClient.post<{
      ok: boolean;
      data: { option: ModifierOption };
    }>(`/vendors/modifiers/${groupId}/options`, payload);
    return data.data;
  },

  updateModifierOption: async (
    groupId: string,
    optionId: string,
    payload: UpdateModifierOptionPayload,
  ) => {
    const { data } = await apiClient.put<{
      ok: boolean;
      data: { option: ModifierOption };
    }>(`/vendors/modifiers/${groupId}/options/${optionId}`, payload);
    return data.data;
  },

  deleteModifierOption: async (groupId: string, optionId: string) => {
    const { data } = await apiClient.delete<{
      ok: boolean;
      data: { message: string };
    }>(`/vendors/modifiers/${groupId}/options/${optionId}`);
    return data.data;
  },

  // Product-Modifier Assignment
  getProductModifiers: async (productId: string) => {
    const { data } = await apiClient.get<{
      ok: boolean;
      data: { modifierGroups: ModifierGroup[] };
    }>(`/vendors/products/${productId}/modifiers`);
    return data.data;
  },

  assignModifierToProduct: async (
    productId: string,
    modifierGroupId: string,
  ) => {
    const { data } = await apiClient.post<{
      ok: boolean;
      data: { assignment: any };
    }>(`/vendors/products/${productId}/modifiers`, { modifierGroupId });
    return data.data;
  },

  removeModifierFromProduct: async (
    productId: string,
    modifierGroupId: string,
  ) => {
    const { data } = await apiClient.delete<{
      ok: boolean;
      data: { message: string };
    }>(`/vendors/products/${productId}/modifiers/${modifierGroupId}`);
    return data.data;
  },
};
