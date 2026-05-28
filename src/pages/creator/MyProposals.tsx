import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText, Clock, CheckCircle2, XCircle, X, Edit2, Trash2,
  Instagram, Calendar, Wallet, Send, ChevronLeft, Upload,
} from "lucide-react";
import { KpiCard, PageHeader } from "@/components/app/KpiCard";
import { mockProposals, type Proposal } from "@/data/mockApp";
import { toast } from "@/hooks/use-toast";

const statusConfig = {
  "ממתין": { label: "ממתין",  bg: "bg-yellow-50",  text: "text-yellow-700",  border: "border-yellow-100" },
  "אושר":  { label: "אושר",   bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
  "נדחה":  { label: "נדחה",   bg: "bg-red-50",     text: "text-red-600",     border: "border-red-100" },
};

// ──────────────── Proposal Details Modal ────────────────
function ProposalDetailsModal({
  proposal,
  onClose,
  onCancel,
}: {
  proposal: Proposal;
  onClose: () => void;
  onCancel: (id: string) => void;
}) {
  const navigate = useNavigate();
  const st = statusConfig[proposal.status as keyof typeof statusConfig] ?? statusConfig["ממתין"];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center" dir="rtl">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:mx-4 sm:rounded-3xl rounded-t-3xl max-h-[90dvh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <h2 className="font-extrabold text-gray-900 text-base">פרטי הצעה</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
          {/* Campaign info */}
          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-extrabold text-gray-900 text-sm leading-tight">{proposal.campaignTitle}</p>
                <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1">
                  <Instagram className="w-3 h-3" /> {proposal.brand} · {proposal.creatorHandle}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${st.bg} ${st.text} ${st.border} shrink-0`}>
                {st.label}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Wallet className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold">מחיר מוצע</p>
                <p className="font-extrabold text-gray-900 text-sm">₪{proposal.price.toLocaleString()}</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-primary shrink-0" />
              <div>
                <p className="text-[10px] text-gray-400 font-semibold">הוגשה</p>
                <p className="font-extrabold text-gray-900 text-sm">{proposal.submittedAt}</p>
              </div>
            </div>
          </div>

          {/* Message */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">הודעה למפרסם</p>
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
              <p className="text-sm text-gray-700 leading-relaxed">{proposal.message}</p>
            </div>
          </div>

          {/* Deliverables mock */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">מה כלול בהצעה</p>
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
              <p className="text-sm text-gray-700">רילס × 1, סטורי × 2</p>
            </div>
          </div>

          {/* Delivery mock */}
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">זמן ביצוע</p>
            <div className="bg-gray-50 rounded-xl p-3.5 border border-gray-100">
              <p className="text-sm text-gray-700">5 ימים</p>
            </div>
          </div>

          {/* Status-specific states */}
          {proposal.status === "אושר" && (
            <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
              <p className="font-bold text-emerald-800 text-sm mb-1">ההצעה אושרה!</p>
              <p className="text-xs text-emerald-600 mb-3">המפרסם אישר את ההצעה שלך. עכשיו ניתן להתחיל לעבוד ולהגיש את התוצרים.</p>
              <button
                onClick={() => { onClose(); navigate("/app/creator/submit"); }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-white text-xs font-bold"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Upload className="w-3.5 h-3.5" /> הגש תוצרים
              </button>
            </div>
          )}

          {proposal.status === "נדחה" && (
            <div className="bg-red-50 border border-red-100 rounded-2xl p-4">
              <p className="font-bold text-red-700 text-sm mb-1">ההצעה נדחתה</p>
              <p className="text-xs text-red-500">המפרסם בחר יוצר אחר לקמפיין זה. תוכלו להגיש הצעות לקמפיינים אחרים.</p>
            </div>
          )}
        </div>

        {/* Actions */}
        {proposal.status === "ממתין" && (
          <div className="px-5 py-4 border-t border-gray-100 shrink-0 flex gap-2">
            <button
              onClick={() => { toast({ title: "ביטול ההצעה" }); onCancel(proposal.id); onClose(); }}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl border border-gray-200 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors min-h-[44px]"
            >
              <Trash2 className="w-3.5 h-3.5" /> ביטול הצעה
            </button>
            <button
              onClick={() => { toast({ title: "עריכת הצעה" }); onClose(); }}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-xs font-bold text-white"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Edit2 className="w-3.5 h-3.5" /> עריכת הצעה
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ──────────────── Main Page ────────────────
export default function CreatorProposals() {
  const navigate = useNavigate();
  const [proposals, setProposals] = useState<Proposal[]>(mockProposals);
  const [selected, setSelected] = useState<Proposal | null>(null);

  const handleCancel = (id: string) => {
    setProposals(prev => prev.filter(p => p.id !== id));
  };

  return (
    <>
      <PageHeader title="ההצעות שלי" subtitle="עקבו אחר סטטוס ההצעות שהגשתם" />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        <KpiCard label="סך הצעות" value={proposals.length}                                             icon={FileText}    tone="violet" />
        <KpiCard label="ממתין"    value={proposals.filter((p) => p.status === "ממתין").length}        icon={Clock}       tone="amber" />
        <KpiCard label="אושרו"    value={proposals.filter((p) => p.status === "אושר").length}         icon={CheckCircle2} tone="emerald" />
        <KpiCard label="נדחו"     value={proposals.filter((p) => p.status === "נדחה").length}         icon={XCircle}     tone="rose" />
      </div>

      {/* Proposals list */}
      <div className="space-y-3">
        {proposals.length === 0 && (
          <div className="text-center py-16">
            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Send className="w-6 h-6 text-gray-300" />
            </div>
            <p className="text-gray-500 font-semibold text-sm mb-1">אין הצעות עדיין</p>
            <p className="text-gray-400 text-xs mb-4">גלשו בקמפיינים והגישו את ההצעה הראשונה שלכם</p>
            <button
              onClick={() => navigate("/app/creator/browse")}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm"
              style={{ background: "var(--gradient-brand)" }}
            >
              דפדוף בקמפיינים
            </button>
          </div>
        )}

        {proposals.map((p) => {
          const st = statusConfig[p.status as keyof typeof statusConfig] ?? statusConfig["ממתין"];
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p)}
              className="w-full text-right bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md hover:border-gray-200 transition-all flex items-center gap-3"
            >
              {/* Avatar */}
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {p.creatorName.slice(0, 1)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <span className="font-bold text-sm text-gray-900 truncate">{p.campaignTitle}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.bg} ${st.text} ${st.border}`}>
                    {st.label}
                  </span>
                </div>
                <p className="text-[11px] text-gray-400 font-semibold">{p.brand} · {p.submittedAt}</p>
              </div>

              {/* Price + arrow */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="font-extrabold text-gray-900 text-sm">₪{p.price.toLocaleString()}</span>
                <ChevronLeft className="w-4 h-4 text-gray-300" />
              </div>
            </button>
          );
        })}
      </div>

      {/* Details Modal */}
      {selected && (
        <ProposalDetailsModal
          proposal={selected}
          onClose={() => setSelected(null)}
          onCancel={handleCancel}
        />
      )}
    </>
  );
}
