import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Upload, Instagram, FileText, Check, ChevronRight,
  Clock, CheckCircle2, AlertCircle, Wallet, X,
} from "lucide-react";
import { mockProposals } from "@/data/mockApp";

type DeliveryStatus = "pending" | "submitted" | "approved" | "revision";

const statusConfig: Record<DeliveryStatus, { label: string; bg: string; text: string; icon: React.ElementType }> = {
  pending:   { label: "ממתין להגשה",   bg: "bg-orange-50",  text: "text-orange-700", icon: Clock },
  submitted: { label: "ממתין לבדיקה",  bg: "bg-blue-50",    text: "text-blue-700",   icon: Clock },
  approved:  { label: "אושר",           bg: "bg-emerald-50", text: "text-emerald-700", icon: CheckCircle2 },
  revision:  { label: "נדרש תיקון",    bg: "bg-red-50",     text: "text-red-600",    icon: AlertCircle },
};

// The approved proposal for demo
const approvedProposal = mockProposals.find((p) => p.status === "אושר") ?? mockProposals[0];

export default function ContentDelivery() {
  const navigate = useNavigate();
  const [instagramUrl, setInstagramUrl] = useState("");
  const [note, setNote] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryStatus>("pending");
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = instagramUrl.trim().length > 5 || files.length > 0;
  const st = statusConfig[deliveryStatus];

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSubmitting(false);
    setDeliveryStatus("submitted");
  };

  const simulateApprove = () => setDeliveryStatus("approved");
  const simulateRevision = () => setDeliveryStatus("revision");

  return (
    <div className="p-4 md:p-6 max-w-2xl" dir="rtl">
      {/* Back */}
      <button
        onClick={() => navigate("/app/creator/proposals")}
        className="flex items-center gap-1 text-sm font-semibold text-gray-400 hover:text-gray-800 mb-5 w-fit transition-colors"
        dir="ltr"
      >
        <ChevronRight size={15} /> חזרה להצעות שלי
      </button>

      {/* Campaign header */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-purple-50 text-purple-600 mb-2 inline-block">
              {approvedProposal.brand}
            </span>
            <h1 className="text-lg font-extrabold text-gray-900 leading-tight">{approvedProposal.campaignTitle}</h1>
          </div>
          <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border shrink-0 ${st.bg} ${st.text} border-current/20`}>
            {st.label}
          </span>
        </div>

        {/* Flow steps */}
        <div className="flex items-center gap-0 mt-4 overflow-x-auto pb-1">
          {[
            { label: "אושרה הצעה",   done: true },
            { label: "הגשת תוצרים", done: deliveryStatus !== "pending" },
            { label: "בדיקת מפרסם", done: deliveryStatus === "approved" || deliveryStatus === "revision" },
            { label: "תשלום שוחרר", done: deliveryStatus === "approved" },
          ].map((step, i, arr) => (
            <div key={step.label} className="flex items-center shrink-0">
              <div className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black ${
                  step.done ? "text-white shadow-sm" : "bg-gray-100 text-gray-400"
                }`} style={step.done ? { background: "var(--gradient-brand)" } : undefined}>
                  {step.done ? <Check size={12} strokeWidth={3} /> : i + 1}
                </div>
                <span className="text-[9px] font-bold text-gray-400 mt-1 whitespace-nowrap">{step.label}</span>
              </div>
              {i < arr.length - 1 && <ChevronRight className="w-3 h-3 text-gray-200 mx-0.5 mb-4 shrink-0" />}
            </div>
          ))}
        </div>
      </div>

      {/* ── APPROVED STATE ── */}
      {deliveryStatus === "approved" && (
        <div className="bg-white rounded-3xl border border-emerald-100 shadow-sm p-5 mb-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center shrink-0">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="font-extrabold text-emerald-800">התוצרים אושרו!</p>
              <p className="text-xs text-emerald-600 mt-0.5">המפרסם אישר את העבודה שלך</p>
            </div>
          </div>
          <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <p className="font-bold text-emerald-800 text-sm">התשלום הועבר לחשבונך</p>
              <p className="text-xs text-emerald-600 font-medium">₪{approvedProposal.price.toLocaleString()} זמינים למשיכה</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/app/creator/earnings")}
            className="w-full mt-3 py-3 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2"
            style={{ background: "var(--gradient-brand)" }}
          >
            <Wallet className="w-4 h-4" /> לעמוד הרווחים
          </button>
        </div>
      )}

      {/* ── REVISION REQUIRED ── */}
      {deliveryStatus === "revision" && (
        <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-4 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0" />
          <div>
            <p className="font-bold text-red-700 text-sm mb-1">נדרש תיקון</p>
            <p className="text-xs text-red-500 leading-relaxed">המפרסם ביקש שינויים. יש לעדכן את התוצרים ולהגיש מחדש.</p>
          </div>
        </div>
      )}

      {/* ── SUBMISSION FORM ── */}
      {(deliveryStatus === "pending" || deliveryStatus === "revision") && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-5">
          <h2 className="font-extrabold text-gray-900 text-sm">
            {deliveryStatus === "revision" ? "הגשה מחדש" : "הגשת תוצרים"}
          </h2>

          {/* File upload */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-2">העלאת קבצים</label>
            <label className="flex flex-col items-center justify-center gap-2 w-full h-28 rounded-2xl border-2 border-dashed border-gray-200 hover:border-primary/40 hover:bg-gray-50 transition-colors cursor-pointer">
              <Upload className="w-6 h-6 text-gray-300" />
              <span className="text-xs text-gray-400 font-medium">לחצו להעלאה או גררו קבצים</span>
              <span className="text-[10px] text-gray-300">MP4, MOV, JPG, PNG — עד 500MB</span>
              <input
                type="file"
                className="hidden"
                accept="video/*,image/*"
                multiple
                onChange={(e) => {
                  const names = Array.from(e.target.files ?? []).map((f) => f.name);
                  setFiles(names);
                }}
              />
            </label>
            {files.length > 0 && (
              <div className="mt-2 space-y-1.5">
                {files.map((f) => (
                  <div key={f} className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3.5 h-3.5 text-primary shrink-0" />
                      <span className="text-xs font-medium text-gray-700 truncate">{f}</span>
                    </div>
                    <button onClick={() => setFiles(files.filter((n) => n !== f))}>
                      <X className="w-3.5 h-3.5 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Instagram link */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">קישור Instagram</label>
            <div className="relative">
              <Instagram className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-400" />
              <input
                value={instagramUrl}
                onChange={(e) => setInstagramUrl(e.target.value)}
                placeholder="https://www.instagram.com/p/..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors"
                dir="ltr"
              />
            </div>
          </div>

          {/* Optional note */}
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">הערה (אופציונלי)</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="הוסיפו הערה או הסבר על התוצרים"
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:bg-white transition-colors resize-none"
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full py-3.5 rounded-2xl text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-40 transition-opacity min-h-[44px]"
            style={{ background: "var(--gradient-brand)" }}
          >
            {submitting ? (
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <Upload className="w-4 h-4" />
            )}
            {submitting ? "שולח..." : "שליחה לבדיקה"}
          </button>
        </div>
      )}

      {/* ── SUBMITTED STATE ── */}
      {deliveryStatus === "submitted" && (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-11 h-11 rounded-2xl bg-blue-100 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-extrabold text-gray-900 text-sm">ממתין לבדיקה</p>
              <p className="text-xs text-gray-400 mt-0.5">המפרסם יבדוק את התוצרים תוך 48 שעות</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
            {instagramUrl && (
              <div className="flex items-center gap-2 text-xs text-gray-600 mb-2">
                <Instagram className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="truncate font-medium" dir="ltr">{instagramUrl}</span>
              </div>
            )}
            {files.length > 0 && (
              <div className="text-xs text-gray-500 font-medium">{files.length} קבצים הועלו</div>
            )}
          </div>

          {/* Demo buttons — for testing */}
          <div className="flex gap-2">
            <button onClick={simulateApprove}  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-100 hover:bg-emerald-100 transition-colors">[demo] אשר</button>
            <button onClick={simulateRevision} className="flex-1 py-2.5 rounded-xl text-xs font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 transition-colors">[demo] בקש תיקון</button>
          </div>
        </div>
      )}
    </div>
  );
}
