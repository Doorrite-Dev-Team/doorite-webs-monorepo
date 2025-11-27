"use client";
import { Button } from "@repo/ui/components/button";
import { Card, CardContent } from "@repo/ui/components/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Badge } from "@repo/ui/components/badge";
import { useAtom } from "jotai";
import { userAtom } from "@/store/userAtom";
import { getInitials } from "@/libs/helper";

// Profile Section Component
export default function ProfileSection() {
  const [user] = useAtom(userAtom);
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative group">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary/70 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
              {user ? getInitials(user.name) : "G"}
            </div>
            <div className="absolute -bottom-1 -right-1 bg-primary rounded-full w-6 h-6 border-2 border-white shadow-sm"></div>
            <Button
              size="sm"
              className="absolute -top-1 -right-1 rounded-full w-8 h-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity bg-primary hover:bg-primary/90 text-white shadow-md"
              asChild
            >
              <Link href="/account/edit-photo">
                <Plus size={14} />
              </Link>
            </Button>
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">
              {user ? user.name : "Guest"}
            </h2>
            <p className="text-muted-foreground">{user && user.email}</p>
            <Badge
              className="mt-2 border-primary/20 text-primary bg-primary/10"
              variant="outline"
            >
              {user ? "member" : "Guest"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
