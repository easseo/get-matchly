import { Star, MessageSquare, TrendingUp, Award } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/app/KpiCard";
import { mockReviews } from "@/data/mockApp";

export default function Reviews() {
  const avg = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);
  const fiveStars = mockReviews.filter((r) => r.rating === 5).length;

  return (
    <>
      <PageHeader title="ביקורות" subtitle="ביקורות שקיבלתם מיוצרי התוכן" />

      <div className="grid grid-cols-3 gap-3 mb-5">
        <KpiCard label="דירוג ממוצע" value={avg} icon={Star}        tone="amber"   hint="מתוך 5" />
        <KpiCard label="סך ביקורות" value={mockReviews.length}       icon={MessageSquare} tone="violet" />
        <KpiCard label="5 כוכבים"   value={fiveStars}                icon={Award}   tone="emerald" />
      </div>

      {/* Trust summary */}
      <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4 mb-5 flex items-center gap-3">
        <div className="flex gap-0.5 shrink-0">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < Math.round(Number(avg)) ? "fill-amber-400 text-amber-400" : "text-amber-200"}`} />
          ))}
        </div>
        <div>
          <span className="font-extrabold text-amber-900 text-sm">{avg} מתוך 5</span>
          <span className="text-amber-600 text-xs font-medium mr-1.5">— מבוסס על {mockReviews.length} ביקורות</span>
        </div>
      </div>

      <div className="space-y-3">
        {mockReviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold shrink-0 text-sm`}>
                {r.from.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <div>
                    <div className="font-extrabold text-gray-900 text-sm">{r.from}</div>
                    <div className="text-[11px] text-gray-400 font-semibold mt-0.5">{r.campaign} · {r.date}</div>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mt-2 bg-gray-50 rounded-xl p-3 border border-gray-100">{r.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
