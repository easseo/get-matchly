import { Star, TrendingUp, DollarSign } from "lucide-react";

const reviews = [
  {
    id: 1, brand: "FitLife App", brandLetter: "F", brandColor: "bg-orange-100 text-orange-600",
    date: "13 נובמבר 2025", campaignDate: "10 נובמבר 2025",
    rating: 3.5, totalRating: 5,
    text: "עבודה מצוינת! הרילס באינסטגרם היה יצירתי, באיכות גבוהה והוגש לפני המועד האחרון. שיעור המעורבות עלה על הציפיות שלנו. ממליצים בחום!",
    categories: [
      { label: "איכות תוכן", rating: 1 },
      { label: "תקשורת", rating: 4 },
      { label: "מהירות הגשה", rating: 5 },
      { label: "מקצועיות", rating: 5 },
    ],
  },
  {
    id: 2, brand: "FitLife App", brandLetter: "F", brandColor: "bg-orange-100 text-orange-600",
    date: "12 נובמבר 2025", campaignDate: "10 נובמבר 2025",
    rating: 5, totalRating: 5,
    text: "עבודה מצוינת! הרילס באינסטגרם היה יצירתי, באיכות גבוהה והוגש לפני המועד האחרון. שיעור המעורבות עלה על הציפיות שלנו. ממליצים בחום!",
    categories: [
      { label: "איכות תוכן", rating: 5 },
      { label: "תקשורת", rating: 5 },
      { label: "מהירות הגשה", rating: 5 },
      { label: "מקצועיות", rating: 5 },
    ],
  },
];

const ratingBars = [
  { stars: 5, width: 70 },
  { stars: 4, width: 20 },
  { stars: 3, width: 5 },
  { stars: 2, width: 3 },
  { stars: 1, width: 2 },
];

function StarRating({ rating, max = 5, size = 14 }: { rating: number; max?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={i < Math.floor(rating) ? "fill-amber-400 text-amber-400" : i < rating ? "fill-amber-200 text-amber-400" : "text-gray-200 fill-gray-200"}
        />
      ))}
    </div>
  );
}

export default function ReviewsPage() {
  return (
    <div className="p-6 max-w-4xl space-y-6">
      <div>
        <h1 className="text-xl font-extrabold text-gray-900">ביקורות</h1>
        <p className="text-sm text-gray-500 mt-0.5">נהל את המוניטין שלך וסקור שיתופי פעולה</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "דירוג כולל", value: "4.8", icon: Star, iconColor: "text-amber-400", bg: "bg-amber-50", border: "border-amber-100", sub: "מתוך 5" },
          { label: "סה\"כ הכנסות", value: "₪1,840", icon: DollarSign, iconColor: "text-purple-500", bg: "bg-purple-50", border: "border-purple-100", sub: "כולל" },
          { label: "ביקורות 5 כוכבים", value: "3", icon: TrendingUp, iconColor: "text-green-500", bg: "bg-green-50", border: "border-green-100", sub: "מתוך 5" },
        ].map((s) => (
          <div key={s.label} className={`bg-white rounded-2xl p-5 border ${s.border} shadow-sm`}>
            <div className="flex items-center justify-between mb-2">
              <div className={`w-9 h-9 rounded-xl ${s.bg} flex items-center justify-center`}>
                <s.icon size={18} className={s.iconColor} />
              </div>
              <span className="text-xs text-gray-400 font-medium">{s.sub}</span>
            </div>
            <div className="text-2xl font-black text-gray-900">{s.value}</div>
            <div className="text-sm text-gray-500 font-medium mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Rating breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-start gap-10">
          <div className="text-center shrink-0">
            <div className="text-5xl font-black text-gray-900">4.7</div>
            <StarRating rating={4.7} size={16} />
            <div className="text-xs text-gray-400 mt-1">מבוסס על 166 ביקורות</div>
          </div>
          <div className="flex-1 space-y-2">
            {ratingBars.map((b) => (
              <div key={b.stars} className="flex items-center gap-2">
                <span className="text-xs text-gray-500 w-4 shrink-0">{b.stars}</span>
                <Star size={11} className="fill-amber-400 text-amber-400 shrink-0" />
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full rounded-full bg-amber-400" style={{ width: `${b.width}%` }} />
                </div>
                <span className="text-xs text-gray-400 w-6 shrink-0">{b.width}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-4">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm ${r.brandColor}`}>
                  {r.brandLetter}
                </div>
                <div>
                  <div className="font-bold text-gray-900">{r.brand}</div>
                  <div className="text-xs text-gray-400">{r.campaignDate}</div>
                </div>
              </div>
              <div className="text-right">
                <StarRating rating={r.rating} size={16} />
                <div className="text-xs text-gray-400 mt-1">{r.date}</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-4">{r.text}</p>

            <div className="grid grid-cols-4 gap-3 pt-3 border-t border-gray-100">
              {r.categories.map((cat) => (
                <div key={cat.label} className="text-center">
                  <div className="text-xs text-gray-400 mb-1">{cat.label}</div>
                  <StarRating rating={cat.rating} size={11} />
                  <div className="text-xs font-bold text-gray-700 mt-0.5">{cat.rating}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
