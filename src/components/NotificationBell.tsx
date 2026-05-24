import { useEffect, useRef, useState } from "react";
import { Bell, Check, Megaphone, MessageSquare, CheckCircle, XCircle, DollarSign } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";
import type { Notification, NotificationType } from "@/lib/supabase";

const typeConfig: Record<NotificationType, { icon: React.ElementType; label: string; color: string }> = {
  new_proposal:       { icon: Megaphone,     label: "הצעה חדשה",       color: "text-purple-500" },
  proposal_accepted:  { icon: CheckCircle,   label: "הצעה התקבלה",     color: "text-green-500"  },
  proposal_rejected:  { icon: XCircle,       label: "הצעה נדחתה",      color: "text-red-500"    },
  payment_deposited:  { icon: DollarSign,    label: "תשלום הופקד",     color: "text-yellow-500" },
  content_submitted:  { icon: Megaphone,     label: "תוכן הוגש",       color: "text-blue-500"   },
  content_approved:   { icon: CheckCircle,   label: "תוכן אושר",       color: "text-green-500"  },
  campaign_completed: { icon: CheckCircle,   label: "קמפיין הושלם",    color: "text-green-500"  },
  new_message:        { icon: MessageSquare, label: "הודעה חדשה",      color: "text-primary"    },
};

export default function NotificationBell() {
  const { user } = useUser();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const fetchNotifications = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(20);
    setNotifications((data as Notification[]) ?? []);
  };

  useEffect(() => {
    if (!user) return;
    fetchNotifications();

    const channel = supabase
      .channel(`notifications:${user.id}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "notifications",
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        setNotifications((prev) => [payload.new as Notification, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const unread = notifications.filter((n) => !n.read_at).length;

  const markAllRead = async () => {
    if (!user || unread === 0) return;
    const ids = notifications.filter((n) => !n.read_at).map((n) => n.id);
    await supabase.from("notifications").update({ read_at: new Date().toISOString() }).in("id", ids);
    setNotifications((prev) => prev.map((n) => ({ ...n, read_at: n.read_at ?? new Date().toISOString() })));
  };

  const handleOpen = () => {
    setOpen((prev) => !prev);
    if (!open) markAllRead();
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const m = Math.floor(diff / 60000);
    if (m < 1) return "עכשיו";
    if (m < 60) return `לפני ${m} דקות`;
    const h = Math.floor(m / 60);
    if (h < 24) return `לפני ${h} שעות`;
    return `לפני ${Math.floor(h / 24)} ימים`;
  };

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleOpen}
        className="relative p-1.5 rounded-xl hover:bg-gray-100 transition-colors"
      >
        <Bell size={18} className="text-gray-500" />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full text-[10px] font-bold text-white flex items-center justify-center" style={{ background: "var(--gradient-brand)" }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 top-10 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 overflow-hidden" dir="rtl">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-extrabold text-gray-900 text-sm">התראות</h3>
            {unread > 0 && (
              <button onClick={markAllRead} className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline">
                <Check size={12} /> סמן הכל כנקרא
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
            {notifications.length === 0 ? (
              <div className="py-8 text-center text-sm text-gray-400">אין התראות</div>
            ) : (
              notifications.map((n) => {
                const cfg = typeConfig[n.type] ?? typeConfig.new_message;
                const Icon = cfg.icon;
                const isUnread = !n.read_at;
                return (
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 ${isUnread ? "bg-primary/5" : ""}`}>
                    <div className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mt-0.5`}>
                      <Icon size={15} className={cfg.color} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-gray-900">{cfg.label}</span>
                        <span className="text-[10px] text-gray-400 shrink-0">{formatTime(n.created_at)}</span>
                      </div>
                      {n.data?.message && (
                        <p className="text-xs text-gray-600 mt-0.5 truncate">{String(n.data.message)}</p>
                      )}
                    </div>
                    {isUnread && <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-2" />}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
