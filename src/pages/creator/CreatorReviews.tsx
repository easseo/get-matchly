import { Star, Award, MessageSquare, ShieldCheck } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/app/KpiCard";
import { mockReviews } from "@/data/mockApp";

export default function CreatorReviews() {
  const avg = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length);
  const avgStr = avg.toFixed(1);
  const total = mockReviews.length;
  const fiveStars = mockReviews.filter((r) => r.rating === 5).length;

  const breakdown = [5, 4, 3, 2, 1].map((n) => ({
    stars: n,
    count: mockReviews.filter((r) => r.rating === n).length,
    pct: Math.round((mockReviews.filter((r) => r.rating === n).length / total) * 100),
  }));

  return (
    <>
      <PageHeader title="ביקורות" subtitle="ביקורות שקיבלתם מבעלי עסקים" />

      {/* KPIs */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <KpiCard label="דירוג ממוצע" value={avgStr} icon={Star}         tone="amber"   hint="מתוך 5" />
        <KpiCard label="סך ביקורות" value={total}   icon={MessageSquare} tone="violet" />
        <KpiCard label="5 כוכבים"   value={fiveStars} icon={Award}      tone="emerald" />
      </div>

      {/* Rating summary block */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 mb-5">
        <div className="flex items-center gap-5">
          {/* Big score */}
          <div className="text-center shrink-0">
            <div className="text-5xl font-black text-gray-900 leading-none">{avgStr}</div>
            <div className="flex gap-0.5 justify-center mt-1.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-3.5 h-3.5 ${i < Math.round(avg) ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
              ))}
            </div>
            <p className="text-[11px] text-gray-400 mt-1 font-medium">מבוסס על {total} ביקורות</p>
          </div>

          {/* Breakdown bars */}
          <div className="flex-1 space-y-1.5">
            {breakdown.map(({ stars, count, pct }) => (
              <div key={stars} className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-gray-500 w-8 shrink-0 flex items-center gap-0.5">
                  {stars} <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-gray-400 font-semibold w-5 text-left shrink-0">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Review cards */}
      <div className="space-y-3">
        {mockReviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {r.from.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2 flex-wrap mb-1">
                  <div>
                    <p className="font-extrabold text-gray-900 text-sm">{r.from}</p>
                    <p className="text-[11px] text-gray-400 font-semibold mt-0.5">{r.campaign} · {r.date}</p>
                  </div>
                  <div className="flex gap-0.5 shrink-0">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`} />
                    ))}
                  </div>
                </div>

                <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100 mt-2">
                  {r.text}
                </p>

                {/* Verified Campaign badge */}
                <div className="flex items-center gap-1.5 mt-2.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span className="text-[10px] font-bold text-emerald-600">קמפיין מאומת</span>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400 font-medium">ביקורת מקמפיין Matchly שהושלם</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
