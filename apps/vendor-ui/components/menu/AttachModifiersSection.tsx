"use client";

import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/components/card";
import { Checkbox } from "@repo/ui/components/checkbox";
import { Skeleton } from "@repo/ui/components/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Settings2, Plus } from "lucide-react";
import { ModifierGroup } from "@/libs/api/modifier-api";

interface AttachModifiersSectionProps {
  selectedModifiers: string[];
  onModifiersChange: (modifierIds: string[]) => void;
}

export default function AttachModifiersSection({
  selectedModifiers,
  onModifiersChange,
}: AttachModifiersSectionProps) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["modifier-groups"],
    queryFn: async () => {
      const { modifierApi } = await import("@/libs/api/modifier-api");
      return modifierApi.getModifierGroups();
    },
    staleTime: 5 * 60 * 1000,
  });

  const modifierGroups = data?.modifierGroups || [];

  const handleToggleModifier = (modifierId: string, checked: boolean) => {
    if (checked) {
      onModifiersChange([...selectedModifiers, modifierId]);
    } else {
      onModifiersChange(selectedModifiers.filter((id) => id !== modifierId));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-3">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-48" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isError || modifierGroups.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm">
            <Settings2 className="w-4 h-4" />
            Customization Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 border-2 border-dashed rounded-lg">
            <Settings2 className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 mb-3">
              No modifier groups available
            </p>
            <p className="text-xs text-gray-400 mb-4">
              Create modifier groups first to add customization options
            </p>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              Create Modifier Group
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Settings2 className="w-4 h-4" />
          Customization Options
        </CardTitle>
        <p className="text-xs text-gray-500">
          Select modifier groups that customers can choose from
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {modifierGroups.map((group) => (
            <div key={group.id} className="flex items-start space-x-3">
              <Checkbox
                id={group.id}
                checked={selectedModifiers.includes(group.id)}
                onCheckedChange={(checked) =>
                  handleToggleModifier(group.id, checked as boolean)
                }
              />
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={group.id}
                    className="text-sm font-medium cursor-pointer"
                  >
                    {group.name}
                  </label>
                  {group.isRequired && (
                    <Badge variant="destructive" className="text-xs">
                      Required
                    </Badge>
                  )}
                </div>
                <div className="text-xs text-gray-500">
                  {group.minSelect === group.maxSelect ? (
                    <>Select exactly {group.minSelect}</>
                  ) : group.minSelect === 0 ? (
                    <>Select up to {group.maxSelect}</>
                  ) : (
                    <>
                      Select {group.minSelect} to {group.maxSelect}
                    </>
                  )}
                  {" • "}
                  {group.options.length} option
                  {group.options.length !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {selectedModifiers.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-gray-500">
              {selectedModifiers.length} modifier group
              {selectedModifiers.length !== 1 ? "s" : ""} selected
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
