import { Link } from "react-router-dom";
import { Megaphone, FileText, CheckCircle2, Eye, Plus, ArrowLeft } from "lucide-react";
import { KpiCard, PageHeader, StatusPill } from "@/components/app/KpiCard";
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
          <Link to="/app/create" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl text-primary-foreground font-bold text-sm shadow-cta btn-glow" style={{ background: "var(--gradient-brand)" }}>
            <Plus className="w-4 h-4" />
            קמפיין חדש
          </Link>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8">
        <KpiCard label="קמפיינים פעילים" value={active.length} icon={Megaphone} tone="pink" hint="פועלים כרגע" />
        <KpiCard label="סך הצעות" value={totalProposals} icon={FileText} tone="violet" hint="ממתינות לסקירה" />
        <KpiCard label="קמפיינים שהושלמו" value={completed} icon={CheckCircle2} tone="emerald" hint="החודש" />
        <KpiCard label="חשיפה כוללת" value={totalReach.toLocaleString()} icon={Eye} tone="amber" hint="צפיות מצטברות" />
      </div>

      <section className="bg-card rounded-3xl border border-border shadow-soft p-5 md:p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">קמפיינים פעילים</h2>
          <Link to="/app/campaigns" className="text-xs font-bold text-primary inline-flex items-center gap-1">
            לכולם <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-3">
          {active.slice(0, 3).map((c) => (
            <div key={c.id} className="rounded-2xl border border-border overflow-hidden hover-lift">
              <div className={`h-24 ${c.cover}`} />
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <StatusPill status={c.status} />
                  <span className="text-[11px] text-muted-foreground font-semibold">{c.deadline}</span>
                </div>
                <div className="font-bold text-sm leading-tight mb-1 line-clamp-1">{c.title}</div>
                <div className="text-[11px] text-muted-foreground font-medium mb-3">{c.brand} • {c.category}</div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-primary">{c.proposals} הצעות</span>
                  <span className="text-muted-foreground font-semibold ltr-num">{c.views.toLocaleString()} צפיות</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-card rounded-3xl border border-border shadow-soft p-5 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">הצעות אחרונות מיוצרים</h2>
          <Link to="/app/proposals" className="text-xs font-bold text-primary inline-flex items-center gap-1">
            לכולן <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
          </Link>
        </div>
        <div className="space-y-2">
          {mockProposals.slice(0, 4).map((p) => (
            <div key={p.id} className="flex items-center gap-3 p-3 rounded-2xl border border-border hover:bg-muted/40 transition-colors">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${p.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                {p.creatorName.slice(0, 1)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-sm truncate">{p.creatorName}</div>
                <div className="text-[11px] text-muted-foreground truncate">{p.campaignTitle}</div>
              </div>
              <div className="text-left shrink-0">
                <div className="text-sm font-black ltr-num">₪{p.price}</div>
                <StatusPill status={p.status} />
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
