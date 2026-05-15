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
	// Add this to carry the price/name changes for existing options
	options?: Array<{
		id: string;
		name: string;
		priceAdjustment: number;
		isAvailable: boolean;
	}>;
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
			modifierGroups: ModifierGroup[];
		}>("/vendors/modifiers");
		return data?.modifierGroups ?? [];
	},

	getModifierGroupById: async (id: string) => {
		const { data } = await apiClient.get<{
			modifierGroup: ModifierGroup;
		}>(`/vendors/modifiers/${id}`);
		return data;
	},

	createModifierGroup: async (payload: CreateModifierGroupPayload) => {
		const { data } = await apiClient.post<{
			modifierGroup: ModifierGroup;
		}>("/vendors/modifiers", payload);
		return data;
	},

	updateModifierGroup: async (
		id: string,
		payload: UpdateModifierGroupPayload,
	) => {
		const { data } = await apiClient.put<{
			modifierGroup: ModifierGroup;
		}>(`/vendors/modifiers/${id}`, payload);
		return data;
	},

	deleteModifierGroup: async (id: string) => {
		const { data } = await apiClient.delete<{
			message: string;
		}>(`/vendors/modifiers/${id}`);
		return data;
	},

	// Modifier Options
	createModifierOption: async (
		groupId: string,
		payload: CreateModifierOptionPayload,
	) => {
		const { data } = await apiClient.post<{
			option: ModifierOption;
		}>(`/vendors/modifiers/${groupId}/options`, payload);
		return data;
	},

	updateModifierOption: async (
		groupId: string,
		optionId: string,
		payload: UpdateModifierOptionPayload,
	) => {
		const { data } = await apiClient.put<{
			option: ModifierOption;
		}>(`/vendors/modifiers/${groupId}/options/${optionId}`, payload);
		return data;
	},

	deleteModifierOption: async (groupId: string, optionId: string) => {
		const { data } = await apiClient.delete<{
			message: string;
		}>(`/vendors/modifiers/${groupId}/options/${optionId}`);
		return data;
	},

	// Product-Modifier Assignment
	getProductModifiers: async (productId: string) => {
		const { data } = await apiClient.get<{
			modifierGroups: ModifierGroup[];
		}>(`/vendors/products/${productId}/modifiers`);
		return data;
	},

	assignModifierToProduct: async (
		productId: string,
		modifierGroupId: string,
	) => {
		const { data } = await apiClient.post<{
			assignment: any;
		}>(`/vendors/products/${productId}/modifiers`, { modifierGroupId });
		return data;
	},

	removeModifierFromProduct: async (
		productId: string,
		modifierGroupId: string,
	) => {
		const { data } = await apiClient.delete<{
			message: string;
		}>(`/vendors/products/${productId}/modifiers/${modifierGroupId}`);
		return data;
	},
};
