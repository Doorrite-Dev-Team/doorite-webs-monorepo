interface WithCountProps {
  count: number;
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  className?: string;
}

// --------------------- Small helpers ---------------------
export const WithCount: React.FC<WithCountProps> = ({
  count,
  Icon,
  className = "",
}: WithCountProps) => {
  return (
    <div className={`relative inline-block items-center ${className}`}>
      <Icon size={24} />
      {count > 0 && (
        <span className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[0.65rem] font-bold text-white ring-2 ring-white shadow-sm">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </div>
  );
};