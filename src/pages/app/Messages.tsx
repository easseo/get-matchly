import { PageHeader } from "@/components/app/KpiCard";
import { Send, Search, CheckCheck, ArrowRight } from "lucide-react";
import { mockProposals } from "@/data/mockApp";
import { useState, useRef, useEffect } from "react";

type Message = {
  id: string;
  side: "left" | "right";
  text: string;
  time: string;
  read?: boolean;
};

const initialMessages: Record<string, Message[]> = {
  p1: [
    { id: "1", side: "left",  text: "היי! התוכן שלכם מתאים בול לקהל שלי. אשמח להציג את הקולקציה ברילס וסטוריז.", time: "09:12" },
    { id: "2", side: "right", text: "תודה על ההצעה! זה נשמע מעולה. נוכל לדבר על לוחות הזמנים?", time: "09:45", read: true },
    { id: "3", side: "left",  text: "בטח, אפשר השבוע אחה\"צ?", time: "10:01" },
    { id: "4", side: "right", text: "יום רביעי ב-15:00 מתאים לכם?", time: "10:08", read: true },
  ],
  p2: [
    { id: "1", side: "left",  text: "מומחית באופנה בת קיימא, אשמח לשתף פעולה עם דגש על אקולוגיה.", time: "אתמול" },
    { id: "2", side: "right", text: "קראנו את הפרופיל שלך ואנחנו מאוד מתרשמים! מה הזמינות שלך לחודש הקרוב?", time: "אתמול", read: true },
  ],
  p3: [
    { id: "1", side: "left",  text: "אני מאמנת כושר עם קהל מחויב. אשמח להציע סדרת רילסים של אימונים עם האפליקציה.", time: "לפני יומיים" },
  ],
  p4: [
    { id: "1", side: "left",  text: "מתמחה בביקורות סקין-קר אותנטיות. תוכלו לסמוך על חוות דעת כנה ומקצועית.", time: "לפני שבוע" },
  ],
};

const unreadCounts: Record<string, number> = { p1: 1, p3: 1 };

