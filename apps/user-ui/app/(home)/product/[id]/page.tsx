"use client";

import { useQueryState } from "nuqs";
import React from "react";

const ProductPage = () => {
  const [name, setName] = useQueryState("name");
  return (
    <>
      <input value={name || ""} onChange={(e) => setName(e.target.value)} />
      <button onClick={() => setName(null)}>Clear</button>
      <p>Hello, {name || "anonymous visitor"}!</p>
    </>
  );
};
export default ProductPage;
