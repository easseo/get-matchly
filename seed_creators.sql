-- Seed creators directly into auth.users + profiles + creator_profiles
-- Run this in Supabase SQL Editor

do $$
declare
  u uuid;
  creators jsonb[] := array[
    '{"name":"נועה לוי","email":"noa@demo.matchly","niche":"ביוטי","location":"תל אביב","followers":124000,"engagement":6.2,"price_min":800,"price_max":2500,"handle":"noa_levy","types":["ריל","סטורי","פוסט"],"bio":"יוצרת תוכן ביוטי עם אהבה לאיפור טבעי"}',
    '{"name":"איתי כהן","email":"itay@demo.matchly","niche":"כושר ובריאות","location":"תל אביב","followers":86000,"engagement":5.8,"price_min":600,"price_max":1800,"handle":"itay_cohen","types":["ריל","סטורי"],"bio":"מאמן כושר ויוצר תוכן בריאותי"}',
    '{"name":"שירה ברק","email":"shira@demo.matchly","niche":"אופנה","location":"תל אביב","followers":95000,"engagement":4.1,"price_min":1000,"price_max":3000,"handle":"shira_barak","types":["ריל","פוסט","סטורי"],"bio":"בלוגרית אופנה ולייפסטייל"}',
    '{"name":"דן גולדברג","email":"dan@demo.matchly","niche":"טכנולוגיה","location":"תל אביב","followers":52000,"engagement":7.3,"price_min":500,"price_max":1500,"handle":"dan_tech","types":["פוסט","סטורי"],"bio":"יוצר תוכן טכנולוגי ורשת חברתית"}',
    '{"name":"מיה שפירא","email":"mia@demo.matchly","niche":"אוכל ומסעדות","location":"תל אביב","followers":78000,"engagement":5.5,"price_min":700,"price_max":2200,"handle":"mia_food","types":["ריל","פוסט","סטורי"],"bio":"foodie ומבקרת מסעדות"}',
    '{"name":"יוסי אברהם","email":"yossi@demo.matchly","niche":"טיולים","location":"ירושלים","followers":43000,"engagement":4.8,"price_min":400,"price_max":1200,"handle":"yossi_travel","types":["ריל","פוסט"],"bio":"מטייל ויוצר תוכן טיולים בישראל ובעולם"}',
    '{"name":"רוני פרץ","email":"roni@demo.matchly","niche":"ביוטי","location":"חיפה","followers":31000,"engagement":8.1,"price_min":300,"price_max":900,"handle":"roni_beauty","types":["סטורי","ריל"],"bio":"מאפרת מקצועית ויוצרת תוכן ביוטי"}',
    '{"name":"תמר חיים","email":"tamar@demo.matchly","niche":"בית ועיצוב","location":"תל אביב","followers":67000,"engagement":3.9,"price_min":900,"price_max":2800,"handle":"tamar_design","types":["פוסט","ריל"],"bio":"מעצבת פנים ויוצרת תוכן עיצובי"}',
    '{"name":"אבי מזרחי","email":"avi@demo.matchly","niche":"גיימינג","location":"ראשון לציון","followers":115000,"engagement":9.2,"price_min":500,"price_max":2000,"handle":"avi_gamer","types":["ריל","סטורי"],"bio":"גיימר מקצועי ויוצר תוכן גיימינג"}',
    '{"name":"ליאת כץ","email":"liat@demo.matchly","niche":"כושר ובריאות","location":"כל הארץ","followers":89000,"engagement":6.7,"price_min":800,"price_max":2500,"handle":"liat_fit","types":["ריל","סטורי","פוסט"],"bio":"יוצרת תוכן כושר ותזונה בריאה"}',
    '{"name":"אור בן דוד","email":"or@demo.matchly","niche":"אוכל ומסעדות","location":"תל אביב","followers":55000,"engagement":5.1,"price_min":600,"price_max":1800,"handle":"or_eats","types":["ריל","פוסט"],"bio":"שף ויוצר תוכן אוכל"}',
    '{"name":"נטע ישראלי","email":"neta@demo.matchly","niche":"אופנה","location":"תל אביב","followers":142000,"engagement":4.5,"price_min":1200,"price_max":4000,"handle":"neta_style","types":["פוסט","ריל","סטורי"],"bio":"מעצבת אופנה ומשפיענית סטייל"}',
    '{"name":"גיל שמש","email":"gil@demo.matchly","niche":"טכנולוגיה","location":"כל הארץ","followers":38000,"engagement":6.0,"price_min":400,"price_max":1200,"handle":"gil_tech","types":["פוסט","סטורי"],"bio":"יזם ויוצר תוכן סטארטאפ"}',
    '{"name":"דנה אלון","email":"dana@demo.matchly","niche":"חינוך","location":"ירושלים","followers":29000,"engagement":7.8,"price_min":300,"price_max":800,"handle":"dana_edu","types":["פוסט","סטורי","ריל"],"bio":"מחנכת ויוצרת תוכן חינוכי לילדים"}',
    '{"name":"רם כהן","email":"ram@demo.matchly","niche":"כושר ובריאות","location":"תל אביב","followers":203000,"engagement":3.2,"price_min":2000,"price_max":6000,"handle":"ram_gym","types":["ריל","סטורי"],"bio":"ספורטאי ומאמן אישי מוביל"}']::jsonb[];
  c jsonb;
begin
  foreach c in array creators loop
    -- Check if user already exists
    select id into u from auth.users where email = c->>'email';

    if u is null then
      -- Create auth user
      insert into auth.users (
        id, instance_id, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_app_meta_data, raw_user_meta_data,
        is_super_admin, role
      ) values (
        gen_random_uuid(), '00000000-0000-0000-0000-000000000000',
        c->>'email', crypt('Demo1234!', gen_salt('bf')), now(),
        now(), now(),
        '{"provider":"email","providers":["email"]}'::jsonb,
        jsonb_build_object('role', 'creator', 'full_name', c->>'name'),
        false, 'authenticated'
      )
      returning id into u;
    end if;

    -- Create profile
    insert into public.profiles (id, role, full_name, email)
    values (u, 'creator', c->>'name', c->>'email')
    on conflict (id) do nothing;

    -- Create creator_profile
    insert into public.creator_profiles (
      user_id, instagram_username, niche, location,
      followers, engagement_rate, price_min, price_max,
      content_types, bio, availability
    ) values (
      u,
      c->>'handle',
      c->>'niche',
      c->>'location',
      (c->>'followers')::integer,
      (c->>'engagement')::numeric,
      (c->>'price_min')::integer,
      (c->>'price_max')::integer,
      array(select jsonb_array_elements_text(c->'types')),
      c->>'bio',
      true
    )
    on conflict (user_id) do nothing;

  end loop;
end $$;
