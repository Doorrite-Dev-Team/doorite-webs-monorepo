"use client";

import { useState } from "react";
import { useAtom } from "jotai";
import { activeOrderAtom } from "@/store/orderAtom";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@repo/ui/components/dialog";
import { Button } from "@repo/ui/components/button";
import { Textarea } from "@repo/ui/components/textarea";
import { Label } from "@repo/ui/components/label";
import { CheckCircle, Camera, Upload } from "lucide-react";
import { toast } from "@repo/ui/components/sonner";

interface DeliveryCompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function DeliveryCompletionModal({
    isOpen,
    onClose
}: DeliveryCompletionModalProps) {
    const [activeOrder, setActiveOrder] = useAtom(activeOrderAtom);
    const [notes, setNotes] = useState("");
    const [proofImage, setProofImage] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setProofImage(e.target.files[0]);
        }
    };

    const handleComplete = async () => {
        if (!activeOrder) return;

        setIsSubmitting(true);

        try {
            // Simulate API call to complete delivery
            await new Promise(resolve => setTimeout(resolve, 1000));

            // TODO: Call actual API endpoint
            // await apiClient.post(`/orders/${activeOrder.id}/complete`, {
            //   notes,
            //   proofImage: proofImage ? await uploadImage(proofImage) : null
            // });

            toast.success("Delivery completed successfully! 🎉", {
                description: `You earned $${activeOrder.totalAmount?.toFixed(2)}`
            });

            // Clear active order
            setActiveOrder(null);

            // Reset form
            setNotes("");
            setProofImage(null);

            onClose();
        } catch (error) {
            toast.error("Failed to complete delivery", {
                description: "Please try again"
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!activeOrder) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Complete Delivery
                    </DialogTitle>
                    <DialogDescription>
                        Confirm delivery to {activeOrder.customerName || "customer"}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    {/* Order Summary */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="font-semibold text-gray-900">{activeOrder.restaurantName}</p>
                        <p className="text-sm text-gray-600 mt-1">{activeOrder.dropoffLocation.address}</p>
                        <p className="text-2xl font-bold text-green-600 mt-2">
                            ${activeOrder.totalAmount?.toFixed(2)}
                        </p>
                    </div>

                    {/* Proof of Delivery (Optional) */}
                    <div>
                        <Label htmlFor="proof-image">Proof of Delivery (Optional)</Label>
                        <div className="mt-2">
                            {proofImage ? (
                                <div className="relative">
                                    <img
                                        src={URL.createObjectURL(proofImage)}
                                        alt="Proof of delivery"
                                        className="w-full h-48 object-cover rounded-lg"
                                    />
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={() => setProofImage(null)}
                                    >
                                        Remove
                                    </Button>
                                </div>
                            ) : (
                                <label
                                    htmlFor="proof-image"
                                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                                >
                                    <Camera className="w-8 h-8 text-gray-400 mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload photo</p>
                                    <input
                                        id="proof-image"
                                        type="file"
                                        accept="image/*"
                                        capture="environment"
                                        className="hidden"
                                        onChange={handleImageUpload}
                                    />
                                </label>
                            )}
                        </div>
                    </div>

                    {/* Delivery Notes */}
                    <div>
                        <Label htmlFor="notes">Delivery Notes (Optional)</Label>
                        <Textarea
                            id="notes"
                            placeholder="Add any notes about the delivery..."
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="mt-2 min-h-[80px]"
                        />
                    </div>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleComplete}
                        disabled={isSubmitting}
                        className="bg-green-600 hover:bg-green-700"
                    >
                        {isSubmitting ? "Completing..." : "Complete Delivery"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
