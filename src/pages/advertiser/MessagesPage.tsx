import { useEffect, useRef, useState } from "react";
import { Search, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/context/UserContext";

type ConvRow = {
  id: string;
  campaign_id: string;
  creator_id: string;
  advertiser_id: string;
  campaigns: { title: string } | null;
  profiles: { full_name: string } | null; // other person
};

type MsgRow = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
};

export default function AdvertiserMessagesPage() {
  const { user } = useUser();
  const [convs, setConvs] = useState<ConvRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [msgs, setMsgs] = useState<MsgRow[]>([]);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  // Fetch conversations
  useEffect(() => {
    if (!user) return;
    supabase
      .from("conversations")
      .select("id, campaign_id, creator_id, advertiser_id, campaigns(title), profiles!conversations_creator_id_fkey(full_name)")
      .eq("advertiser_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setConvs((data as ConvRow[]) ?? []);
        if (data && data.length > 0 && !activeId) setActiveId(data[0].id);
      });
  }, [user]);

  // Fetch messages + realtime
  useEffect(() => {
    if (!activeId) return;
    supabase
      .from("messages")
      .select("*")
      .eq("conversation_id", activeId)
      .order("created_at", { ascending: true })
      .then(({ data }) => setMsgs((data as MsgRow[]) ?? []));

    const channel = supabase
      .channel(`messages:${activeId}`)
      .on("postgres_changes", {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${activeId}`,
      }, (payload) => {
        setMsgs((prev) => [...prev, payload.new as MsgRow]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [activeId]);

  // Scroll to bottom on new message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  const send = async () => {
    if (!input.trim() || !user || !activeId) return;
    const content = input.trim();
    setInput("");
    await supabase.from("messages").insert({
      conversation_id: activeId,
      sender_id: user.id,
      content,
    });
  };

  const activeConv = convs.find((c) => c.id === activeId);
  const filtered = convs.filter((c) =>
    (c.profiles?.full_name ?? "").includes(search) ||
    (c.campaigns?.title ?? "").includes(search)
  );

  if (convs.length === 0) return (
    <div className="flex-1 flex items-center justify-center p-8 text-center" dir="rtl">
      <div>
        <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <Send size={24} className="text-gray-300" />
        </div>
        <h3 className="font-extrabold text-gray-700 mb-1">אין שיחות עדיין</h3>
        <p className="text-sm text-gray-400">שיחות נפתחות לאחר אישור הצעה</p>
      </div>
    </div>
  );

  return (
    <div className="flex h-full" dir="rtl">
      {/* Sidebar */}
      <div className="w-72 shrink-0 bg-white border-l border-gray-100 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900 mb-3">הודעות</h2>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400 shrink-0" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="חיפוש..." className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`w-full flex items-center gap-3 p-3.5 text-right hover:bg-gray-50 transition-colors ${activeId === c.id ? "bg-primary/5 border-r-2 border-primary" : ""}`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--gradient-brand)" }}>
                {(c.profiles?.full_name ?? "?")[0]}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <div className="font-bold text-sm text-gray-900 truncate">{c.profiles?.full_name ?? "יוצר תוכן"}</div>
                <div className="text-[11px] text-primary font-semibold truncate mt-0.5">{c.campaigns?.title}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      {activeConv ? (
        <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
          {/* Header */}
          <div className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-3 shrink-0">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--gradient-brand)" }}>
              {(activeConv.profiles?.full_name ?? "?")[0]}
            </div>
            <div>
              <div className="font-bold text-gray-900 text-sm">{activeConv.profiles?.full_name ?? "יוצר תוכן"}</div>
              <div className="text-xs text-primary font-semibold">{activeConv.campaigns?.title}</div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {msgs.map((m) => {
              const fromMe = m.sender_id === user?.id;
              return (
                <div key={m.id} className={`flex ${fromMe ? "justify-start" : "justify-end"}`}>
                  <div
                    className={`max-w-[65%] rounded-2xl px-4 py-2.5 ${fromMe ? "text-white" : "bg-white border border-gray-100 text-gray-800"}`}
                    style={fromMe ? { background: "var(--gradient-brand)" } : {}}
                  >
                    <p className="text-sm leading-relaxed">{m.content}</p>
                    <p className={`text-[10px] mt-1 ${fromMe ? "text-white/70" : "text-gray-400"}`}>
                      {new Date(m.created_at).toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
            <button onClick={send} className="p-2.5 rounded-xl text-white shrink-0 transition-opacity hover:opacity-90" style={{ background: "var(--gradient-brand)" }}>
              <Send size={16} />
            </button>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
              placeholder="כתוב הודעה..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
