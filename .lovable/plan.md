## מה ייבנה

דשבורד אחרי התחברות עם סייידבר בסגנון Creator Bridge מהפיגמה, משולב במערכת העיצוב הקיימת של Matchly (RTL, ורוד-כתום, גרדיאנטים, shadow-cta).

## אותנטיקציה

- Email/Password + Google sign-in דרך Lovable Cloud (כבר פעיל)
- מסך `/auth` (כניסה/הרשמה, בחירת תפקיד: מפרסם / יוצר)
- טבלת `profiles` עם `role` (`advertiser` | `creator`), מקושרת ל-`auth.users`
- טריגר אוטומטי ליצירת פרופיל בהרשמה
- ניתוב אוטומטי אחרי התחברות: מפרסם → `/app/dashboard`, יוצר → `/app/creator/dashboard`
- בלנדינג: כפתורי "אני מפרסם" / "אני יוצר תוכן" יעבירו ל-`/auth?role=...`

## מבנה הניווט

App Shell משותף (`SidebarProvider` + header עם חיפוש, פעמון, אווטאר):

**מפרסם** (`/app/*`)
- Dashboard — סקירה: קמפיינים פעילים, הצעות אחרונות, סטטיסטיקות
- Create Campaign — טופס יצירה (משתמש בקיים `CampaignForm`)
- My Campaigns — רשימת קמפיינים שלי עם תמונות + סטטוס
- All Proposals — הצעות מיוצרים, פילטר לפי סטטוס, modal לקבלה/דחייה
- Messages — צ'אט פשוט (placeholder תצוגתי)
- Reviews — ניהול ביקורות שקיבל
- Payments — היסטוריית תשלומים + יתרה
- Profile Settings — פרטי חברה + תשלום + התראות + פרטיות

**יוצר** (`/app/creator/*`)
- Dashboard — סקירה: הצעות, רווחים, קמפיינים פעילים
- Browse Campaigns — דפדוף בקמפיינים פתוחים + פילטרים
- My Proposals — סטטוס ההצעות שלי
- Earnings — יתרה, משיכה, היסטוריה
- Reviews — ביקורות שקיבל מהמפרסמים
- Profile Settings — פרופיל אישי, סושיאל, אבטחה, התראות, תשלום

כל המסכים בעברית RTL.

## עיצוב

- שומר על הפלטה הקיימת (`bg-card`, `shadow-cta-lg`, גרדיאנטים primary/accent של Matchly)
- ממיר את הסטייל הסגול-כתום של הפיגמה לטוקנים הקיימים
- כרטיסי KPI עליונים (כמו בפיגמה — Active, Total, Completed) עם רקעים פסטליים מטוקנים
- שורת הסייידבר עם פריט פעיל בגרדיאנט primary (לא הסגול-כתום של הפיגמה)
- Mobile: סייידבר נסגר ל-icon mode, hamburger בהדר

## טכני

### Cloud
- מיגרציה: enum `app_role` (`advertiser`, `creator`, `admin`), טבלת `profiles` (id, email, full_name, role, avatar_url), טבלת `user_roles` נפרדת, פונקציית `has_role`
- RLS: משתמש קורא/מעדכן רק את הפרופיל שלו
- טריגר `handle_new_user` ליצירת profile + user_role בהרשמה
- מתעדכנת טבלת `campaigns` עם `user_id` ו-RLS לפי owner
- מתעדכנת טבלת `creators` עם `user_id` אופציונלי (אם היוצר נרשם)
- טבלת `proposals` חדשה (creator_id, campaign_id, status, message, price)

### קוד
- `src/components/app/AppSidebar.tsx` + `CreatorSidebar.tsx`
- `src/layouts/AppLayout.tsx` (לpמפרסם), `CreatorLayout.tsx` (ליוצר)
- `src/pages/app/*` עם כל המסכים
- `src/pages/creator/*` עם כל המסכים
- `src/pages/Auth.tsx` עם טאבים sign-in/sign-up + Google
- `src/hooks/useAuth.tsx` — listener + session
- `ProtectedRoute` wrapper שבודק role ומפנה
- מסכים שעדיין אין להם דאטה אמיתית — מוצגים עם נתוני דמו אמינים (mock arrays) כדי שהחוויה תהיה מלאה

### תוצרים בשלב הראשון
מימוש מלא של:
1. Auth + Cloud schema + routing
2. App shell + sidebar לשני התפקידים
3. Dashboard + My Campaigns + Create Campaign + All Proposals למפרסם
4. Dashboard + Browse Campaigns + My Proposals + Earnings ליוצר
5. Profile Settings בסיסי לשניהם
6. שאר המסכים (Messages, Reviews, Payments) כ-placeholders עם UI מלא אבל ללא בקאנד פעיל

זה ~15-20 קבצים חדשים. אישור?