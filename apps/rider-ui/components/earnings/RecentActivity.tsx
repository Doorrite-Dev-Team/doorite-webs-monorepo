import TransactionItem from "./TransactionItem";

export default function RecentActivity() {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex justify-between px-1">
        <h3 className="text-lg font-bold">Recent Activity</h3>
        <button className="text-primary text-sm font-semibold">All</button>
      </div>

      <TransactionItem
        title="Order #2991 - Food"
        time="Today, 2:30 PM"
        amount="+₦1,200"
      />

      <TransactionItem
        title="Withdrawal to GTBank"
        time="Yesterday, 9:00 AM"
        amount="-₦10,000"
        positive={false}
      />

      <TransactionItem
        title="Weekly Bonus"
        time="Nov 12, 10:00 AM"
        amount="+₦5,000"
      />
    </section>
  );
}
