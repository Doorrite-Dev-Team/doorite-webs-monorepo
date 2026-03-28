"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent, CardHeader } from "@repo/ui/components/card";
import { Switch } from "@repo/ui/components/switch";
import { ModifierGroup, ModifierOption } from "@/libs/api/modifier-api";
import { Settings2, Edit, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface ModifierGroupCardProps {
  group: ModifierGroup;
  onEdit: (group: ModifierGroup) => void;
  onDelete: (id: string) => void;
}

export default function ModifierGroupCard({
  group,
  onEdit,
  onDelete,
}: ModifierGroupCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleOptionAvailability = (optionId: string) => {
    // This would be handled by the parent component via API calls
    console.log("Toggle option:", optionId);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-gray-900">{group.name}</h3>
              {group.isRequired && (
                <Badge variant="destructive" className="text-xs">
                  Required
                </Badge>
              )}
              {group.usedInProducts && group.usedInProducts > 0 && (
                <Badge variant="secondary" className="text-xs">
                  Used in {group.usedInProducts} product
                  {group.usedInProducts !== 1 ? "s" : ""}
                </Badge>
              )}
            </div>

            <div className="text-sm text-gray-500 mb-2">
              {group.minSelect === group.maxSelect ? (
                <>Select exactly {group.minSelect}</>
              ) : group.minSelect === 0 ? (
                <>Select up to {group.maxSelect}</>
              ) : (
                <>
                  Select {group.minSelect} to {group.maxSelect}
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(group)}
              className="h-8 w-8 p-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(group.id)}
              className="h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Options ({group.options.length})
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-blue-600 hover:text-blue-700"
            >
              {expanded ? "Show less" : "Show all"}
            </Button>
          </div>

          <div
            className={`${expanded ? "space-y-2" : "space-y-2 max-h-32 overflow-hidden"}`}
          >
            {group.options.map((option) => (
              <div
                key={option.id}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center gap-2">
                  <Switch
                    checked={option.isAvailable}
                    onCheckedChange={() => toggleOptionAvailability(option.id)}
                  />
                  <span
                    className={`text-sm ${option.isAvailable ? "text-gray-900" : "text-gray-500"}`}
                  >
                    {option.name}
                  </span>
                  {option.priceAdjustment !== 0 && (
                    <Badge
                      variant={
                        option.priceAdjustment > 0 ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {option.priceAdjustment > 0 ? "+" : ""}₦
                      {option.priceAdjustment.toLocaleString()}
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
