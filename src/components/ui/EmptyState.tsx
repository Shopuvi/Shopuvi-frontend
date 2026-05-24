import Link from "next/link";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
        style={{ background: "var(--brand-light)" }}>
        <Icon className="w-8 h-8" style={{ color: "var(--brand)" }} />
      </div>
      <h3 className="font-semibold text-gray-800 text-lg mb-2">{title}</h3>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed">{description}</p>
      {action && (
        <Link href={action.href}
          className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 active:scale-95"
          style={{ background: "var(--brand)" }}>
          {action.label}
        </Link>
      )}
    </div>
  );
}
