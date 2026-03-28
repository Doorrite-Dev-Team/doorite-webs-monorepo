"use client";

import { useState } from "react";
import { useSetAtom } from "jotai";
import { toast } from "@repo/ui/components/sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Input } from "@repo/ui/components/input";
import { Label } from "@repo/ui/components/label";
import { requestWithdrawalAtom, payoutInfoAtom } from "@/store/earningsAtom";
import { useAtomValue } from "jotai";
import { Loader2, Wallet, AlertCircle } from "lucide-react";

interface WithdrawalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WithdrawalModal({
  isOpen,
  onClose,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const payoutInfo = useAtomValue(payoutInfoAtom);
  const requestWithdrawal = useSetAtom(requestWithdrawalAtom);

  const availableBalance = payoutInfo.data.walletBalance;
  const minimumBalance = payoutInfo.data.minimumBalance;
  const isFriday = payoutInfo.data.isFriday;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const withdrawalAmount = Number(amount);

    if (withdrawalAmount < minimumBalance) {
      toast.error(`Minimum withdrawal is ₦${minimumBalance.toLocaleString()}`);
      return;
    }

    if (withdrawalAmount > availableBalance) {
      toast.error("Insufficient balance");
      return;
    }

    setIsLoading(true);
    try {
      const result = await requestWithdrawal({
        amount: withdrawalAmount,
        bankName,
        accountNumber,
        accountName,
      });

      if (result.ok) {
        toast.success(result.message);
        onClose();
        setAmount("");
        setBankName("");
        setAccountNumber("");
        setAccountName("");
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to submit withdrawal request");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAmountChange = (value: string) => {
    const numValue = Number(value);
    if (value === "" || (!isNaN(numValue) && numValue >= 0)) {
      setAmount(value);
    }
  };

  const setMaxAmount = () => {
    setAmount(availableBalance.toString());
  };

  const withdrawalFee = isFriday ? 0 : 100;
  const finalAmount = Number(amount) - withdrawalFee;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Request Withdrawal
          </DialogTitle>
          <DialogDescription>
            Withdraw funds from your wallet to your bank account
          </DialogDescription>
        </DialogHeader>

        <div className="bg-blue-50 rounded-lg p-4 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Available Balance</span>
            <span className="text-xl font-bold text-blue-600">
              ₦{availableBalance.toLocaleString()}
            </span>
          </div>
        </div>

        {isFriday && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700">
              Free withdrawal today!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="amount">Amount (₦)</Label>
            <div className="relative">
              <Input
                id="amount"
                type="text"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => handleAmountChange(e.target.value)}
                className="pr-20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={setMaxAmount}
                className="absolute right-1 top-1/2 -translate-y-1/2 h-8 text-xs text-blue-600 hover:text-blue-700"
              >
                MAX
              </Button>
            </div>
            {Number(amount) > 0 && (
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Fee: ₦{withdrawalFee.toLocaleString()}</span>
                <span>
                  You'll receive: ₦{Math.max(0, finalAmount).toLocaleString()}
                </span>
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              placeholder="e.g., First Bank"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              required
            />
          </div>

          <div>
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="10-digit account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              maxLength={10}
              required
            />
          </div>

          <div>
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              placeholder="As on bank account"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              required
            />
          </div>

          <div className="bg-gray-50 rounded-lg p-3 text-xs text-gray-600">
            <p>• Minimum withdrawal: ₦{minimumBalance.toLocaleString()}</p>
            <p>
              • {isFriday ? "Free withdrawal today!" : "₦100 fee on weekdays"}
            </p>
            <p>• Processing: 24-48 hours</p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading || !amount || Number(amount) < minimumBalance}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Withdraw"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
