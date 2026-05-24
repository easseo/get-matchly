import { Link } from "react-router-dom";
import { Megaphone, FileText, CheckCircle2, Eye, Plus, ArrowLeft, TrendingUp } from "lucide-react";
import { KpiCard, PageHeader, StatusPill, CreatorAvatar } from "@/components/app/KpiCard";
import { mockCampaigns, mockProposals } from "@/data/mockApp";
import { useDemoAuth } from "@/hooks/useDemoAuth";

export default function AdvertiserDashboard() {
  const { user } = useDemoAuth();
  const active = mockCampaigns.filter((c) => c.status === "פעיל");
  const totalProposals = mockCampaigns.reduce((s, c) => s + c.proposals, 0);
  const completed = mockCampaigns.filter((c) => c.status === "הסתיים").length;
  const totalReach = mockCampaigns.reduce((s, c) => s + c.views, 0);

  return (
    <>
      <PageHeader
        title={`שלום, ${user?.fullName?.split(" ")[0] || "מפרסם"} 👋`}
        subtitle="נהלו את הקמפיינים שלכם ופתחו הזדמנויות חדשות"
        action={
          <Link to="/app/create" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-white font-bold text-sm shadow-lg hover:opacity-90 transition-opacity" style={{ background: "var(--gradient-brand)" }}>
            <Plus className="w-4 h-4" />
            קמפיין חדש
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard label="קמפיינים פעילים" value={active.length} icon={Megaphone} tone="pink" hint="פועלים כרגע" />
        <KpiCard label="סך הצעות" value={totalProposals} icon={FileText} tone="violet" hint="ממתינות לסקירה" />
        <KpiCard label="הושלמו" value={completed} icon={CheckCircle2} tone="emerald" hint="קמפיינים" />
        <KpiCard label="חשיפה כוללת" value={totalReach.toLocaleString()} icon={Eye} tone="amber" hint="צפיות" />
      </div>

      {/* Active Campaigns */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">קמפיינים פעילים</h2>
          <Link to="/app/campaigns" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            לכולם <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-4">
          {active.slice(0, 3).map((c) => (
            <div key={c.id} className="rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 group">
              <div className="relative h-32 overflow-hidden">
                <img src={c.coverImage} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-2 right-2">
                  <StatusPill status={c.status} />
                </div>
                <div className="absolute bottom-2 right-2 text-white text-xs font-bold">{c.brand}</div>
              </div>
              <div className="p-3">
                <div className="font-bold text-sm text-gray-900 mb-2 line-clamp-1">{c.title}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-primary flex items-center gap-1">
                    <FileText className="w-3 h-3" />{c.proposals} הצעות
                  </span>
                  <span className="text-gray-400 font-semibold ltr-num flex items-center gap-1">
                    <Eye className="w-3 h-3" />{c.views.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Recent Proposals */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-gray-900">הצעות אחרונות</h2>
          <Link to="/app/proposals" className="text-xs font-bold text-primary inline-flex items-center gap-1 hover:gap-2 transition-all">
            לכולן <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
        <div className="space-y-3">
          {mockProposals.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3.5 rounded-2xl border border-gray-50 hover:bg-gray-50 transition-colors cursor-pointer">
              <CreatorAvatar name={p.creatorName} avatar={p.avatar} />
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm text-gray-900 truncate">{p.creatorName}</div>
                <div className="text-[11px] text-gray-400 truncate">{p.campaignTitle}</div>
              </div>
              <div className="text-left shrink-0 flex flex-col items-end gap-1">
                <div className="text-sm font-extrabold text-gray-900 ltr-num">₪{p.price}</div>
                <StatusPill status={p.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
