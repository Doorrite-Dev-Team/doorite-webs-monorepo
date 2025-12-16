"use client";

import { apiClient } from "@/libs/api-client";
// import { SuccessResponse, Vendor } from "@/types";
import { useState } from "react";
import { Button } from "@repo/ui/components/button";

// import * as React from "react";
//
const TestPage = () => {
  const [vendors, setvendors] = useState<Vendor[]>([]);

  const fetchProducts = async () => {
    const res: SuccessResponse<{ vendors: Vendor[] }> =
      await apiClient.get("/vendors");

    setvendors(res.data.vendors);
    console.log(res.data);
  };

  // useEffect(() => {
  //   fetchProducts();
  // }, []);

  return (
    <div className="flex flex-col gap-30">
      <Button onClick={fetchProducts}>Click me</Button>

      <div>
        {vendors && vendors.map((v) => <p key={v.id}>{v.businessName}</p>)}
      </div>
    </div>
  );
};

export default TestPage;
