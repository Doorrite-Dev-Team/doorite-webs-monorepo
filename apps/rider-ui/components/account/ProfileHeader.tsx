export default function ProfileHeader() {
  return (
    <header className="sticky top-0 z-30 bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur border-b px-4 py-4 flex items-center justify-between">
      <button className="w-10 h-10 rounded-full hover:bg-gray-100 dark:hover:bg-white/10">
        <span className="material-symbols-outlined">arrow_back</span>
      </button>

      <h1 className="absolute left-1/2 -translate-x-1/2 font-bold">
        My Profile
      </h1>

      <div className="w-10" />
    </header>
  );
}
