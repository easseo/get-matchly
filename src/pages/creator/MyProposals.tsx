import { FileText, Clock, CheckCircle2, XCircle } from "lucide-react";
import { KpiCard, PageHeader, StatusPill } from "@/components/app/KpiCard";
import { mockProposals } from "@/data/mockApp";

export default function CreatorProposals() {
  const list = mockProposals;
  return (
    <>
      <PageHeader title="ההצעות שלי" subtitle="עקבו אחר סטטוס ההצעות שהגשתם" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
        <KpiCard label="סך הצעות" value={list.length} icon={FileText} tone="violet" />
        <KpiCard label="ממתין" value={list.filter((p) => p.status === "ממתין").length} icon={Clock} tone="amber" />
        <KpiCard label="אושרו" value={list.filter((p) => p.status === "אושר").length} icon={CheckCircle2} tone="emerald" />
        <KpiCard label="נדחו" value={list.filter((p) => p.status === "נדחה").length} icon={XCircle} tone="rose" />
      </div>

      <div className="bg-card rounded-3xl border border-border shadow-soft overflow-hidden">
        <div className="hidden md:grid grid-cols-[1fr_120px_120px_120px] gap-4 px-5 py-3 bg-muted/40 text-[11px] font-bold text-muted-foreground uppercase tracking-wide">
          <span>קמפיין</span>
          <span>מחיר</span>
          <span>סטטוס</span>
          <span>תאריך</span>
        </div>
        <div className="divide-y divide-border">
          {list.map((p) => (
            <div key={p.id} className="px-5 py-4 grid md:grid-cols-[1fr_120px_120px_120px] gap-3 items-center hover:bg-muted/30 transition-colors">
              <div>
                <div className="font-bold text-sm">{p.campaignTitle}</div>
                <div className="text-[11px] text-muted-foreground font-semibold">{p.brand}</div>
              </div>
              <div className="font-black ltr-num">₪{p.price}</div>
              <StatusPill status={p.status} />
              <div className="text-xs text-muted-foreground font-semibold">{p.submittedAt}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
