"use client";

import { MenuItemProps } from "@/types/account";
import { Shield, ChevronRight } from "lucide-react";
import { Badge } from "@repo/ui/components/badge";
import { useRouter } from "next/navigation";
import { Route } from "next";

// Menu Item Component
const MenuItem = ({
  icon: Icon,
  title,
  subtitle,
  onClick,
  badge,
  isSecure = false,
  href,
}: MenuItemProps) => {
  const router = useRouter();

  const handleClick = (): void => {
    if (href) {
      router.push(href as Route<string>);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center justify-between p-4 rounded-lg hover:bg-primary/5 cursor-pointer transition-colors group border border-transparent hover:border-primary/10"
    >
      <div className="flex items-center gap-4">
        <div className="bg-primary/10 rounded-lg p-3 group-hover:bg-primary/15 transition-colors border border-primary/10">
          <Icon size={20} className="text-primary" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <p className="font-medium">{title}</p>
            {isSecure && <Shield size={14} className="text-primary" />}
            {badge && <Badge variant="secondary">{badge}</Badge>}
          </div>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      <ChevronRight
        size={16}
        className="text-muted-foreground group-hover:text-foreground transition-colors"
      />
    </div>
  );
};

export default MenuItem;
