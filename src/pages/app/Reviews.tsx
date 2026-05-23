import { Star, MessageSquare, TrendingUp } from "lucide-react";
import { KpiCard, PageHeader } from "@/components/app/KpiCard";
import { mockReviews } from "@/data/mockApp";

export default function Reviews() {
  const avg = (mockReviews.reduce((s, r) => s + r.rating, 0) / mockReviews.length).toFixed(1);
  const fiveStars = mockReviews.filter((r) => r.rating === 5).length;

  return (
    <>
      <PageHeader title="ביקורות" subtitle="ביקורות שקיבלתם מיוצרי התוכן" />

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 mb-6">
        <KpiCard label="דירוג ממוצע" value={avg} icon={Star} tone="amber" hint="מתוך 5" />
        <KpiCard label="סך ביקורות" value={mockReviews.length} icon={MessageSquare} tone="violet" />
        <KpiCard label="ביקורות 5 כוכבים" value={fiveStars} icon={TrendingUp} tone="emerald" />
      </div>

      <div className="space-y-3">
        {mockReviews.map((r) => (
          <div key={r.id} className="bg-card rounded-2xl border border-border p-5 hover-lift">
            <div className="flex items-start gap-3">
              <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${r.gradient} flex items-center justify-center text-white font-bold shrink-0`}>
                {r.from.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                  <div>
                    <div className="font-bold">{r.from}</div>
                    <div className="text-[11px] text-muted-foreground font-semibold">{r.campaign} • {r.date}</div>
                  </div>
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/85 mt-2">{r.text}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
