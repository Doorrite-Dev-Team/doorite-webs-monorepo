export default function WalletBalanceCard() {
  return (
    <section className="relative rounded-3xl bg-primary text-white p-6 shadow-lg shadow-primary/20">
      <div className="flex flex-col gap-4">
        <div>
          <p className="text-sm opacity-90">Available Balance</p>
          <h1 className="text-4xl font-extrabold">₦25,400.00</h1>
        </div>

        <div className="flex items-center justify-between border-t border-white/20 pt-4">
          <div>
            <p className="text-xs opacity-80">Pending Earnings</p>
            <p className="font-bold">₦4,200.00</p>
            <span className="text-[10px] opacity-70">
              Est. release: Tomorrow
            </span>
          </div>

          <button className="bg-white text-primary px-5 py-2.5 rounded-full text-sm font-bold hover:scale-95 transition">
            Quick Withdraw
          </button>
        </div>
      </div>
    </section>
  );
}
