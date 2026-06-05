-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ─── PROFILES ────────────────────────────────────────────────────────────────
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  role text not null check (role in ('advertiser', 'creator', 'agency')),
  full_name text not null,
  email text not null,
  avatar_url text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.profiles enable row level security;
create policy "Users can view own profile" on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.profiles for insert with check (auth.uid() = id);

-- ─── ADVERTISER PROFILES ─────────────────────────────────────────────────────
create table public.advertiser_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  business_name text not null,
  business_type text not null,
  website text,
  location text,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.advertiser_profiles enable row level security;
create policy "Advertisers can manage own profile" on public.advertiser_profiles for all using (auth.uid() = user_id);
create policy "Anyone can view advertiser profiles" on public.advertiser_profiles for select using (true);

-- ─── CREATOR PROFILES ────────────────────────────────────────────────────────
create table public.creator_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  instagram_username text not null,
  followers integer not null default 0,
  engagement_rate numeric(5,2) not null default 0,
  niche text not null,
  location text not null,
  bio text,
  price_min integer not null default 0,
  price_max integer not null default 0,
  content_types text[] not null default '{}',
  content_pricing jsonb not null default '{}',
  availability boolean not null default true,
  portfolio_urls text[] not null default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.creator_profiles enable row level security;
create policy "Creators can manage own profile" on public.creator_profiles for all using (auth.uid() = user_id);
create policy "Anyone can view creator profiles" on public.creator_profiles for select using (true);

