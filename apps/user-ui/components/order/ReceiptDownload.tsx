"use client";

import { Button } from "@repo/ui/components/button";
import { Download } from "lucide-react";
import { jsPDF } from "jspdf";
import { toast } from "@repo/ui/components/sonner";

interface ReceiptDownloadProps {
  order: Order;
}

export function ReceiptDownload({ order }: ReceiptDownloadProps) {
  const generatePDF = () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      let y = 20;

      // Header
      doc.setFontSize(24);
      doc.setTextColor(13, 31, 22); // primary dark green
      doc.text("Doorrite", pageWidth / 2, y, { align: "center" });

      doc.setFontSize(10);
      doc.setTextColor(100);
      y += 8;
      doc.text("Food & Grocery Delivery", pageWidth / 2, y, {
        align: "center",
      });
      y += 5;
      doc.text("Ilorin, Kwara State, Nigeria", pageWidth / 2, y, {
        align: "center",
      });

      // Divider
      y += 10;
      doc.setDrawColor(200);
      doc.line(20, y, pageWidth - 20, y);

      // Order Info
      y += 15;
      doc.setFontSize(14);
      doc.setTextColor(0);
      doc.text("Order Receipt", 20, y);

      y += 10;
      doc.setFontSize(10);
      doc.setTextColor(80);
      doc.text(`Order ID: #${order.id.slice(-8).toUpperCase()}`, 20, y);
      y += 6;
      doc.text(
        `Date: ${new Date(order.placedAt).toLocaleDateString("en-NG", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}`,
        20,
        y,
      );
      y += 6;
      doc.text(`Status: ${order.status}`, 20, y);
      y += 6;
      doc.text(`Payment: ${order.paymentStatus}`, 20, y);

      // Items Section
      y += 15;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Items", 20, y);

      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(60);

      let subtotal = 0;
      order.items.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        doc.text(`${item.quantity}x ${item.name}`, 20, y);
        doc.text(`₦${itemTotal.toLocaleString()}`, pageWidth - 20, y, {
          align: "right",
        });
        y += 6;
      });

      // Delivery Fee (estimate or get from order if available)
      const deliveryFee =
        (order as Order & { deliveryFee?: number }).deliveryFee ?? 0;
      const discountAmount =
        (order as Order & { discountAmount?: number }).discountAmount ?? 0;
      const totalAmount = subtotal + deliveryFee - discountAmount;

      // Totals
      y += 10;
      doc.setDrawColor(200);
      doc.line(20, y, pageWidth - 20, y);

      y += 8;
      doc.setTextColor(80);
      doc.text("Subtotal", 20, y);
      doc.text(`₦${subtotal.toLocaleString()}`, pageWidth - 20, y, {
        align: "right",
      });

      y += 6;
      doc.text("Delivery Fee", 20, y);
      doc.text(`₦${deliveryFee.toLocaleString()}`, pageWidth - 20, y, {
        align: "right",
      });

      if (discountAmount > 0) {
        y += 6;
        doc.setTextColor(22, 163, 74); // green
        doc.text("Discount", 20, y);
        doc.text(`-₦${discountAmount.toLocaleString()}`, pageWidth - 20, y, {
          align: "right",
        });
      }

      y += 8;
      doc.setDrawColor(200);
      doc.line(20, y, pageWidth - 20, y);

      y += 8;
      doc.setFontSize(12);
      doc.setTextColor(0);
      doc.text("Total", 20, y);
      doc.text(`₦${totalAmount.toLocaleString()}`, pageWidth - 20, y, {
        align: "right",
      });

      // Delivery Address
      y += 15;
      doc.setFontSize(12);
      doc.text("Delivery Address", 20, y);

      y += 8;
      doc.setFontSize(10);
      doc.setTextColor(60);
      const addr = order.deliveryAddress;
      const addrText = addr.address;
      const lines = doc.splitTextToSize(addrText, pageWidth - 40);
      doc.text(lines, 20, y);
      y += lines.length * 5;

      if (addr.state) {
        doc.text(addr.state, 20, y);
        y += 5;
      }
      if (addr.country) {
        doc.text(addr.country, 20, y);
      }

      // Footer
      y += 15;
      doc.setDrawColor(200);
      doc.line(20, y, pageWidth - 20, y);

      y += 10;
      doc.setFontSize(9);
      doc.setTextColor(120);
      doc.text("Thank you for ordering with Doorrite!", pageWidth / 2, y, {
        align: "center",
      });
      y += 5;
      doc.text("Questions? Contact doorrite.info@gmail.com", pageWidth / 2, y, {
        align: "center",
      });

      // Save
      doc.save(`doorrite-receipt-${order.id.slice(-8).toUpperCase()}.pdf`);
      toast.success("Receipt downloaded");
    } catch {
      toast.error("Failed to generate receipt");
    }
  };

  return (
    <Button variant="outline" size="sm" onClick={generatePDF} className="gap-2">
      <Download className="w-4 h-4" />
      Download Receipt
    </Button>
  );
}
