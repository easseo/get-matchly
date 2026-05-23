import { PageHeader } from "@/components/app/KpiCard";
import { Send } from "lucide-react";
import { mockProposals } from "@/data/mockApp";
import { useState } from "react";

export default function Messages() {
  const conversations = mockProposals.slice(0, 4);
  const [activeId, setActiveId] = useState(conversations[0]?.id);
  const active = conversations.find((c) => c.id === activeId);

  return (
    <>
      <PageHeader title="הודעות" subtitle="תקשורת ישירה עם יוצרי התוכן שלכם" />
      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden grid md:grid-cols-[280px_1fr] min-h-[520px]">
        <aside className="border-l border-border bg-muted/30">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full text-right p-4 border-b border-border flex items-center gap-3 transition-colors ${
                activeId === c.id ? "bg-card" : "hover:bg-muted/50"
              }`}
            >
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold shrink-0`}>
                {c.creatorName.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{c.creatorName}</div>
                <div className="text-[11px] text-muted-foreground truncate">{c.message}</div>
              </div>
            </button>
          ))}
        </aside>

        <div className="flex flex-col">
          {active && (
            <>
              <div className="p-4 border-b border-border flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${active.gradient} flex items-center justify-center text-white font-bold`}>
                  {active.creatorName.slice(0, 1)}
                </div>
                <div>
                  <div className="font-bold">{active.creatorName}</div>
                  <div className="text-[11px] text-muted-foreground">{active.campaignTitle}</div>
                </div>
              </div>
              <div className="flex-1 p-6 space-y-3 overflow-y-auto">
                <Bubble side="left" gradient={active.gradient}>{active.message}</Bubble>
                <Bubble side="right">תודה על ההצעה! זה נשמע מעולה. נוכל לדבר על לוחות הזמנים?</Bubble>
                <Bubble side="left" gradient={active.gradient}>בטח, אפשר השבוע אחה"צ?</Bubble>
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <input className="flex-1 bg-muted/50 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="כתבו הודעה..." />
                <button className="px-4 py-2.5 rounded-xl text-primary-foreground shadow-cta" style={{ background: "var(--gradient-brand)" }}>
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

function Bubble({ side, gradient, children }: { side: "left" | "right"; gradient?: string; children: React.ReactNode }) {
  if (side === "right") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[70%] px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-primary-foreground shadow-cta" style={{ background: "var(--gradient-brand)" }}>
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2">
      <div className={`w-8 h-8 rounded-full bg-gradient-to-br ${gradient} shrink-0`} />
      <div className="max-w-[70%] px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm bg-muted">{children}</div>
    </div>
  );
}
