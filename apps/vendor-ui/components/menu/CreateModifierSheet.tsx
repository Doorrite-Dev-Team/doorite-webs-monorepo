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
import { Textarea } from "@repo/ui/components/textarea";
import { toast } from "@repo/ui/components/sonner";
import { ScrollArea } from "@repo/ui/components/scroll-area";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2, Minus, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import {
  modifierApi,
  type CreateModifierGroupPayload,
} from "@/libs/api/modifier-api";

interface ModifierOption {
  id: string;
  name: string;
  priceAdjustment: number;
}

interface CreateModifierSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateModifierSheet({
  open,
  onOpenChange,
}: CreateModifierSheetProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [minSelect, setMinSelect] = useState(1);
  const [maxSelect, setMaxSelect] = useState(1);
  const [options, setOptions] = useState<ModifierOption[]>([
    { id: "1", name: "", priceAdjustment: 0 },
  ]);

  const createGroupMutation = useMutation({
    mutationFn: (payload: CreateModifierGroupPayload) =>
      modifierApi.createModifierGroup(payload),
    onSuccess: () => {
      toast.success("Modifier group created successfully");
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
      handleClose();
    },
    onError: (error) => {
      toast.error("Failed to create modifier group", {
        description: error.message || "Please try again",
      });
    },
  });

  const handleClose = () => {
    setName("");
    setIsRequired(false);
    setMinSelect(1);
    setMaxSelect(1);
    setOptions([{ id: "1", name: "", priceAdjustment: 0 }]);
    onOpenChange(false);
  };

  const addOption = () => {
    const newId = Date.now().toString();
    setOptions([...options, { id: newId, name: "", priceAdjustment: 0 }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 1) {
      setOptions(options.filter((opt) => opt.id !== id));
    }
  };

  const updateOption = (
    id: string,
    field: keyof ModifierOption,
    value: string | number,
  ) => {
    setOptions(
      options.map((opt) => (opt.id === id ? { ...opt, [field]: value } : opt)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }

    const validOptions = options.filter((opt) => opt.name.trim());
    if (validOptions.length === 0) {
      toast.error("At least one option is required");
      return;
    }

    if (minSelect < 0 || maxSelect < 0 || minSelect > maxSelect) {
      toast.error("Invalid selection range");
      return;
    }

    const payload: CreateModifierGroupPayload = {
      name: name.trim(),
      isRequired,
      minSelect,
      maxSelect,
      options: validOptions.map((opt) => ({
        name: opt.name.trim(),
        priceAdjustment: Number(opt.priceAdjustment),
      })),
    };

    createGroupMutation.mutate(payload);
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-xl p-0 flex flex-col">
        <SheetHeader className="px-6 pt-6 pb-4">
          <SheetTitle>Create Modifier Group</SheetTitle>
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
              <Label>Options *</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addOption}
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
                      placeholder={`Option ${index + 1}`}
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
                    onClick={() => removeOption(option.id)}
                    disabled={options.length === 1}
                    className="h-10 w-10 p-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
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
              disabled={createGroupMutation.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={createGroupMutation.isPending}
            >
              {createGroupMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Group"
              )}
            </Button>
          </div>
        </form>
      </SheetContent>
    </Sheet>
  );
}
