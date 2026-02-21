"use client";

import Link from "next/link";
import { Card, CardContent } from "@repo/ui/components/card";
import { LucideIcon } from "lucide-react";
import { Route } from "next";

interface CategoryCardProps {
  href: string;
  title: string;
  description: string;
  Icon: LucideIcon;
  color: string;
}

export default function CategoryCard({
  href,
  title,
  description,
  Icon,
  color,
}: CategoryCardProps) {
  return (
    <Link href={href as Route<string>} className="block group">
      <Card className="border-2 border-transparent hover:border-primary/20 transition-all duration-300 shadow-sm hover:shadow-md">
        <CardContent className="p-4">
          <div
            className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
          >
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
          <p className="text-xs text-gray-600">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
}
