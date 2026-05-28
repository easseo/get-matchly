import { useState } from "react";
import { Check, X, Instagram, TrendingUp, MessageSquare } from "lucide-react";
import { KpiCard, PageHeader, StatusPill, CreatorAvatar } from "@/components/app/KpiCard";
import { FileText, Clock, CheckCircle2, DollarSign } from "lucide-react";
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
      <PageHeader title="כל ההצעות" subtitle="הצעות שיוצרי תוכן הגישו לקמפיינים שלכם" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard label="סך ההצעות"  value={proposals.length}                                          icon={FileText}    tone="violet" />
        <KpiCard label="ממתינות"     value={proposals.filter((p) => p.status === "ממתין").length}     icon={Clock}       tone="amber" />
        <KpiCard label="אושרו"       value={proposals.filter((p) => p.status === "אושר").length}      icon={CheckCircle2} tone="emerald" />
        <KpiCard label="ערך כולל"    value={`₪${totalValue.toLocaleString()}`}                        icon={DollarSign}  tone="pink" />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-gray-100 rounded-2xl mb-5 w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              tab === t ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {t}
            {t === "ממתין" && proposals.filter(p => p.status === "ממתין").length > 0 && (
              <span className="mr-1.5 bg-orange-400 text-white rounded-full text-[9px] px-1.5 py-0.5 font-black">
                {proposals.filter(p => p.status === "ממתין").length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-8 h-8 text-gray-200 mx-auto mb-2" />
            <p className="text-sm text-gray-400 font-semibold">אין הצעות בקטגוריה זו</p>
          </div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3 mb-3">
              <CreatorAvatar name={p.creatorName} avatar={p.avatar} size="lg" />
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap">
                  <div>
                    <div className="font-extrabold text-gray-900 text-sm">{p.creatorName}</div>
                    <div className="text-xs text-gray-400 font-medium flex items-center gap-1 mt-0.5">
                      <Instagram className="w-3 h-3" />
                      {p.creatorHandle} · {p.submittedAt}
                    </div>
                  </div>
                  <StatusPill status={p.status} />
                </div>
                <div className="text-[10px] font-bold text-primary mt-1.5 bg-primary/5 px-2.5 py-1 rounded-full w-fit">{p.campaignTitle}</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 mb-3 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">{p.message}</p>

            <div className="flex items-center justify-between flex-wrap gap-2.5 pt-3 border-t border-gray-100">
              <div className="flex gap-1.5 flex-wrap">
                <span className="bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full text-[10px] font-bold">{p.followers} עוקבים</span>
                <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1">
                  <TrendingUp className="w-2.5 h-2.5" /> {p.engagement}
                </span>
                <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-full text-[10px] font-bold">₪{p.price.toLocaleString()}</span>
              </div>
              {p.status === "ממתין" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => updateStatus(p.id, "נדחה")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]"
                  >
                    <X className="w-3.5 h-3.5" /> דחייה
                  </button>
                  <button
                    onClick={() => updateStatus(p.id, "אושר")}
                    className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold text-white shadow-md hover:opacity-90 transition-opacity min-h-[44px]"
                    style={{ background: "var(--gradient-brand)" }}
                  >
                    <Check className="w-3.5 h-3.5" /> אישור
                  </button>
                </div>
              )}
              {p.status === "אושר" && (
                <button className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors min-h-[44px]">
                  <MessageSquare className="w-3.5 h-3.5" /> פתח צ׳אט
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
