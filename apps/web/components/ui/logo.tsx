import { cn } from "@/lib/utils";

interface LogoMarkProps {
  className?: string;
  showWordmark?: boolean;
}

export function LogoMark({ className, showWordmark = true }: LogoMarkProps) {
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#071B2B] text-white shadow-md border border-[#167D8D]/40">
        {/* Cinema Film Clapper Icon in Brand Colors */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5 text-[#B9E4E8]"
        >
          <rect width="20" height="15" x="2" y="7" rx="2" ry="2" fill="#071B2B" stroke="#167D8D" />
          <path d="m4 7 3-4h4l-3 4" fill="#167D8D" stroke="#B9E4E8" />
          <path d="m11 7 3-4h4l-3 4" fill="#167D8D" stroke="#B9E4E8" />
          <line x1="2" x2="22" y1="7" y2="7" stroke="#B9E4E8" strokeWidth="1.5" />
          <circle cx="12" cy="14" r="2.5" fill="#167D8D" stroke="#B9E4E8" strokeWidth="1" />
        </svg>
      </div>
      {showWordmark && (
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="truncate text-[15px] font-bold tracking-tight text-foreground font-sans">
              CINEMA <span className="text-[#167D8D]">OS</span>
            </span>
            <span className="rounded bg-[#167D8D]/15 px-1 py-0.2 text-[9px] font-bold uppercase tracking-wider text-[#167D8D]">
              ENTERPRISE
            </span>
          </div>
          <p className="mt-0.5 truncate text-[10px] font-medium tracking-wider text-muted-foreground">
            Film Production OS
          </p>
        </div>
      )}
    </div>
  );
}
