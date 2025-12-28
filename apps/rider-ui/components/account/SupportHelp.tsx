import InfoCard from "@/components/account/InfoCard";
import { 
  ArrowUpRightFromSquare,
  HelpCircleIcon,
  FileQuestionIcon,
} from 'lucide-react'

export function SupportHelp() {
  return (
    <section>
      <h3 className="text-sm font-bold text-gray-500 uppercase mb-2">
        Support & Help
      </h3>

      <div className="bg-white dark:bg-surface-dark rounded-xl shadow-card overflow-hidden">
        <InfoCard
          icon={<FileQuestionIcon className="h-4 w-5"/>}
          label="FAQ"
          value="Common questions"
          // trailing={<span className="material-symbols-outlined">open_in_new</span>}
        />

        <InfoCard
          icon={<HelpCircleIcon className="h-4 w-5"/>}
          label="Contact Support"
          value="Get help with issues"
          // trailing={<span className="material-symbols-outlined">chevron_right</span>}
        />
      </div>
    </section>
  );
}
