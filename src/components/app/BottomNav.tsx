import { NavLink } from "react-router-dom";
import {
  LayoutDashboard, PlusCircle, FileText, MessageSquare, CreditCard,
  Compass, DollarSign, Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const advertiserItems = [
  { label: "דשבורד",     url: "/app/dashboard",  icon: LayoutDashboard },
  { label: "קמפיין חדש", url: "/app/create",      icon: PlusCircle },
  { label: "הצעות",      url: "/app/proposals",  icon: FileText },
  { label: "הודעות",     url: "/app/messages",   icon: MessageSquare },
  { label: "תשלומים",    url: "/app/payments",   icon: CreditCard },
];

const creatorItems = [
  { label: "דשבורד",    url: "/app/creator/dashboard", icon: LayoutDashboard },
  { label: "קמפיינים",  url: "/app/creator/browse",    icon: Compass },
  { label: "הצעות",     url: "/app/creator/proposals", icon: FileText },
  { label: "רווחים",    url: "/app/creator/earnings",  icon: DollarSign },
  { label: "ביקורות",   url: "/app/creator/reviews",   icon: Star },
];

export function BottomNav({ role }: { role: "advertiser" | "creator" }) {
  const items = role === "advertiser" ? advertiserItems : creatorItems;

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-100 safe-bottom"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-stretch h-[60px]">
        {items.map(({ label, url, icon: Icon }) => (
          <NavLink
            key={url}
            to={url}
            end={url.endsWith("dashboard")}
            className={({ isActive }) =>
              cn(
                "flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold transition-colors",
                isActive ? "text-transparent" : "text-gray-400 hover:text-gray-600"
              )
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={cn(
                    "w-9 h-9 rounded-2xl flex items-center justify-center transition-all",
                    isActive ? "shadow-md" : ""
                  )}
                  style={isActive ? { background: "var(--gradient-brand)" } : undefined}
                >
                  <Icon
                    className={cn("w-5 h-5", isActive ? "text-white" : "text-gray-400")}
                    strokeWidth={isActive ? 2.5 : 1.8}
                  />
                </span>
                <span className={isActive ? "text-transparent bg-clip-text font-extrabold"
                  : "text-gray-400"}
                  style={isActive ? { backgroundImage: "var(--gradient-brand)" } : undefined}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
