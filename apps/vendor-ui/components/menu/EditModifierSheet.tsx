"use client";

import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@repo/ui/components/sheet";
import { Switch } from "@repo/ui/components/switch";
import { toast } from "@repo/ui/components/sonner";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  modifierApi,
  type ModifierGroup,
  type UpdateModifierGroupPayload,
  type CreateModifierOptionPayload,
} from "@/libs/api/modifier-api";

interface EditModifierSheetProps {
  group: ModifierGroup;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function EditModifierSheet({
  group,
  open,
  onOpenChange,
}: EditModifierSheetProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [minSelect, setMinSelect] = useState(1);
  const [maxSelect, setMaxSelect] = useState(1);
  const [options, setOptions] = useState(
    group.options.map((opt) => ({ ...opt, isNew: false })),
  );

  const updateGroupMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateModifierGroupPayload;
    }) => modifierApi.updateModifierGroup(id, payload),
    onSuccess: () => {
      toast.success("Modifier group updated successfully");
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to update modifier group", {
        description: error.message || "Please try again",
      });
    },
  });

  const addOptionMutation = useMutation({
    mutationFn: ({
      groupId,
      payload,
    }: {
      groupId: string;
      payload: CreateModifierOptionPayload;
    }) => modifierApi.createModifierOption(groupId, payload),
    onSuccess: () => {
      toast.success("Option added successfully");
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
    },
    onError: (error) => {
      toast.error("Failed to add option", {
        description: error.message || "Please try again",
      });
    },
  });

  const deleteOptionMutation = useMutation({
    mutationFn: ({
      groupId,
      optionId,
    }: {
      groupId: string;
      optionId: string;
    }) => modifierApi.deleteModifierOption(groupId, optionId),
    onSuccess: () => {
      toast.success("Option deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
    },
    onError: (error) => {
      toast.error("Failed to delete option", {
        description: error.message || "Please try again",
      });
    },
  });

  useEffect(() => {
    if (open && group) {
      setName(group.name);
      setIsRequired(group.isRequired);
      setMinSelect(group.minSelect);
      setMaxSelect(group.maxSelect);
      setOptions(group.options.map((opt) => ({ ...opt, isNew: false })));
    }
  }, [open, group]);

  const handleClose = () => {
    onOpenChange(false);
  };

  const addNewOption = () => {
    const newOption = {
      id: `new-${Date.now()}`,
      name: "",
      priceAdjustment: 0,
      isNew: true as const,
      isAvailable: true,
      modifierGroupId: group.id,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setOptions([...options, newOption]);
  };

  const removeOption = (id: string, isNew: boolean) => {
    if (!isNew) {
      deleteOptionMutation.mutate({ groupId: group.id, optionId: id });
    } else {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const updateOption = (id: string, field: string, value: string | number) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }

    const payload: UpdateModifierGroupPayload = {
      name: name.trim(),
      isRequired,
      minSelect,
      maxSelect,
    };

    updateGroupMutation.mutate({ id: group.id, payload });
  };

  const saveNewOptions = () => {
    const newOptions = options.filter((opt) => opt.isNew && opt.name.trim());

    newOptions.forEach((option) => {
      const payload: CreateModifierOptionPayload = {
        name: option.name.trim(),
        priceAdjustment: Number(option.priceAdjustment),
      };
      addOptionMutation.mutate({ groupId: group.id, payload });
    });
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Edit Modifier Group</SheetTitle>
        </SheetHeader>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 overflow-hidden">
          <ScrollArea className="flex-1 px-6">
            <div className="space-y-6 pb-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Group Name *</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., Protein Options, Spice Level"
                className="mt-1"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Required Selection</Label>
                <p className="text-sm text-gray-500">
                  Customers must select at least one option
                </p>
              </div>
              <Switch checked={isRequired} onCheckedChange={setIsRequired} />
            </div>
          </div>

          {/* Selection Limits */}
          <div className="space-y-4">
            <Label>Selection Limits</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="minSelect">Minimum</Label>
                <Input
                  id="minSelect"
                  type="number"
                  min="0"
                  value={minSelect}
                  onChange={(e) => setMinSelect(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="maxSelect">Maximum</Label>
                <Input
                  id="maxSelect"
                  type="number"
                  min="1"
                  value={maxSelect}
                  onChange={(e) => setMaxSelect(Number(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
          </div>

          {/* Options */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addNewOption}
                className="flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Add Option
              </Button>
            </div>

            <div className="space-y-3">
              {options.map((option, index) => (
                <div key={option.id} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Input
                      value={option.name}
                      onChange={(e) =>
                        updateOption(option.id, "name", e.target.value)
                      }
                      placeholder={
                        option.isNew
                          ? `New Option ${index + 1}`
                          : `Option ${index + 1}`
                      }
                    />
                  </div>
                  <div className="w-24">
                    <Input
                      type="number"
                      value={option.priceAdjustment}
                      onChange={(e) =>
                        updateOption(
                          option.id,
                          "priceAdjustment",
                          e.target.value,
                        )
                      }
                      placeholder="0"
                      min="0"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => removeOption(option.id, option.isNew)}
                    className="h-10 w-10 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            {/* Save New Options Button */}
            {options.some((opt) => opt.isNew && opt.name.trim()) && (
              <Button
                type="button"
                variant="secondary"
                onClick={saveNewOptions}
                className="w-full"
                disabled={addOptionMutation.isPending}
              >
                {addOptionMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving New Options...
                  </>
                ) : (
                  "Save New Options"
                )}
              </Button>
            )}
          </div>

            </div>
          </ScrollArea>

          {/* Actions */}
          <div className="flex items-center gap-3 px-6 py-4 border-t bg-gray-50/50">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="flex-1"
              disabled={updateGroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={updateGroupMutation.isPending}
            >
              {updateGroupMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Group"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
