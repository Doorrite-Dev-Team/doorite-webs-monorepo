"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@repo/ui/components/tabs";
import { Package, Settings2 } from "lucide-react";
import ProductsTab from "./ProductsTab";
import ModifiersTab from "./ModifiersTab";

export default function MenuTabs() {
  return (
    <div className="p-4 md:p-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Menu Management
        </h1>
        <p className="text-sm text-gray-500">
          Manage your products, variants, and customization options
        </p>
      </div>

      <Tabs defaultValue="products" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 mb-6">
          <TabsTrigger value="products" className="flex items-center gap-2">
            <Package className="w-4 h-4" />
            <span>Products</span>
          </TabsTrigger>
          <TabsTrigger value="modifiers" className="flex items-center gap-2">
            <Settings2 className="w-4 h-4" />
            <span>Modifiers</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="mt-0">
          <ProductsTab />
        </TabsContent>

        <TabsContent value="modifiers" className="mt-0">
          <ModifiersTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
