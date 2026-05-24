import { useState } from "react";
import { Search, Calendar, Wallet, Send, TrendingUp } from "lucide-react";
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

      <div className="flex flex-wrap gap-3 items-center mb-6">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="חיפוש קמפיין..."
            className="w-full bg-white border border-gray-200 rounded-xl pr-9 pl-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 shadow-sm"
          />
        </div>
        <div className="flex gap-1 p-1 bg-gray-100 rounded-xl overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                cat === c ? "bg-white shadow-sm text-gray-900" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col">
            {/* Image with overlay */}
            <div className="relative h-48 overflow-hidden">
              <img
                src={c.coverImage}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

              <div className="absolute top-3 right-3">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-[11px] font-bold px-2.5 py-1 rounded-full">
                  {c.category}
                </span>
              </div>
              <div className="absolute top-3 left-3">
                <StatusPill status={c.status} />
              </div>

              <div className="absolute bottom-0 right-0 left-0 p-3">
                <div className="font-extrabold text-white text-base leading-tight">{c.title}</div>
                <div className="text-white/70 text-xs font-medium mt-0.5">{c.brand}</div>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 flex-1 flex flex-col">
              <p className="text-sm text-gray-500 mb-4 line-clamp-2 flex-1">{c.description}</p>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Wallet className="w-3.5 h-3.5 text-primary shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-semibold">תקציב</div>
                    <div className="font-extrabold text-gray-900 text-xs ltr-num">{c.budgetRange}</div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-semibold">דד ליין</div>
                    <div className="font-extrabold text-gray-900 text-[10px]">{c.deadline}</div>
                  </div>
                </div>
              </div>

              <button
                onClick={() => toast({ title: "ההצעה נשלחה!", description: c.title })}
                className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-lg flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
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
