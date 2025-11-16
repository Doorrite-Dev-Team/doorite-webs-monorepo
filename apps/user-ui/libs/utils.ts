export const vendorImage = (logoUrl?: string) => {
  const isValidImage =
    (typeof logoUrl === "string" &&
      (logoUrl.startsWith("http") || logoUrl.startsWith("/"))) ||
    logoUrl;

  return isValidImage ? logoUrl : "/placeholder.png"; // 👈
};
