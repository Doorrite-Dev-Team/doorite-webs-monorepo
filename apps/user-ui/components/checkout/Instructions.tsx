"use client";

import * as React from "react";
import { MessageSquare } from "lucide-react";

import { Card, CardContent } from "@repo/ui/components/card";
import { Label } from "@repo/ui/components/label";
import { Textarea } from "@repo/ui/components/textarea";

interface DeliveryInstructionsProps {
  instructions: string;
  onInstructionsChange: (instructions: string) => void;
}

export default function DeliveryInstructions({
  instructions,
  onInstructionsChange,
}: DeliveryInstructionsProps) {
  return (
    <Card>
      <CardContent className="p-4 sm:p-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            <Label
              htmlFor="delivery-instructions"
              className="text-sm sm:text-base font-semibold text-gray-900"
            >
              Delivery Instructions
            </Label>
          </div>

          <Textarea
            id="delivery-instructions"
            placeholder="e.g., Call when you arrive, use the back gate, white building on the left..."
            value={instructions}
            onChange={(e) => onInstructionsChange(e.target.value)}
            className="min-h-[80px] sm:min-h-[100px] resize-none text-sm sm:text-base"
            maxLength={200}
          />

          <p className="text-xs text-gray-500">
            Optional but helpful for riders to find you easily (
            {instructions.length}/200)
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
