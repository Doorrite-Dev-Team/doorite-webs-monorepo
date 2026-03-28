"use client";

import { modifierApi, type ModifierGroup } from "@/libs/api/modifier-api";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Input } from "@repo/ui/components/input";
import { Skeleton } from "@repo/ui/components/skeleton";
import { toast } from "@repo/ui/components/sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Search, Settings2 } from "lucide-react";
import { useState } from "react";
import CreateModifierSheet from "./CreateModifierSheet";
import EditModifierSheet from "./EditModifierSheet";
import ModifierGroupCard from "./ModifierGroupCard";
import { deriveError } from "@/libs/utils/errorHandler";

export default function ModifiersTab() {
  const queryClient = useQueryClient();
  const [showCreateSheet, setShowCreateSheet] = useState(false);
  const [editingGroup, setEditingGroup] = useState<ModifierGroup | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["modifier-groups"],
    queryFn: modifierApi.getModifierGroups,
    staleTime: 5 * 60 * 1000,
  });

  const deleteGroupMutation = useMutation({
    mutationFn: modifierApi.deleteModifierGroup,
    onSuccess: () => {
      toast.success("Modifier group deleted");
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
    },
    onError: (error) => {
      const message = deriveError(error);
      toast.error("Failed to delete group", {
        description: message,
      });
    },
  });

  const handleDelete = (id: string) => {
    if (
      confirm("Are you sure? This will remove the group from all products.")
    ) {
      deleteGroupMutation.mutate(id);
    }
  };

  const modifierGroups = data?.modifierGroups || [];
  const filteredGroups = modifierGroups.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (isError) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="flex flex-col items-center justify-center py-16">
          <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <Settings2 className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Failed to load modifiers
          </h3>
          <p className="text-sm text-gray-600 text-center mb-6 max-w-sm">
            {error?.message || "Something went wrong"}
          </p>
          <Button onClick={() => refetch()} variant="outline">
            <Loader2 className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div>
        <div className="mb-6">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-full max-w-sm" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="pb-24">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Modifier Groups</h2>
            <p className="text-sm text-gray-500 mt-1">
              Create reusable customization options for your products
            </p>
          </div>
          <Button
            onClick={() => setShowCreateSheet(true)}
            className="hidden md:flex bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Group
          </Button>
        </div>

        {modifierGroups.length > 0 && (
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        )}
      </div>

      {modifierGroups.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center mb-4">
              <Settings2 className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No modifier groups yet
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
              Create modifier groups to add customization options like protein
              choices, spice levels, or extras.
            </p>
            <Button
              onClick={() => setShowCreateSheet(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Your First Group
            </Button>
          </CardContent>
        </Card>
      ) : filteredGroups.length === 0 && searchQuery ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No groups found
            </h3>
            <p className="text-sm text-gray-500 text-center mb-6 max-w-sm">
              No groups match <q>{searchQuery}</q>
            </p>
            <Button variant="outline" onClick={() => setSearchQuery("")}>
              Clear Search
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredGroups.map((group) => (
            <ModifierGroupCard
              key={group.id}
              group={group}
              onEdit={setEditingGroup}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Button
        onClick={() => setShowCreateSheet(true)}
        className="md:hidden fixed bottom-20 right-6 w-14 h-14 rounded-full shadow-lg bg-blue-600 hover:bg-blue-700 p-0"
        size="icon"
      >
        <Plus className="w-6 h-6" />
      </Button>

      <CreateModifierSheet
        open={showCreateSheet}
        onOpenChange={setShowCreateSheet}
      />

      {editingGroup && (
        <EditModifierSheet
          group={editingGroup}
          open={!!editingGroup}
          onOpenChange={(open) => !open && setEditingGroup(null)}
        />
      )}
    </div>
  );
}
