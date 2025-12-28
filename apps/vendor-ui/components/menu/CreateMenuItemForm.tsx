"use client";

import { useState, ChangeEvent, DragEvent, FormEvent } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import apiClient from "@/libs/api/client";
import { showToast } from "@/components/Toast"; // ✅ added toast import

interface Props {
  onClose: () => void;
}

export default function CreateMenuItemForm({ onClose }: Props) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    sku: "",
    ingredients: "",
    stockQuantity: "",
  });

  const [available, setAvailable] = useState(true);
  const [dietaryRestrictions, setDietaryRestrictions] = useState(false);
  const [vegetarian, setVegetarian] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ Handle text/number input changes
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Handle image upload
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // ✅ Handle drag & drop
  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImagePreview(imageUrl);
    }
  };

  // ✅ Submit form to backend with toast + close modal
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!form.name || !form.basePrice) {
        showToast({
          message: "Validation Error",
          subtext: "Name and price are required.",
          type: "error",
        });
        setLoading(false);
        return;
      }

      const payload = {
        name: form.name,
        description: form.description || "",
        basePrice: parseFloat(form.basePrice),
        sku: form.sku || "",
        attributes: {
          vegetarian,
          dietaryRestrictions,
          ingredients: form.ingredients,
          stockQuantity: form.stockQuantity
            ? Number(form.stockQuantity)
            : undefined,
        },
        isAvailable: available,
        variants: [],
      };

      const response = await apiClient.post("/vendors/products", payload);

      // ✅ Success toast
      showToast({
        message: "Menu Item Created!",
        subtext: `“${form.name}” added successfully.`,
        type: "success",
      });

      console.log("✅ Product created:", response.data);

      // ✅ Reset form
      setForm({
        name: "",
        description: "",
        basePrice: "",
        sku: "",
        ingredients: "",
        stockQuantity: "",
      });
      setAvailable(true);
      setImagePreview(null);

      // ✅ Close modal after success
      setTimeout(() => onClose(), 800);
    } catch (error: any) {
      console.error("❌ Error creating menu item:", error);

      const backendError =
        error?.response?.data?.error ||
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create menu item.";

      // ✅ Error toast
      showToast({
        message: "Failed to Create Item",
        subtext: backendError,
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex justify-center items-center p-4">
      <div className="bg-white w-full max-w-md md:max-w-lg rounded-2xl p-6 overflow-y-auto max-h-[90vh] shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
            Create New Menu Item
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Upload Image */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload Image
          </label>

          <div
            onDrop={handleDrop}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition ${
              dragOver
                ? "border-green-500 bg-green-50"
                : "border-green-300 hover:border-green-400"
            }`}
          >
            {imagePreview ? (
              <div className="flex flex-col items-center space-y-3">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  width={150}
                  height={150}
                  className="rounded-lg object-cover"
                />
                <label className="text-sm text-green-600 font-medium cursor-pointer hover:underline">
                  Change Image
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <label className="block cursor-pointer">
                <p className="text-green-600 font-medium">Upload Image</p>
                <p className="text-sm text-gray-500 mt-1">
                  Drag and drop or click to upload
                </p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </label>
            )}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Item Name */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Item Name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter item name"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Category (Optional UI only for now) */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Category
            </label>
            <select
              name="category"
              onChange={handleChange}
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option>Select category</option>
              <option>Burger</option>
              <option>Drinks</option>
              <option>Desserts</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="text-sm font-medium text-gray-700">Price</label>
            <input
              type="number"
              name="basePrice"
              value={form.basePrice}
              onChange={handleChange}
              placeholder="Enter price"
              min="0"
              step="1"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter description"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
              rows={3}
            ></textarea>
          </div>

          {/* Ingredients */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Ingredients
            </label>
            <input
              type="text"
              name="ingredients"
              value={form.ingredients}
              onChange={handleChange}
              placeholder="Enter ingredients"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex items-center justify-between mt-4">
            <span className="text-sm font-medium text-gray-700">Available</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={available}
                onChange={() => setAvailable(!available)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all after:translate-x-0 peer-checked:after:translate-x-5"></div>
            </label>
          </div>

          {/* Additional Options */}
          <div className="mt-4">
            <h3 className="text-sm font-semibold text-gray-800 mb-2">
              Additional Options
            </h3>

            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-gray-700">
                Dietary Restrictions
              </span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={dietaryRestrictions}
                  onChange={() => setDietaryRestrictions(!dietaryRestrictions)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:bg-green-500 after:content-[''] after:absolute after:w-5 after:h-5 after:bg-white after:rounded-full after:transition-all after:translate-x-0 peer-checked:after:translate-x-5"></div>
              </label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={vegetarian}
                onChange={() => setVegetarian(!vegetarian)}
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label className="text-sm font-medium text-gray-700">
                Vegetarian Option
              </label>
            </div>
          </div>

          {/* Stock Quantity */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Stock Quantity
            </label>
            <input
              type="number"
              name="stockQuantity"
              value={form.stockQuantity}
              onChange={handleChange}
              placeholder="Enter stock quantity"
              className="mt-1 w-full border border-gray-300 rounded-lg p-2.5 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-between items-center mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-1/2 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`w-1/2 py-2 rounded-lg font-medium text-white transition ${
                loading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              }`}
            >
              {loading ? "Saving..." : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
