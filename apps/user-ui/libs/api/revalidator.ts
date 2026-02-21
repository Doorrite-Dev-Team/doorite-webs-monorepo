// import "server-only";
// import { revalidateTag, revalidatePath } from "next/cache";
// import { CACHE_TAGS } from "./server";

// /**
//  * Revalidation utilities for cache management
//  * Call these after mutations (create, update, delete)
//  */

// export const revalidateCache = {
//   // Products
//   products: () => revalidateTag(CACHE_TAGS.products),
//   product: (id: string) => revalidateTag(CACHE_TAGS.product(id)),

//   // Vendors
//   vendors: () => revalidateTag(CACHE_TAGS.vendors),
//   vendor: (id: string) => revalidateTag(CACHE_TAGS.vendor(id)),
//   vendorProducts: (id: string) => revalidateTag(CACHE_TAGS.vendorProducts(id)),

//   // Profile
//   profile: () => revalidateTag(CACHE_TAGS.profile),

//   // Orders
//   orders: () => revalidateTag(CACHE_TAGS.orders),
//   order: (id: string) => revalidateTag(CACHE_TAGS.order(id)),

//   // Payment Methods
//   paymentMethods: () => revalidateTag(CACHE_TAGS.paymentMethods),

//   // Reviews
//   reviews: (vendorId: string) => revalidateTag(CACHE_TAGS.reviews(vendorId)),

//   // Riders
//   rider: (riderId: string) => revalidateTag(CACHE_TAGS.rider(riderId)),

//   // Revalidate entire paths
//   path: (path: string) => revalidatePath(path),
//   homepage: () => revalidatePath("/home"),
//   vendorPage: (id: string) => revalidatePath(`/vendors/${id}`),
//   productPage: (id: string) => revalidatePath(`/products/${id}`),
// };
