"use client";

import * as React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@repo/ui/components/card";
import { Button } from "@repo/ui/components/button";
import { Badge } from "@repo/ui/components/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { CreditCard, Plus, Trash2, Loader2, AlertCircle } from "lucide-react";
import { toast } from "@repo/ui/components/sonner";
import { api } from "@/libs/api";

interface AddCardForm {
  cardNumber: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

const PaymentSection = () => {
  const queryClient = useQueryClient();
  // const { toast } = useToast();
  const [showAddDialog, setShowAddDialog] = React.useState(false);
  const [deleteId, setDeleteId] = React.useState<string | null>(null);

  const [cardForm, setCardForm] = React.useState<AddCardForm>({
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
    cardholderName: "",
  });

  // Fetch payment methods
  const { data: paymentMethods, isLoading } = useQuery({
    queryKey: ["payment-methods"],
    queryFn: api.fetchPaymentMethods,
  });

  // Add payment method mutation
  const addMutation = useMutation({
    mutationFn: api.addPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      setShowAddDialog(false);
      setCardForm({
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
        cardholderName: "",
      });
      toast.success("Payment method added successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Delete payment method mutation
  const deleteMutation = useMutation({
    mutationFn: api.deletePaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      setDeleteId(null);
      toast.success("Payment method removed");
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  // Set default mutation
  const setDefaultMutation = useMutation({
    mutationFn: api.setDefaultPaymentMethod,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["payment-methods"] });
      toast("Default payment method updated");
    },
  });

  const handleAddCard = () => {
    addMutation.mutate(cardForm);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Methods
              </CardTitle>
              <CardDescription>
                Manage your saved payment methods
              </CardDescription>
            </div>
            <Button
              size="sm"
              onClick={() => setShowAddDialog(true)}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Card
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : !paymentMethods || paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-gray-600 mb-4">No payment methods added yet</p>
              <Button onClick={() => setShowAddDialog(true)} variant="outline">
                Add Your First Card
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {paymentMethods.map((method) => (
                <div
                  key={method.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-8 rounded bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">
                          {method.brand} •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="secondary" className="text-xs">
                            Default
                          </Badge>
                        )}
                      </div>
                      {method.expiryMonth && method.expiryYear && (
                        <p className="text-sm text-gray-600">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!method.isDefault && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDefaultMutation.mutate(method.id)}
                        disabled={setDefaultMutation.isPending}
                      >
                        Set Default
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setDeleteId(method.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add Card Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Payment Method</DialogTitle>
            <DialogDescription>
              Enter your card details securely. We use industry-standard
              encryption.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                placeholder="John Doe"
                value={cardForm.cardholderName}
                onChange={(e) =>
                  setCardForm({ ...cardForm, cardholderName: e.target.value })
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                maxLength={19}
                value={cardForm.cardNumber}
                onChange={(e) =>
                  setCardForm({
                    ...cardForm,
                    cardNumber: formatCardNumber(e.target.value),
                  })
                }
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-2">
                <Label htmlFor="expiryMonth">Month</Label>
                <Input
                  id="expiryMonth"
                  placeholder="MM"
                  maxLength={2}
                  value={cardForm.expiryMonth}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, expiryMonth: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiryYear">Year</Label>
                <Input
                  id="expiryYear"
                  placeholder="YY"
                  maxLength={2}
                  value={cardForm.expiryYear}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, expiryYear: e.target.value })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  placeholder="123"
                  maxLength={4}
                  value={cardForm.cvv}
                  onChange={(e) =>
                    setCardForm({ ...cardForm, cvv: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg text-sm text-blue-900">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <p>
                Your card information is encrypted and secure. We never store
                your full card details.
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddDialog(false)}
              disabled={addMutation.isPending}
            >
              Cancel
            </Button>
            <Button onClick={handleAddCard} disabled={addMutation.isPending}>
              {addMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Card"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Payment Method?</DialogTitle>
            <DialogDescription>
              This payment method will be permanently removed from your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => deleteId && handleDelete(deleteId)}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                "Remove"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PaymentSection;
