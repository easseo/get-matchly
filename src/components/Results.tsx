import { Instagram, Users, TrendingUp, Check, Send, RefreshCw } from "lucide-react";
import type { ScoredCreator } from "@/data/creators";
import { toast } from "@/hooks/use-toast";

interface ResultsProps {
  creators: ScoredCreator[];
  onMore: () => void;
  onRestart: () => void;
  onNewCampaign?: () => void;
  loadingMore: boolean;
}

export default function Results({ creators, onMore, onRestart, onNewCampaign, loadingMore }: ResultsProps) {
  return (
    <div className="min-h-screen bg-mesh flex flex-col">
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-background/80 border-b border-border">
        <div className="px-4 py-3.5 flex items-center justify-between">
          <button onClick={onNewCampaign ?? onRestart} className="text-xs font-bold text-muted-foreground tap-scale px-2 py-1">
            קמפיין חדש +
          </button>
          <span className="font-extrabold text-brand">Matchly</span>
          <div className="w-16" />
        </div>
      </header>

      <main className="px-4 pt-6 pb-8">
        <div className="text-center mb-6 animate-fade-in-up">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-card border border-border shadow-soft mb-3">
            <Check className="w-3.5 h-3.5" style={{ color: "hsl(var(--brand-pink))" }} />
            <span className="text-[11px] font-bold text-muted-foreground">ההתאמות מוכנות</span>
          </div>
          <h1 className="text-2xl font-black mb-1.5 leading-tight">
            מצאנו לכם <span className="text-brand">{creators.length} {creators.length === 1 ? "יוצר" : "יוצרים"}</span> שמתאימים בול
          </h1>
          <p className="text-sm text-muted-foreground font-medium px-2">בחרו את מי שהכי מדבר אליכם - והקמפיין יוצא לדרך</p>
        </div>

        {loadingMore ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-14 h-14 rounded-full bg-brand opacity-20 blur-2xl absolute inset-0" />
              <div className="w-14 h-14 rounded-full border-4 border-muted border-t-transparent animate-spin-slow relative" style={{ borderTopColor: "hsl(var(--brand-pink))" }} />
            </div>
            <p className="mt-5 text-sm text-muted-foreground font-bold">מחפשים לכם 3 יוצרים נוספים…</p>
          </div>
        ) : (
          <div className="space-y-4">
            {creators.length > 0 && creators.length < 3 && (
              <div className="bg-brand-soft border border-border rounded-2xl p-4 text-center text-sm font-bold text-foreground animate-fade-in-up">
                מצאנו פחות יוצרים — אבל רק כאלה שבאמת מתאימים לקמפיין שלך
              </div>
            )}
            {creators.length === 0 && (
              <div className="bg-card border border-border rounded-2xl p-6 text-center text-sm font-bold text-foreground animate-fade-in-up">
                לא מצאנו יוצרים שמתאימים מספיק לקמפיין שלך — נסו לעדכן את ההגדרות
              </div>
            )}
            {creators.map((c, i) => (
              <CreatorCard key={c.id} creator={c} index={i} />
            ))}
          </div>
        )}

        {!loadingMore && (
          <div className="mt-6 safe-bottom animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={onMore}
              className="w-full py-4 rounded-full font-bold text-sm bg-card border-2 border-border text-foreground shadow-soft tap-scale flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              לא התחברתם? הראו לי 3 נוספים
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function CreatorCard({ creator, index }: { creator: ScoredCreator; index: number }) {
  return (
    <article
      className="bg-card rounded-3xl p-5 shadow-card border border-border animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="ring-brand shrink-0">
          <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${creator.gradient} flex items-center justify-center text-primary-foreground font-black text-lg`}>
            {creator.avatar}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="font-extrabold text-base">{creator.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-brand-soft text-[10px] font-bold text-foreground">
              <span className="ltr-num">{creator.successProbability}%</span> התאמה
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">{creator.niches.join(" · ")} · {creator.location}</p>
          <div className="flex items-center gap-3 mt-1.5 text-[11px] text-muted-foreground font-semibold">
            <span className="flex items-center gap-1">
              <Instagram className="w-3 h-3" /> <span className="ltr-num">{creator.platform}</span>
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3" /> <span className="ltr-num">{creator.followersLabel}</span>
            </span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3" /> <span className="ltr-num">{creator.engagementRate}%</span>
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2.5 mb-4">
        <div className="bg-muted/50 rounded-2xl p-2.5 text-center">
          <div className="text-[10px] text-muted-foreground font-bold mb-0.5">עלות משוערת</div>
          <div className="font-black text-base"><span className="ltr-num">₪{creator.price.toLocaleString("en-US")}</span></div>
        </div>
        <div className="bg-muted/50 rounded-2xl p-2.5 text-center">
          <div className="text-[10px] text-muted-foreground font-bold mb-0.5 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" /> סיכויי הצלחה
          </div>
          <div className="font-black text-base text-brand"><span className="ltr-num">{creator.successProbability}%</span></div>
        </div>
      </div>

      <div className="mb-4">
        <h4 className="text-[10px] font-extrabold text-muted-foreground uppercase tracking-wider mb-2">למה זו התאמה מנצחת</h4>
        <ul className="space-y-1.5">
          {creator.reasons.map((r, idx) => (
            <li key={idx} className="flex items-start gap-2 text-xs">
              <div className="w-4 h-4 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-2.5 h-2.5 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium leading-snug">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() =>
          toast({
            title: `ההצעה נשלחה ל${creator.name} 🎉`,
            description: "נחזור אליכם ברגע שהיוצר יאשר את הקמפיין.",
          })
        }
        className="group relative w-full overflow-hidden rounded-full border border-white/20 bg-brand py-4 text-base font-black text-primary-foreground shadow-cta transition-all duration-150 ease-out hover:-translate-y-0.5 hover:shadow-cta-lg active:translate-y-0 active:scale-[0.92] active:shadow-none flex items-center justify-center gap-2"
      >
        <span className="absolute inset-0 bg-gradient-to-t from-black/10 to-white/10 pointer-events-none" />
        <Send className="w-[18px] h-[18px] transition-transform duration-200 group-active:translate-x-1 group-active:-translate-y-0.5" />
        <span className="relative">שלח הצעה</span>
      </button>
    </article>
  );
}
