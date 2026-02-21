"use client";
import { Button } from "@repo/ui/components/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@repo/ui/components/card";
import { Trash2 } from "lucide-react";
import { SignOutDialog } from "./Dialogs";
import Link from "next/link";

// Account Actions Section
const AccountActionsSection = () => {
  return (
    <Card className="border-destructive/20 bg-destructive/5">
      <CardHeader>
        <CardTitle className="text-destructive flex items-center gap-2">
          <Trash2 size={20} />
          Account Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <SignOutDialog />
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
          asChild
        >
          <Link href="/account/delete">
            <>
              <Trash2 size={16} className="mr-2" />
              Delete Account
            </>
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default AccountActionsSection;
