import { useState } from "react";
import { Send, Search } from "lucide-react";

const conversations = [
  { id: 1, name: "נועה לוי", handle: "@noa_levy", avatar: "נ", lastMessage: "תודה! אשלח את הדראפט מחר", time: "14:32", unread: 2, campaign: "קמפיין אופנה קיץ 2026" },
  { id: 2, name: "איתי כהן", handle: "@itay.cohen", avatar: "א", lastMessage: "האם אפשר לקבל מוצרים נוספים?", time: "11:15", unread: 0, campaign: "קולקציית יופי" },
  { id: 3, name: "שירה ברק", handle: "@shira_barak", avatar: "ש", lastMessage: "הפוסט עלה!", time: "אתמול", unread: 0, campaign: "ביקורת טק" },
];

const initialMessages: Record<number, { id: number; text: string; from: "me" | "them"; time: string }[]> = {
  1: [
    { id: 1, text: "שלום! ראיתי את הקמפיין שלכם, נשמע מעניין מאוד", from: "them", time: "10:00" },
    { id: 2, text: "שמחים שאתה מעוניין! תרצה שנשלח דוגמאות?", from: "me", time: "10:05" },
    { id: 3, text: "בהחלט, כן בבקשה", from: "them", time: "10:07" },
    { id: 4, text: "תודה! אשלח את הדראפט מחר", from: "them", time: "14:32" },
  ],
  2: [
    { id: 1, text: "קיבלתי את המוצרים, תודה רבה!", from: "them", time: "09:00" },
    { id: 2, text: "מעולה! אנחנו מצפים לתוצאות", from: "me", time: "09:10" },
    { id: 3, text: "האם אפשר לקבל מוצרים נוספים?", from: "them", time: "11:15" },
  ],
  3: [
    { id: 1, text: "הפוסט מוכן, שולחת לאישור", from: "them", time: "אתמול 15:00" },
    { id: 2, text: "מאושר! נראה מדהים", from: "me", time: "אתמול 15:30" },
    { id: 3, text: "הפוסט עלה!", from: "them", time: "אתמול 18:00" },
  ],
};

export default function AdvertiserMessagesPage() {
  const [activeConv, setActiveConv] = useState(1);
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");

  const send = () => {
    if (!input.trim()) return;
    const newMsg = { id: Date.now(), text: input, from: "me" as const, time: "עכשיו" };
    setMessages((prev) => ({ ...prev, [activeConv]: [...(prev[activeConv] ?? []), newMsg] }));
    setInput("");
  };

  const conv = conversations.find((c) => c.id === activeConv)!;

  return (
    <div className="flex h-full">
      {/* Sidebar */}
      <div className="w-72 border-l border-gray-100 bg-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900 mb-3">הודעות</h2>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Search size={13} className="text-gray-400 shrink-0" />
            <input type="text" placeholder="חיפוש..." className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-gray-50">
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className={`w-full flex items-center gap-3 p-3.5 text-right hover:bg-gray-50 transition-colors ${activeConv === c.id ? "bg-primary/5 border-r-2 border-primary" : ""}`}
            >
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--gradient-brand)" }}>
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">{c.time}</span>
                  <span className="font-bold text-sm text-gray-900">{c.name}</span>
                </div>
                <p className="text-xs text-gray-500 truncate mt-0.5">{c.lastMessage}</p>
                <p className="text-[10px] text-primary font-semibold truncate mt-0.5">{c.campaign}</p>
              </div>
              {c.unread > 0 && (
                <div className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0" style={{ background: "var(--gradient-brand)" }}>
                  {c.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-100 px-5 py-3.5 flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0" style={{ background: "var(--gradient-brand)" }}>
            {conv.avatar}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">{conv.name}</div>
            <div className="text-xs text-primary font-semibold">{conv.campaign}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {(messages[activeConv] ?? []).map((m) => (
            <div key={m.id} className={`flex ${m.from === "me" ? "justify-start" : "justify-end"}`}>
              <div className={`max-w-[65%] rounded-2xl px-4 py-2.5 ${m.from === "me" ? "text-white" : "bg-white border border-gray-100 text-gray-800"}`}
                style={m.from === "me" ? { background: "var(--gradient-brand)" } : {}}>
                <p className="text-sm leading-relaxed">{m.text}</p>
                <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/70" : "text-gray-400"}`}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex items-center gap-3">
          <button
            onClick={send}
            className="p-2.5 rounded-xl text-white shrink-0 transition-opacity hover:opacity-90"
            style={{ background: "var(--gradient-brand)" }}
          >
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
    </div>
  );
}
