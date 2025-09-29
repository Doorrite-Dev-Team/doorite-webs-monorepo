"use client";

import { Card, CardContent } from "@repo/ui/components/card";
import Link from "next/link";
import { LucideIcon } from "lucide-react";

export function CategoryCard({
  href,
  title,
  Icon,
  color,
  description,
}: {
  href: string;
  title: string;
  color: string;
  Icon: LucideIcon;
  description?: string;
}) {
  return (
    <Link href={href} className="block">
      <Card
        className={`border hover:shadow-lg hover:scale-105 transition-all duration-200 cursor-pointer ${color}`}
      >
        <CardContent className="p-4 text-center">
          <div className="w-12 h-12 bg-white/80 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-sm">
            <Icon size={22} className={color.split(" ")[1]} />
          </div>
          <h3 className="font-semibold text-sm mb-1">{title}</h3>
          <p className="text-xs opacity-75 leading-tight">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
