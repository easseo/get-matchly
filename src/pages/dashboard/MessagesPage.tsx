import { useState } from "react";
import { Search, Send, Paperclip, Smile } from "lucide-react";

const conversations = [
  {
    id: 1, avatar: "נ", name: "נועה לוי", lastMessage: "תודה רבה! אשלח את הטיוטה מחר",
    time: "10:32", unread: 2, online: true,
  },
  {
    id: 2, avatar: "א", name: "איתי כהן", lastMessage: "מצוין, נשמע מעולה!",
    time: "09:15", unread: 0, online: false,
  },
  {
    id: 3, avatar: "ש", name: "שירה ברק", lastMessage: "שלחתי לך את הקבצים",
    time: "אתמול", unread: 0, online: true,
  },
  {
    id: 4, avatar: "ד", name: "דן גולדברג", lastMessage: "אוקיי, נדבר בשבוע הבא",
    time: "יום ג׳", unread: 0, online: false,
  },
  {
    id: 5, avatar: "מ", name: "מיה שפירא", lastMessage: "תראה את הדרפט ששלחתי",
    time: "יום ב׳", unread: 0, online: false,
  },
];

type Message = { id: number; text: string; fromMe: boolean; time: string };
const messagesByConv: Record<number, Message[]> = {
  1: [
    { id: 1, text: "היי! ראיתי את הקמפיין שלכם ואני מאוד מעוניינת", fromMe: false, time: "10:01" },
    { id: 2, text: "שלום נועה! אנחנו שמחים לשמוע. ספרי לנו קצת על עצמך", fromMe: true, time: "10:05" },
    { id: 3, text: "אני יוצרת תוכן ביוטי עם 124K עוקבים באינסטגרם. יש לי engagement של 6.2%", fromMe: false, time: "10:08" },
    { id: 4, text: "נשמע מצוין! האם יש לך ניסיון עם מוצרי קוסמטיקה?", fromMe: true, time: "10:12" },
    { id: 5, text: "כן! עבדתי עם 12 מותגי קוסמטיקה בשנה האחרונה. אשלח לך את הפורטפוליו", fromMe: false, time: "10:15" },
    { id: 6, text: "מדהים. בוא נתקדם עם ההצעה שלך", fromMe: true, time: "10:20" },
    { id: 7, text: "תודה רבה! אשלח את הטיוטה מחר", fromMe: false, time: "10:32" },
  ],
  2: [
    { id: 1, text: "היי, ראיתי את הקמפיין שלכם", fromMe: false, time: "09:00" },
    { id: 2, text: "שלום! מה שאלתך?", fromMe: true, time: "09:05" },
    { id: 3, text: "מצוין, נשמע מעולה!", fromMe: false, time: "09:15" },
  ],
};

export default function MessagesPage() {
  const [activeConv, setActiveConv] = useState(1);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Record<number, Message[]>>(messagesByConv);
  const [search, setSearch] = useState("");

  const conv = conversations.find((c) => c.id === activeConv)!;
  const currentMessages = messages[activeConv] ?? [];

  const filtered = conversations.filter(
    (c) => c.name.includes(search)
  );

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: input.trim(),
      fromMe: true,
      time: new Date().toLocaleTimeString("he-IL", { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages((prev) => ({
      ...prev,
      [activeConv]: [...(prev[activeConv] ?? []), newMsg],
    }));
    setInput("");
  };

  return (
    <div className="flex h-full" dir="ltr">
      {/* Conversations list */}
      <div className="w-72 shrink-0 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-extrabold text-gray-900 text-base mb-3" dir="rtl">הודעות</h2>
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2">
            <Search size={14} className="text-gray-400 shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="חיפוש..."
              dir="rtl"
              className="bg-transparent text-sm text-gray-600 placeholder-gray-400 outline-none w-full"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider" dir="rtl">כל הצ׳אטים</div>
          {filtered.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveConv(c.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 transition-colors text-right ${
                activeConv === c.id ? "bg-primary/5 border-r-2 border-primary" : "hover:bg-gray-50"
              }`}
              dir="rtl"
            >
              <div className="relative shrink-0">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm"
                  style={{ background: activeConv === c.id ? "var(--gradient-brand)" : "linear-gradient(135deg,#a78bfa,#ec4899)" }}
                >
                  {c.avatar}
                </div>
                {c.online && (
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <span className="font-bold text-sm text-gray-900 truncate">{c.name}</span>
                  <span className="text-[11px] text-gray-400 shrink-0 mr-1">{c.time}</span>
                </div>
                <div className="text-xs text-gray-500 truncate mt-0.5">{c.lastMessage}</div>
              </div>
              {c.unread > 0 && (
                <span className="w-5 h-5 rounded-full text-[11px] font-bold text-white flex items-center justify-center shrink-0" style={{ background: "var(--gradient-brand)" }}>
                  {c.unread}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header */}
        <div className="h-[60px] bg-white border-b border-gray-200 flex items-center px-5 gap-3" dir="rtl">
          <div className="relative">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm" style={{ background: "var(--gradient-brand)" }}>
              {conv?.avatar}
            </div>
            {conv?.online && <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-400 border-2 border-white" />}
          </div>
          <div>
            <div className="font-bold text-gray-900 text-sm">{conv?.name}</div>
            <div className="text-xs text-gray-400">{conv?.online ? "מחובר" : "לא מחובר"}</div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {currentMessages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.fromMe ? "justify-start" : "justify-end"}`} dir="rtl">
              <div
                className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                  msg.fromMe
                    ? "text-white rounded-tr-sm"
                    : "bg-white text-gray-800 border border-gray-100 shadow-sm rounded-tl-sm"
                }`}
                style={msg.fromMe ? { background: "var(--gradient-brand)" } : {}}
              >
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.fromMe ? "text-white/70" : "text-gray-400"}`}>{msg.time}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 p-4">
          <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5" dir="rtl">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="כתוב הודעה..."
              className="flex-1 bg-transparent text-sm text-gray-700 placeholder-gray-400 outline-none"
            />
            <div className="flex items-center gap-2 shrink-0" dir="ltr">
              <button className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <Smile size={16} className="text-gray-400" />
              </button>
              <button className="p-1.5 rounded-lg hover:bg-gray-200 transition-colors">
                <Paperclip size={16} className="text-gray-400" />
              </button>
              <button
                onClick={sendMessage}
                className="p-2 rounded-xl text-white transition-opacity hover:opacity-90"
                style={{ background: "var(--gradient-brand)" }}
              >
                <Send size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
