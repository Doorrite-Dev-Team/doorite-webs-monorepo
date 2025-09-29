"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Search } from "lucide-react";

export default function EmptyState({
  hasSearch,
  searchTerm,
  onClear,
}: {
  hasSearch: boolean;
  searchTerm: string;
  onClear: () => void;
}) {
  return (
    <Card className="border-0 bg-white">
      <CardContent className="p-12 text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <Search className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-700 mb-3">
          {hasSearch ? "No results found" : "No vendors available"}
        </h3>
        <p className="text-gray-500 mb-6 max-w-sm mx-auto">
          {hasSearch
            ? `We couldn't find anything matching "${searchTerm}". Try different keywords or clear your filters.`
            : "Try adjusting your filters or search for something specific."}
        </p>
        <Button onClick={onClear} className="bg-primary hover:bg-primary/90">
          {hasSearch ? "Clear search & filters" : "Reset filters"}
        </Button>
      </CardContent>
    </Card>
  );
}
