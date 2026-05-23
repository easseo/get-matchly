import { Link } from "react-router-dom";
import { Plus, Search, Eye, FileText } from "lucide-react";
import { useState } from "react";
import { PageHeader, StatusPill } from "@/components/app/KpiCard";
import { mockCampaigns, type CampaignStatus } from "@/data/mockApp";

const filters: ("הכל" | CampaignStatus)[] = ["הכל", "פעיל", "ממתין", "הסתיים", "טיוטה"];

export default function MyCampaigns() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("הכל");
  const [q, setQ] = useState("");
  const list = mockCampaigns.filter(
    (c) =>
      (filter === "הכל" || c.status === filter) &&
      (q === "" || c.title.includes(q) || c.brand.includes(q))
  );

  return (
    <>
      <PageHeader
        title="הקמפיינים שלי"
        subtitle="נהלו את כל הקמפיינים במקום אחד"
        action={
          <Link to="/app/create" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-primary-foreground font-bold text-sm shadow-cta btn-glow" style={{ background: "var(--gradient-brand)" }}>
            <Plus className="w-4 h-4" /> קמפיין חדש
          </Link>
        }
      />

      <div className="flex flex-wrap gap-3 items-center mb-5">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש קמפיין..."
            className="w-full bg-card border border-border rounded-xl pr-9 pl-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
        <div className="flex gap-1.5 p-1 bg-muted rounded-xl overflow-x-auto">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? "bg-card shadow-soft text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <div key={c.id} className="bg-card rounded-2xl border border-border overflow-hidden hover-lift">
            <div className={`h-32 ${c.cover} relative`}>
              <div className="absolute top-3 right-3">
                <StatusPill status={c.status} />
              </div>
            </div>
            <div className="p-4">
              <div className="font-bold text-base mb-1 line-clamp-1">{c.title}</div>
              <div className="text-xs text-muted-foreground font-semibold mb-3">{c.brand} • {c.category}</div>
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                <div className="bg-muted/50 rounded-lg px-2 py-1.5">
                  <div className="text-muted-foreground font-semibold">תקציב</div>
                  <div className="font-bold ltr-num">{c.budgetRange}</div>
                </div>
                <div className="bg-muted/50 rounded-lg px-2 py-1.5">
                  <div className="text-muted-foreground font-semibold">דד ליין</div>
                  <div className="font-bold">{c.deadline}</div>
                </div>
              </div>
              <div className="flex items-center justify-between text-[12px] pt-3 border-t border-border">
                <span className="inline-flex items-center gap-1 font-bold text-primary">
                  <FileText className="w-3.5 h-3.5" /> {c.proposals} הצעות
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground font-semibold ltr-num">
                  <Eye className="w-3.5 h-3.5" /> {c.views.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground font-semibold">
            לא נמצאו קמפיינים תואמים
          </div>
        )}
      </div>
    </>
  );
}
