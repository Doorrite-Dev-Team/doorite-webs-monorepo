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
      window.dispatchEvent(new Event("refetch-modifiers"));
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
    setOptions([
      ...options,
      { id: Date.now().toString(), name: "", priceAdjustment: 0 },
    ]);
  };

  const removeOption = (id: string) => {
    if (options.length > 1) setOptions(options.filter((o) => o.id !== id));
  };

  const updateOption = (
    id: string,
    field: keyof ModifierOption,
    value: string | number,
  ) => {
    setOptions(
      options.map((o) => (o.id === id ? { ...o, [field]: value } : o)),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Group name is required");
      return;
    }
    const validOptions = options.filter((o) => o.name.trim());
    if (validOptions.length === 0) {
      toast.error("At least one option is required");
      return;
    }
    if (minSelect < 0 || maxSelect < 0 || minSelect > maxSelect) {
      toast.error("Invalid selection range");
      return;
    }
    createGroupMutation.mutate({
      name: name.trim(),
      isRequired,
      minSelect,
      maxSelect,
      options: validOptions.map((o) => ({
        name: o.name.trim(),
        priceAdjustment: Number(o.priceAdjustment),
      })),
    });
  };

  return (
    <Sheet open={open} onOpenChange={handleClose}>
      <SheetContent className="w-full sm:max-w-[480px] p-0 flex flex-col h-screen bg-background border-l border-border">
        {/* ── HEADER ── */}
        <SheetHeader className="shrink-0 px-6 pt-6 pb-5 border-b border-border">
          <SheetTitle className="text-lg font-bold text-foreground tracking-tight">
            Create Modifier Group
          </SheetTitle>
          <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed">
            Build a set of choices customers can pick from — like size, spice
            level, or toppings.
          </p>
        </SheetHeader>

        {/* ── FORM ── */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col flex-1 overflow-hidden h-full"
        >
          {/*<div className="flex-1">*/}
          <ScrollArea className="h-[calc(100%-5rem)] px-6">
            <div className="py-6 space-y-6">
              {/* ═══ SECTION 1 — GROUP NAME ═══ */}
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

              {/* ═══ SECTION 2 — SELECTION RULES ═══ */}
              <FormSection
                step={2}
                title="Selection Rules"
                description="Control how many options a customer is allowed to pick at once."
              >
                {/* Required toggle */}
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

                {/* Min / Max */}
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

              {/* ═══ SECTION 3 — OPTIONS ═══ */}
              <FormSection
                step={3}
                title="Options"
                description="Each individual choice a customer can select from this group."
                action={
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    className="h-8 gap-1.5 text-xs font-semibold text-primary border-primary/30 hover:bg-primary/5 hover:text-primary"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Add option
                  </Button>
                }
              >
                {/* Table container */}
                <div className="rounded-lg border border-border overflow-hidden">
                  {/* Column headers */}
                  <div className="grid grid-cols-[1fr_112px_40px] bg-muted/60 border-b border-border px-3 py-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Option name
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                      Price adj. (₦)
                    </span>
                    <span />
                  </div>

                  {/* Option rows */}
                  <div className="divide-y divide-border">
                    {options.map((opt, idx) => (
                      <div
                        key={opt.id}
                        className="group grid grid-cols-[1fr_112px_40px] items-center bg-card px-3 py-2 hover:bg-muted/30 transition-colors"
                      >
                        {/* Name */}
                        <div className="flex items-center gap-2 pr-2">
                          <span className="text-[10px] font-bold text-muted-foreground/50 tabular-nums w-4 shrink-0">
                            {String(idx + 1).padStart(2, "0")}
                          </span>
                          <Input
                            value={opt.name}
                            onChange={(e) =>
                              updateOption(opt.id, "name", e.target.value)
                            }
                            placeholder="e.g. Extra Cheese"
                          />
                        </div>

                        {/* Price */}
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

                        {/* Delete */}
                        <div className="flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeOption(opt.id)}
                            disabled={options.length === 1}
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

                {/* Footer hint */}
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

          {/* ── FOOTER ── */}
          <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-border bg-background">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={createGroupMutation.isPending}
              className="flex-1 h-10 text-sm font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createGroupMutation.isPending}
              className="flex-1 h-10 text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {createGroupMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating…
                </span>
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

/* ─────────────────────────────────────────────────
   MICRO-COMPONENTS
───────────────────────────────────────────────── */

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
