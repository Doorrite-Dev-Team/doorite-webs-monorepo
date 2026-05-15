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
import { Loader2, Plus, Trash2, Info } from "lucide-react";
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

    const existingOptions = options
      .filter((opt) => !opt.isNew)
      .map((opt) => ({
        id: opt.id,
        name: opt.name,
        priceAdjustment: Number(opt.priceAdjustment),
        isAvailable: opt.isAvailable,
      }));

    const payload: UpdateModifierGroupPayload = {
      name: name.trim(),
      isRequired,
      minSelect,
      maxSelect,
      options: existingOptions,
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

  const hasNewOptions = options.some((opt) => opt.isNew && opt.name.trim());

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[480px] p-0 flex flex-col h-screen bg-background border-l border-border">
        <SheetHeader className="shrink-0 px-6 pt-6 pb-5 border-b border-border">
          <SheetTitle className="text-lg font-bold text-foreground tracking-tight">
            Edit Modifier Group
          </SheetTitle>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            Update the group name, selection rules, or options for this modifier
            set.
          </p>
        </SheetHeader>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden"
        >
          {/*<div className="flex-1">*/}
          <ScrollArea className="h-[calc(100%-6rem)] px-6">
            <div className="py-6 space-y-6">
              <FormSection
                step={1}
                title="Group Name"
                description="Displayed to customers above the list of options on your menu."
              >
                <FieldWrapper
                  label="Group name"
                  htmlFor="group-name"
                  required
                  hint='Keep it short and clear — e.g. "Spice Level" or "Protein Options"'
                >
                  <Input
                    id="group-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Spice Level, Add-ons, Protein Options"
                  />
                </FieldWrapper>
              </FormSection>

              <Divider />

              <FormSection
                step={2}
                title="Selection Rules"
                description="Control how many options a customer is allowed to pick at once."
              >
                <div className="flex items-center justify-between rounded-lg border border-border bg-muted/40 px-4 py-3.5">
                  <div className="space-y-0.5">
                    <p className="text-sm font-semibold text-foreground">
                      Required selection
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Customer must pick an option before adding to cart
                    </p>
                  </div>
                  <Switch
                    checked={isRequired}
                    onCheckedChange={setIsRequired}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3 mt-3">
                  <FieldWrapper
                    label="Minimum picks"
                    htmlFor="min-select"
                    hint="0 means the selection is optional"
                  >
                    <Input
                      id="min-select"
                      type="number"
                      min={0}
                      value={minSelect}
                      onChange={(e) => setMinSelect(Number(e.target.value))}
                    />
                  </FieldWrapper>
                  <FieldWrapper
                    label="Maximum picks"
                    htmlFor="max-select"
                    hint="Most options a customer may select"
                  >
                    <Input
                      id="max-select"
                      type="number"
                      min={1}
                      value={maxSelect}
                      onChange={(e) => setMaxSelect(Number(e.target.value))}
                    />
                  </FieldWrapper>
                </div>
              </FormSection>

              <Divider />

              <FormSection
                step={3}
                title="Options"
                description="Each individual choice a customer can select from this group."
                action={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addNewOption}
                    className="h-8 gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add option
                  </Button>
                }
              >
                <div className="rounded-lg border border-border overflow-hidden">
                  <div className="grid grid-cols-[1fr_112px_40px] bg-muted/60 border-b border-border px-3 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Option name
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Price adj. (₦)
                    </span>
                    <span />
                  </div>

                  <div className="divide-y divide-border">
                    {options.map((opt, idx) => (
                      <div
                        key={opt.id}
                        className="group grid grid-cols-[1fr_112px_40px] items-center bg-card px-3 py-2 hover:bg-muted/30 transition-colors"
                      >
                        <div className="flex items-center gap-2 pr-2">
                          <span className="text-[10px] font-bold text-muted-foreground/50 tabular-nums w-4 shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <Input
                            value={opt.name}
                            onChange={(e) =>
                              updateOption(opt.id, "name", e.target.value)
                            }
                            placeholder={
                              opt.isNew
                                ? `New option ${idx + 1}`
                                : "e.g. Extra Cheese"
                            }
                          />
                        </div>

                        <div className="relative">
                          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted-foreground select-none">
                            ₦
                          </span>
                          <Input
                            type="number"
                            value={opt.priceAdjustment}
                            onChange={(e) =>
                              updateOption(
                                opt.id,
                                "priceAdjustment",
                                e.target.value,
                              )
                            }
                            placeholder="0"
                            min={0}
                            className="pl-7"
                          />
                        </div>

                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeOption(opt.id, opt.isNew)}
                            disabled={
                              (!opt.isNew && deleteOptionMutation.isPending) ||
                              options.length <= 1
                            }
                            className="
                                h-7 w-7 flex items-center justify-center rounded-md
                                text-muted-foreground/40
                                opacity-0 group-hover:opacity-100
                                hover:bg-destructive/10 hover:text-destructive
                                disabled:pointer-events-none
                                transition-all
                              "
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {hasNewOptions && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={saveNewOptions}
                    disabled={addOptionMutation.isPending}
                    className="w-full h-9 text-xs font-semibold mt-2"
                  >
                    {addOptionMutation.isPending ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        Saving new options…
                      </span>
                    ) : (
                      "Save New Options"
                    )}
                  </Button>
                )}

                <div className="flex items-start gap-2 mt-2.5 rounded-lg bg-muted/50 border border-border px-3 py-2.5">
                  <Info className="w-3.5 h-3.5 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    <span className="font-semibold text-foreground">
                      Price adjustment
                    </span>{" "}
                    is added on top of the item&apos;s base price. Set to{" "}
                    <span className="font-semibold text-foreground">₦0</span> if
                    the option has no extra charge.
                  </p>
                </div>
              </FormSection>
            </div>
          </ScrollArea>
          {/*</div>*/}

          <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-border bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={updateGroupMutation.isPending}
              className="flex-1 h-10 text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateGroupMutation.isPending}
              className="flex-1 h-10 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {updateGroupMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating…
                </span>
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

/* ── MICRO-COMPONENTS ── */

function Divider() {
  return <div className="border-t border-border" />;
}

function FormSection({
  step,
  title,
  description,
  action,
  children,
}: {
  step: number;
  title: string;
  description: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-primary/10 text-[11px] font-extrabold text-primary tabular-nums mt-0.5">
            {step}
          </span>
          <div>
            <p className="text-sm font-bold text-foreground leading-tight">
              {title}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
              {description}
            </p>
          </div>
        </div>
        {action && <div className="shrink-0 mt-0.5">{action}</div>}
      </div>
      <div className="ml-9">{children}</div>
    </div>
  );
}

function FieldWrapper({
  label,
  htmlFor,
  required,
  hint,
  children,
}: {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label
        htmlFor={htmlFor}
        className="text-xs font-semibold text-foreground/80"
      >
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </Label>
      {children}
      {hint && (
        <p className="text-[11px] text-muted-foreground leading-snug">{hint}</p>
      )}
    </div>
  );
}
