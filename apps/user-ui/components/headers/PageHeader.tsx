"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { Badge } from "@repo/ui/components/badge";
import { Button } from "@repo/ui/components/button";

interface PageHeaderProps {
  title: string;
  showBackButton?: boolean;
  rightContent?: ReactNode;
  sticky?: boolean;
  badge?: number;
}

export function PageHeader({
  title,
  showBackButton = true,
  rightContent,
  sticky = false,
  badge,
}: PageHeaderProps) {
  const router = useRouter();

  const stickyClass = sticky
    ? "sticky top-16 z-20 bg-white/80 backdrop-blur-lg border-b shadow-sm"
    : "";

  return (
    <div className={stickyClass}>
      <div className="container max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-3">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 -ml-2 pl-2 pr-3 h-auto min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Back</span>
            </Button>
          ) : (
            <div className="w-20" />
          )}

          <div className="flex items-center gap-2 min-w-0">
            <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">
              {title}
            </h1>
            {badge !== undefined && badge > 0 && (
              <Badge variant="secondary" className="shrink-0">
                {badge}
              </Badge>
            )}
          </div>

          {rightContent ? (
            <div className="shrink-0">{rightContent}</div>
          ) : (
            <div className="w-20" />
          )}
        </div>
      </div>
    </div>
  );
}

interface PageHeaderWithActionsProps {
  title: string;
  showBackButton?: boolean;
  actions?: ReactNode;
  sticky?: boolean;
}

export function PageHeaderWithActions({
  title,
  showBackButton = true,
  actions,
  sticky = false,
}: PageHeaderWithActionsProps) {
  const router = useRouter();

  const stickyClass = sticky
    ? "sticky top-16 z-20 bg-white/80 backdrop-blur-lg border-b shadow-sm"
    : "";

  return (
    <div className={stickyClass}>
      <div className="container max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {showBackButton ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 -ml-2 pl-2 pr-3 h-auto min-h-[44px]"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium hidden sm:inline">Back</span>
            </Button>
          ) : (
            <div />
          )}

          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate absolute left-1/2 -translate-x-1/2">
            {title}
          </h1>

          {actions ? (
            <div className="flex items-center gap-2">{actions}</div>
          ) : (
            <div className="w-10" />
          )}
        </div>
      </div>
    </div>
  );
}
