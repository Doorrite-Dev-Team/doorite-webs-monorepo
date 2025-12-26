type Props = {
  onGoOnline: () => void;
};

export default function SearchingState({ onGoOnline }: Props) {
  return (
    <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
      <div className="flex justify-center">
        <button
          onClick={onGoOnline}
          className="flex items-center gap-3 px-8 h-16 rounded-full bg-primary text-white font-bold shadow-lg active:scale-95"
        >
          <span className="material-symbols-outlined text-2xl">
            power_settings_new
          </span>
          GO ONLINE
        </button>
      </div>
    </div>
  );
}
