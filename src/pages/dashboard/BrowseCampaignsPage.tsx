import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Instagram, MapPin, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { Campaign } from "@/lib/supabase";

export default function BrowseCampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const fetchCampaigns = async () => {
      const { data } = await supabase
        .from("campaigns")
        .select("*")
        .in("status", ["published", "receiving_proposals"])
        .order("created_at", { ascending: false });
      setCampaigns((data as Campaign[]) ?? []);
      setLoading(false);
    };
    fetchCampaigns();
  }, []);

  const filtered = campaigns.filter(c =>
    c.title.includes(search) ||
    c.business_name.includes(search) ||
    c.business_type.includes(search)
  );

  if (loading) return (
    <div className="p-6 flex items-center justify-center min-h-[300px]">
      <div className="w-7 h-7 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <div className="p-4 md:p-6" dir="rtl">
      <div className="mb-5">
        <h1 className="text-2xl font-extrabold text-gray-900">גלישת קמפיינים</h1>
        <p className="text-sm text-gray-500 mt-0.5">{filtered.length} קמפיינים פעילים</p>
      </div>

      <div className="relative mb-4">
        <Search size={15} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="חפש לפי שם, עסק, תחום..."
          className="w-full border border-gray-200 rounded-xl pr-10 pl-4 py-3 text-sm outline-none focus:border-primary transition-colors"
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <Search size={28} className="text-gray-400" />
          </div>
          <h3 className="font-extrabold text-gray-700 mb-2">
            {search ? "לא נמצאו קמפיינים" : "אין קמפיינים פעילים כרגע"}
          </h3>
          <p className="text-sm text-gray-500">נסה שוב מאוחר יותר</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(c => (
            <Link key={c.id} to={`/creator/campaigns/${c.id}`} className="block bg-white rounded-2xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600">{c.business_type}</span>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-gray-400">
                  <Instagram size={11} className="text-pink-500" />
                  <span>Instagram</span>
                </div>
              </div>
              <h3 className="font-extrabold text-gray-900 mb-0.5">{c.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{c.business_name}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <DollarSign size={12} />
                  ₪{c.budget_min.toLocaleString()}–₪{c.budget_max.toLocaleString()}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin size={12} />
                  {c.target_location}
                </span>
                <span>{c.content_format.join(", ")}</span>
              </div>
              {c.deadline && (
                <div className="mt-2 pt-2 border-t border-gray-100 text-[11px] text-gray-400">
                  דדליין: {new Date(c.deadline).toLocaleDateString("he-IL")}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
