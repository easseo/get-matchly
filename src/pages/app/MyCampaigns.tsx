import { Link } from "react-router-dom";
import { Plus, Search, Eye, FileText, MapPin, Calendar } from "lucide-react";
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
          <Link to="/app/create" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg" style={{ background: "var(--gradient-brand)" }}>
            <Plus className="w-4 h-4" /> קמפיין חדש
          </Link>
        }
      />

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
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                filter === f
                  ? "bg-white shadow-sm text-gray-900"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {list.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group">
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
              <img
                src={c.coverImage}
                alt={c.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute top-3 right-3">
                <StatusPill status={c.status} />
              </div>
              <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[11px] font-bold text-gray-700">
                {c.category}
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="text-white font-extrabold text-lg leading-tight drop-shadow-lg">{c.brand}</span>
              </div>
            </div>

            {/* Content */}
            <div className="p-4">
              <h3 className="font-bold text-base text-gray-900 mb-3 line-clamp-1">{c.title}</h3>

              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="bg-gray-50 rounded-xl px-3 py-2">
                  <div className="text-[10px] text-gray-400 font-semibold mb-0.5">תקציב</div>
                  <div className="font-extrabold text-gray-900 text-xs ltr-num">{c.budgetRange}</div>
                </div>
                <div className="bg-gray-50 rounded-xl px-3 py-2">
                  <div className="text-[10px] text-gray-400 font-semibold mb-0.5 flex items-center gap-1">
                    <Calendar className="w-2.5 h-2.5" /> דד ליין
                  </div>
                  <div className="font-extrabold text-gray-900 text-xs">{c.deadline}</div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <div className="flex items-center gap-1.5 text-primary font-bold text-xs">
                  <FileText className="w-3.5 h-3.5" />
                  <span>{c.proposals} הצעות</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold">
                  <Eye className="w-3.5 h-3.5" />
                  <span className="ltr-num">{c.views.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <div className="col-span-full text-center py-20">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Megaphone className="w-7 h-7 text-gray-300" />
            </div>
            <p className="text-gray-400 font-semibold">לא נמצאו קמפיינים תואמים</p>
          </div>
        )}
      </div>
    </>
  );
}
