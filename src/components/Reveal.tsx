import type { ReactNode } from "react";
import { useReveal } from "@/lib/useReveal";

export default function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
  const { ref, revealed } = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} className={`reveal ${revealed ? "revealed" : ""} ${className}`.trim()}>
      {children}
    </div>
  );
}
