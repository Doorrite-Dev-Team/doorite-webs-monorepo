interface Props {
  title: string;
  time: string;
  amount: string;
  positive?: boolean;
}

export default function TransactionItem({
  title,
  time,
  amount,
  positive = true,
}: Props) {
  return (
    <div className="flex items-center justify-between bg-white dark:bg-surface-dark p-4 rounded-2xl shadow-sm">
      <div>
        <p className="font-bold text-sm">{title}</p>
        <p className="text-xs text-slate-400">{time}</p>
      </div>
      <p className={`font-bold ${positive ? "text-primary" : ""}`}>
        {amount}
      </p>
    </div>
  );
}