-- ─── AGENCY PROFILES ─────────────────────────────────────────────────────────
create table public.agency_profiles (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null unique,
  agency_name text not null,
  commission_rate numeric(5,2) not null default 10,
  description text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.agency_profiles enable row level security;
create policy "Agencies can manage own profile" on public.agency_profiles for all using (auth.uid() = user_id);
create policy "Anyone can view agency profiles" on public.agency_profiles for select using (true);

-- ─── AGENCY CREATORS ─────────────────────────────────────────────────────────
create table public.agency_creators (
  id uuid default uuid_generate_v4() primary key,
  agency_id uuid references public.profiles(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  status text not null default 'pending' check (status in ('pending', 'active', 'inactive')),
  created_at timestamptz default now() not null,
  unique(agency_id, creator_id)
);

alter table public.agency_creators enable row level security;
create policy "Agency can manage own creators" on public.agency_creators for all using (auth.uid() = agency_id);
create policy "Creator can view own agency relationships" on public.agency_creators for select using (auth.uid() = creator_id);

-- ─── CAMPAIGNS ───────────────────────────────────────────────────────────────
create table public.campaigns (
  id uuid default uuid_generate_v4() primary key,
  advertiser_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  business_name text not null,
  business_type text not null,
  goal text not null,
  description text,
  platform text not null default 'instagram',
  content_format text[] not null default '{}',
  content_count integer not null default 1,
  budget_min integer not null,
  budget_max integer not null,
  target_location text not null default 'כל הארץ',
  deadline date,
  requirements text,
  status text not null default 'draft' check (status in (
    'draft','published','receiving_proposals','creator_selected',
    'payment_pending','payment_deposited','in_progress',
    'content_submitted','waiting_approval','approved',
    'completed','cancelled','disputed'
  )),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.campaigns enable row level security;
create policy "Advertisers manage own campaigns" on public.campaigns for all using (auth.uid() = advertiser_id);
create policy "Creators can view published campaigns" on public.campaigns for select using (
  status != 'draft' or auth.uid() = advertiser_id
);

-- ─── MATCHES ─────────────────────────────────────────────────────────────────
create table public.matches (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  score integer not null,
  reasons text[] not null default '{}',
  created_at timestamptz default now() not null,
  unique(campaign_id, creator_id)
);

alter table public.matches enable row level security;
create policy "Campaign owner can view matches" on public.matches for select using (
  auth.uid() = (select advertiser_id from public.campaigns where id = campaign_id)
);
create policy "Matched creator can view own match" on public.matches for select using (auth.uid() = creator_id);
create policy "System can insert matches" on public.matches for insert with check (
  auth.uid() = (select advertiser_id from public.campaigns where id = campaign_id)
);

-- ─── PROPOSALS ───────────────────────────────────────────────────────────────
create table public.proposals (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  price integer not null,
  message text not null,
  estimated_delivery date,
  status text not null default 'pending' check (status in ('pending','accepted','rejected','withdrawn')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null,
  unique(campaign_id, creator_id)
);

alter table public.proposals enable row level security;
create policy "Creator manages own proposals" on public.proposals for all using (auth.uid() = creator_id);
create policy "Advertiser views proposals for own campaigns" on public.proposals for select using (
  auth.uid() = (select advertiser_id from public.campaigns where id = campaign_id)
);
create policy "Advertiser updates proposal status" on public.proposals for update using (
  auth.uid() = (select advertiser_id from public.campaigns where id = campaign_id)
);

-- ─── CONVERSATIONS ────────────────────────────────────────────────────────────
create table public.conversations (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  advertiser_id uuid references public.profiles(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(campaign_id, creator_id)
);

alter table public.conversations enable row level security;
create policy "Participants can view conversation" on public.conversations for select using (
  auth.uid() = advertiser_id or auth.uid() = creator_id
);
create policy "Participants can create conversation" on public.conversations for insert with check (
  auth.uid() = advertiser_id or auth.uid() = creator_id
);

-- ─── MESSAGES ────────────────────────────────────────────────────────────────
create table public.messages (
  id uuid default uuid_generate_v4() primary key,
  conversation_id uuid references public.conversations(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.messages enable row level security;
create policy "Conversation participants can view messages" on public.messages for select using (
  auth.uid() in (
    select advertiser_id from public.conversations where id = conversation_id
    union
    select creator_id from public.conversations where id = conversation_id
  )
);
create policy "Participants can send messages" on public.messages for insert with check (
  auth.uid() = sender_id and auth.uid() in (
    select advertiser_id from public.conversations where id = conversation_id
    union
    select creator_id from public.conversations where id = conversation_id
  )
);

-- ─── PAYMENTS ────────────────────────────────────────────────────────────────
create table public.payments (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  proposal_id uuid references public.proposals(id) on delete cascade not null,
  advertiser_id uuid references public.profiles(id) not null,
  creator_id uuid references public.profiles(id) not null,
  amount integer not null,
  status text not null default 'pending' check (status in ('pending','deposited','released','refunded','disputed')),
  paypal_transaction_id text,
  deposited_at timestamptz,
  released_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.payments enable row level security;
create policy "Payment participants can view" on public.payments for select using (
  auth.uid() = advertiser_id or auth.uid() = creator_id
);
create policy "Advertiser can create payment" on public.payments for insert with check (auth.uid() = advertiser_id);
create policy "Advertiser can update payment" on public.payments for update using (auth.uid() = advertiser_id);

-- ─── CONTENT SUBMISSIONS ─────────────────────────────────────────────────────
create table public.content_submissions (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  instagram_post_url text not null,
  notes text,
  status text not null default 'submitted' check (status in ('submitted','approved','rejected')),
  submitted_at timestamptz default now() not null,
  reviewed_at timestamptz
);

alter table public.content_submissions enable row level security;
create policy "Creator manages own submissions" on public.content_submissions for all using (auth.uid() = creator_id);
create policy "Advertiser views and reviews submissions" on public.content_submissions for select using (
  auth.uid() = (select advertiser_id from public.campaigns where id = campaign_id)
);
create policy "Advertiser can update submission status" on public.content_submissions for update using (
  auth.uid() = (select advertiser_id from public.campaigns where id = campaign_id)
);

-- ─── CAMPAIGN STATUS HISTORY ──────────────────────────────────────────────────
create table public.campaign_status_history (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  changed_by uuid references public.profiles(id) not null,
  old_status text,
  new_status text not null,
  note text,
  created_at timestamptz default now() not null
);

alter table public.campaign_status_history enable row level security;
create policy "Campaign participants can view history" on public.campaign_status_history for select using (
  auth.uid() = changed_by or
  auth.uid() = (select advertiser_id from public.campaigns where id = campaign_id)
);

-- ─── REVIEWS ─────────────────────────────────────────────────────────────────
create table public.reviews (
  id uuid default uuid_generate_v4() primary key,
  campaign_id uuid references public.campaigns(id) on delete cascade not null,
  reviewer_id uuid references public.profiles(id) on delete cascade not null,
  reviewee_id uuid references public.profiles(id) on delete cascade not null,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz default now() not null,
  unique(campaign_id, reviewer_id)
);

alter table public.reviews enable row level security;
create policy "Anyone can view reviews" on public.reviews for select using (true);
create policy "Users can write own reviews" on public.reviews for insert with check (auth.uid() = reviewer_id);

-- ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
create table public.notifications (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  type text not null check (type in (
    'new_proposal','proposal_accepted','proposal_rejected',
    'payment_deposited','content_submitted','content_approved',
    'campaign_completed','new_message'
  )),
  data jsonb not null default '{}',
  read_at timestamptz,
  created_at timestamptz default now() not null
);

alter table public.notifications enable row level security;
create policy "Users view own notifications" on public.notifications for select using (auth.uid() = user_id);
create policy "Users update own notifications" on public.notifications for update using (auth.uid() = user_id);
create policy "System can create notifications" on public.notifications for insert with check (true);

-- ─── AUTO-UPDATE updated_at ──────────────────────────────────────────────────
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger handle_updated_at before update on public.profiles for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.advertiser_profiles for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.creator_profiles for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.agency_profiles for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.campaigns for each row execute function public.handle_updated_at();
create trigger handle_updated_at before update on public.proposals for each row execute function public.handle_updated_at();

-- ─── AUTO-CREATE PROFILE ON SIGNUP ───────────────────────────────────────────
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, role, full_name, email)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'creator'),
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    new.email
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
