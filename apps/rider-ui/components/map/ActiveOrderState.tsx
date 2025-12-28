export default function ActiveOrderState() {
  return (
    <div className="absolute bottom-0 inset-x-0 z-30 bg-white dark:bg-[#1e2e26] rounded-t-3xl p-6 shadow-2xl">
      <h2 className="text-xl font-bold">Order #4921</h2>
      <p className="text-sm text-gray-500">Heading to Sarah Jenkins</p>

      <button className="mt-6 w-full h-14 bg-primary text-white font-bold rounded-2xl">
        Mark Arrived
      </button>
    </div>
  );
}
