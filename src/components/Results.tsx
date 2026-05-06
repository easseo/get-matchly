import { Instagram, Users, TrendingUp, Check, Send, RefreshCw } from "lucide-react";
import type { Creator } from "@/data/creators";
import { toast } from "@/hooks/use-toast";

interface ResultsProps {
  creators: Creator[];
  onMore: () => void;
  onRestart: () => void;
  loadingMore: boolean;
}

export default function Results({ creators, onMore, onRestart, loadingMore }: ResultsProps) {
  return (
    <div className="min-h-screen bg-mesh pb-20">
      <header className="sticky top-0 z-20 backdrop-blur-lg bg-background/70 border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <button onClick={onRestart} className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-smooth">
            קמפיין חדש
          </button>
          <span className="font-extrabold text-brand">Matchly</span>
          <div className="w-20" />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 pt-8">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-soft mb-4">
            <Check className="w-4 h-4 text-brand" style={{ color: "hsl(var(--brand-pink))" }} />
            <span className="text-sm font-semibold text-muted-foreground">ההתאמות מוכנות</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black mb-2">
            מצאנו לך <span className="text-brand">3 יוצרים</span> מדויקים
          </h1>
          <p className="text-muted-foreground font-medium">בחר את היוצר שמדבר אליך והתחל את הקמפיין</p>
        </div>

        {loadingMore ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-brand opacity-20 blur-2xl absolute inset-0" />
              <div className="w-16 h-16 rounded-full border-4 border-muted border-t-transparent animate-spin-slow relative" style={{ borderTopColor: "hsl(var(--brand-pink))" }} />
            </div>
            <p className="mt-6 text-muted-foreground font-semibold">מחפש 3 יוצרים אחרים בשבילך...</p>
          </div>
        ) : (
          <div className="space-y-5">
            {creators.map((c, i) => (
              <CreatorCard key={c.id} creator={c} index={i} />
            ))}
          </div>
        )}

        {!loadingMore && (
          <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <button
              onClick={onMore}
              className="w-full py-4 rounded-full font-bold text-base bg-card border-2 border-border hover:border-primary/40 hover:bg-brand-soft text-foreground shadow-soft transition-bounce flex items-center justify-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              לא התחברת? קבל עוד 3
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

function CreatorCard({ creator, index }: { creator: Creator; index: number }) {
  return (
    <article
      className="bg-card rounded-3xl p-6 shadow-card border border-border animate-fade-in-up"
      style={{ animationDelay: `${index * 0.1}s` }}
    >
      <div className="flex items-start gap-4 mb-5">
        {/* Avatar with gradient ring */}
        <div className="ring-brand shrink-0">
          <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${creator.gradient} flex items-center justify-center text-primary-foreground font-black text-xl`}>
            {creator.avatar}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-extrabold text-lg">{creator.name}</h3>
            <span className="px-2 py-0.5 rounded-full bg-brand-soft text-xs font-bold text-foreground">
              {creator.successProbability}% התאמה
            </span>
          </div>
          <p className="text-sm text-muted-foreground font-medium mt-0.5">{creator.niche}</p>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground font-medium">
            <span className="flex items-center gap-1">
              <Instagram className="w-3.5 h-3.5" /> {creator.platform}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> {creator.followers}
            </span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-muted/50 rounded-2xl p-3 text-center">
          <div className="text-xs text-muted-foreground font-semibold mb-1">מחיר משוער</div>
          <div className="font-black text-lg">{creator.price.toLocaleString()} ₪</div>
        </div>
        <div className="bg-muted/50 rounded-2xl p-3 text-center">
          <div className="text-xs text-muted-foreground font-semibold mb-1 flex items-center justify-center gap-1">
            <TrendingUp className="w-3 h-3" /> סיכוי הצלחה
          </div>
          <div className="font-black text-lg text-brand">{creator.successProbability}%</div>
        </div>
      </div>

      {/* Reasons */}
      <div className="mb-5">
        <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">למה הוא מתאים</h4>
        <ul className="space-y-2">
          {creator.reasons.map((r, idx) => (
            <li key={idx} className="flex items-start gap-2 text-sm">
              <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary-foreground" />
              </div>
              <span className="text-foreground font-medium">{r}</span>
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={() =>
          toast({
            title: `ההצעה נשלחה ל-${creator.name} 🎉`,
            description: "ניצור איתך קשר ברגע שהיוצר יאשר את הקמפיין.",
          })
        }
        className="w-full py-3.5 rounded-full font-bold bg-brand text-primary-foreground shadow-glow hover:scale-[1.02] transition-bounce flex items-center justify-center gap-2"
      >
        <Send className="w-4 h-4" />
        שלח הצעה
      </button>
    </article>
  );
}
