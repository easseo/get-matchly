import { useState } from "react";
import { Check, X } from "lucide-react";
import { KpiCard, PageHeader, StatusPill } from "@/components/app/KpiCard";
import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { mockProposals, type Proposal } from "@/data/mockApp";
import { toast } from "@/hooks/use-toast";

const tabs = ["הכל", "ממתין", "אושר", "נדחה"] as const;
type Tab = (typeof tabs)[number];

export default function AllProposals() {
  const [tab, setTab] = useState<Tab>("הכל");
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const filtered = proposals.filter((p) => tab === "הכל" || p.status === tab);
  const totalValue = proposals.reduce((s, p) => s + p.price, 0);

  const updateStatus = (id: string, status: Proposal["status"]) => {
    setProposals((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)));
    toast({ title: status === "אושר" ? "ההצעה אושרה!" : "ההצעה נדחתה" });
  };

  return (
    <>
      <PageHeader title="כל ההצעות" subtitle="עיינו בהצעות שיוצרי תוכן הגישו לקמפיינים שלכם" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <KpiCard label="סך ההצעות" value={proposals.length} icon={FileText} tone="violet" />
        <KpiCard label="ממתינות" value={proposals.filter((p) => p.status === "ממתין").length} icon={Clock} tone="amber" />
        <KpiCard label="אושרו" value={proposals.filter((p) => p.status === "אושר").length} icon={CheckCircle2} tone="emerald" />
        <KpiCard label="ערך כולל" value={`₪${totalValue.toLocaleString()}`} icon={XCircle} tone="pink" />
      </div>

      <div className="flex gap-1.5 p-1 bg-muted rounded-xl mb-4 w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
              tab === t ? "bg-card shadow-soft" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((p) => (
          <div key={p.id} className="bg-card rounded-2xl border border-border p-4 md:p-5 hover-lift">
            <div className="flex items-start gap-3 mb-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white font-bold shrink-0`}>
                {p.creatorName.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div>
                    <div className="font-bold">{p.creatorName}</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">{p.creatorHandle} • {p.submittedAt}</div>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <div className="text-xs font-bold text-primary mt-1">{p.campaignTitle}</div>
              </div>
            </div>

            <p className="text-sm text-foreground/80 mb-3 line-clamp-2">{p.message}</p>

            <div className="flex items-center justify-between flex-wrap gap-3 pt-3 border-t border-border">
              <div className="flex gap-2 flex-wrap text-[11px]">
                <span className="bg-muted/60 px-2.5 py-1 rounded-full font-bold ltr-num">{p.followers} עוקבים</span>
                <span className="bg-muted/60 px-2.5 py-1 rounded-full font-bold ltr-num">מעורבות {p.engagement}</span>
                <span className="bg-muted/60 px-2.5 py-1 rounded-full font-bold ltr-num">₪{p.price}</span>
              </div>
              {p.status === "ממתין" && (
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(p.id, "נדחה")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold border border-border hover:bg-muted">
                    <X className="w-3.5 h-3.5" /> דחייה
                  </button>
                  <button onClick={() => updateStatus(p.id, "אושר")} className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold text-primary-foreground shadow-cta" style={{ background: "var(--gradient-brand)" }}>
                    <Check className="w-3.5 h-3.5" /> אישור
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