export default function Messages() {
  const conversations = mockProposals.slice(0, 4);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [unread, setUnread] = useState<Record<string, number>>(unreadCounts);
  const bottomRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId);
  const activeMessages = activeId ? (messages[activeId] ?? []) : [];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeId, activeMessages.length]);

  const handleSelect = (id: string) => {
    setActiveId(id);
    setUnread(prev => ({ ...prev, [id]: 0 }));
  };

  const handleBack = () => setActiveId(null);

  const handleSend = () => {
    const text = input.trim();
    if (!text || !activeId) return;
    const now = new Date();
    const time = `${now.getHours().toString().padStart(2, "0")}:${now.getMinutes().toString().padStart(2, "0")}`;
    setMessages(prev => ({
      ...prev,
      [activeId]: [...(prev[activeId] ?? []), { id: Date.now().toString(), side: "right", text, time, read: true }],
    }));
    setInput("");
  };

  const filteredConversations = conversations.filter(c =>
    search === "" || c.creatorName.includes(search) || c.campaignTitle.includes(search)
  );

  const lastMessage = (id: string) => {
    const msgs = messages[id] ?? [];
    return msgs[msgs.length - 1];
  };

  // ── Conversation list ──────────────────────────────────
  const ConversationList = (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b border-gray-100 shrink-0">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="חיפוש שיחה..."
            className="w-full bg-gray-50 border border-gray-100 rounded-xl pr-9 pl-3 py-2.5 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((c) => {
          const last = lastMessage(c.id);
          const isActive = activeId === c.id;
          const badge = unread[c.id] || 0;
          return (
            <button
              key={c.id}
              onClick={() => handleSelect(c.id)}
              className={`w-full text-right px-4 py-3.5 border-b border-gray-50 flex items-center gap-3 transition-colors ${
                isActive ? "bg-primary/5" : "hover:bg-gray-50"
              }`}
            >
              <div className="relative shrink-0">
                <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${c.gradient} flex items-center justify-center text-white font-bold text-sm`}>
                  {c.creatorName.slice(0, 1)}
                </div>
                {badge > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full bg-primary text-white text-[9px] font-black flex items-center justify-center px-1">
                    {badge}
                  </span>
                )}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center justify-between mb-0.5">
                  <span className={`text-sm truncate ${badge > 0 ? "font-extrabold text-gray-900" : "font-semibold text-gray-700"}`}>
                    {c.creatorName}
                  </span>
                  {last && <span className="text-[10px] text-gray-400 shrink-0 mr-2">{last.time}</span>}
                </div>
                <div className="flex items-center gap-1 justify-end">
                  {last?.side === "right" && <CheckCheck className="w-3 h-3 text-primary shrink-0" />}
                  <span className={`text-xs truncate ${badge > 0 ? "text-gray-700 font-semibold" : "text-gray-400"}`}>
                    {last?.text ?? c.message}
                  </span>
                </div>
              </div>
            </button>
          );
        })}
        {filteredConversations.length === 0 && (
          <div className="py-12 text-center text-sm text-gray-400">לא נמצאו שיחות</div>
        )}
      </div>
    </div>
  );

  // ── Chat panel ──────────────────────────────────────────
  const ChatPanel = active ? (
    <div className="flex flex-col h-full min-h-0">
      {/* Chat header */}
      <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0">
        {/* Back button — mobile only */}
        <button
          onClick={handleBack}
          className="md:hidden p-1.5 -mr-1 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
          aria-label="חזרה"
        >
          <ArrowRight className="w-5 h-5 text-gray-500" />
        </button>
        <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${active.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {active.creatorName.slice(0, 1)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-bold text-gray-900 text-sm">{active.creatorName}</div>
          <div className="text-[11px] text-gray-400 truncate">{active.campaignTitle}</div>
        </div>
        <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 ${
          active.status === "אושר"
            ? "bg-emerald-50 text-emerald-700 border-emerald-100"
            : "bg-orange-50 text-orange-600 border-orange-100"
        }`}>
          {active.status === "אושר" ? "מאושר" : "ממתין"}
        </span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/30">
        {activeMessages.map((msg) => (
          <Bubble key={msg.id} side={msg.side} gradient={active.gradient} time={msg.time} read={msg.read}>
            {msg.text}
          </Bubble>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 items-end shrink-0">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
          className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder="כתבו הודעה..."
        />
        <button
          onClick={handleSend}
          disabled={!input.trim()}
          className="w-11 h-11 rounded-2xl text-white disabled:opacity-40 transition-opacity flex items-center justify-center shrink-0"
          style={{ background: "var(--gradient-brand)" }}
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  ) : (
    <div className="hidden md:flex flex-1 items-center justify-center text-gray-400 text-sm font-medium">
      בחרו שיחה להתחלת צ׳אט
    </div>
  );

  return (
    <>
      <PageHeader title="הודעות" subtitle="תקשורת ישירה עם יוצרי התוכן" />

      {/* Desktop: 2-column layout */}
      <div className="hidden md:grid md:grid-cols-[300px_1fr] bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden h-[600px]">
        <aside className="border-l border-gray-100 bg-white flex flex-col">
          {ConversationList}
        </aside>
        <div className="flex flex-col min-h-0">
          {ChatPanel}
        </div>
      </div>

      {/* Mobile: conversation list */}
      <div className="md:hidden bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {ConversationList}
      </div>

      {/* Mobile: full-screen chat overlay */}
      {activeId && active && (
        <div className="md:hidden fixed inset-0 z-50 bg-white flex flex-col" dir="rtl">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-3 bg-white shrink-0"
            style={{ paddingTop: "calc(env(safe-area-inset-top) + 12px)" }}>
            <button
              onClick={handleBack}
              className="p-2 -mr-1 rounded-xl hover:bg-gray-100 transition-colors shrink-0"
              aria-label="חזרה"
            >
              <ArrowRight className="w-5 h-5 text-gray-600" />
            </button>
            <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${active.gradient} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
              {active.creatorName.slice(0, 1)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-bold text-gray-900 text-sm">{active.creatorName}</div>
              <div className="text-[11px] text-gray-400 truncate">{active.campaignTitle}</div>
            </div>
            <span className={`text-[10px] font-bold px-2 py-1 rounded-full border shrink-0 ${
              active.status === "אושר"
                ? "bg-emerald-50 text-emerald-700 border-emerald-100"
                : "bg-orange-50 text-orange-600 border-orange-100"
            }`}>
              {active.status === "אושר" ? "מאושר" : "ממתין"}
            </span>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50/30">
            {activeMessages.map((msg) => (
              <Bubble key={msg.id} side={msg.side} gradient={active.gradient} time={msg.time} read={msg.read}>
                {msg.text}
              </Bubble>
            ))}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 border-t border-gray-100 bg-white flex gap-2 items-end shrink-0"
            style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)" }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), handleSend())}
              className="flex-1 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
              placeholder="כתבו הודעה..."
              autoFocus
            />
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="w-11 h-11 rounded-2xl text-white disabled:opacity-40 transition-opacity flex items-center justify-center shrink-0"
              style={{ background: "var(--gradient-brand)" }}
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function Bubble({
  side, gradient, time, read, children,
}: {
  side: "left" | "right"; gradient?: string; time: string; read?: boolean; children: React.ReactNode;
}) {
  if (side === "right") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%]">
          <div className="px-4 py-2.5 rounded-2xl rounded-tr-sm text-sm text-white shadow-sm leading-relaxed" style={{ background: "var(--gradient-brand)" }}>
            {children}
          </div>
          <div className="flex items-center justify-end gap-1 mt-1">
            <span className="text-[10px] text-gray-400">{time}</span>
            {read && <CheckCheck className="w-3 h-3 text-primary" />}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2 items-end">
      <div className={`w-7 h-7 rounded-full bg-gradient-to-br ${gradient} shrink-0 mb-4`} />
      <div className="max-w-[75%]">
        <div className="px-4 py-2.5 rounded-2xl rounded-tl-sm text-sm bg-white border border-gray-100 shadow-sm text-gray-700 leading-relaxed">
          {children}
        </div>
        <div className="mt-1 mr-1">
          <span className="text-[10px] text-gray-400">{time}</span>
        </div>
      </div>
    </div>
  );
}
