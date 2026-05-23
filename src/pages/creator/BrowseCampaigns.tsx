import { useState } from "react";
import { Search, Calendar, Wallet, Send } from "lucide-react";
import { PageHeader, StatusPill } from "@/components/app/KpiCard";
import { mockCampaigns } from "@/data/mockApp";
import { toast } from "@/hooks/use-toast";

const categories = ["הכל", "אופנה", "ביוטי", "כושר", "אוכל", "מסעדה"];

export default function BrowseCampaigns() {
  const [cat, setCat] = useState("הכל");
  const [q, setQ] = useState("");
  const list = mockCampaigns.filter(
    (c) =>
      c.status !== "הסתיים" &&
      (cat === "הכל" || c.category === cat) &&
      (q === "" || c.title.includes(q) || c.brand.includes(q))
  );

  return (
    <>
      <PageHeader title="דפדוף בקמפיינים" subtitle="הזדמנויות פתוחות שמחכות לכם" />

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
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                cat === c ? "bg-card shadow-soft" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((c) => (
          <div key={c.id} className="bg-card rounded-2xl border border-border overflow-hidden hover-lift flex flex-col">
            <div className={`h-32 ${c.cover}`} />
            <div className="p-4 flex-1 flex flex-col">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] font-bold text-primary">{c.category}</span>
                <StatusPill status={c.status} />
              </div>
              <div className="font-bold text-base mb-1">{c.title}</div>
              <div className="text-xs text-muted-foreground font-semibold mb-3">{c.brand}</div>
              <p className="text-xs text-foreground/70 mb-3 line-clamp-2 flex-1">{c.description}</p>
              <div className="grid grid-cols-2 gap-2 text-[11px] mb-3">
                <div className="bg-muted/50 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
                  <Wallet className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-bold ltr-num">{c.budgetRange}</span>
                </div>
                <div className="bg-muted/50 rounded-lg px-2 py-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                  <span className="font-bold text-[10px]">{c.deadline}</span>
                </div>
              </div>
              <button
                onClick={() => toast({ title: "ההצעה נשלחה!", description: c.title })}
                className="w-full py-2.5 rounded-xl text-primary-foreground font-bold text-sm shadow-cta tap-scale flex items-center justify-center gap-2"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Send className="w-4 h-4" /> הגשת הצעה
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
