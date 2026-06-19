-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 001: Fix notifications RLS + move inserts to a DB trigger
--
-- HOW TO RUN:
--   Supabase Dashboard → SQL Editor → New Query → paste entire file → Run
--
-- WHAT THIS DOES:
--   1. Drops the old permissive insert policy (with check (true)) that allowed
--      any authenticated user to create notifications for anyone.
--   2. Replaces it with a policy that blocks all direct client inserts.
--   3. Creates a SECURITY DEFINER function that the DB calls automatically
--      whenever a proposal status changes to 'accepted' or 'rejected'.
--   4. Attaches that function as a trigger on public.proposals.
--
-- After this migration, client code must NOT insert into public.notifications
-- directly. The trigger handles it automatically and safely server-side.
-- ─────────────────────────────────────────────────────────────────────────────

-- Step 1: Drop the old permissive insert policy
drop policy if exists "System can create notifications" on public.notifications;

-- Step 2: Block all direct client inserts
create policy "No direct client inserts on notifications" on public.notifications
  for insert with check (false);

-- Step 3: SECURITY DEFINER function — fires on proposal status change
create or replace function public.notify_proposal_status_change()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_campaign_title text;
begin
  -- Only act on meaningful status transitions
  if new.status not in ('accepted', 'rejected') then
    return new;
  end if;
  if old.status is not distinct from new.status then
    return new;
  end if;

  select title into v_campaign_title
  from public.campaigns
  where id = new.campaign_id;

  insert into public.notifications (user_id, type, data)
  values (
    new.creator_id,
    case when new.status = 'accepted' then 'proposal_accepted' else 'proposal_rejected' end,
    jsonb_build_object(
      'campaign_id', new.campaign_id,
      'proposal_id', new.id,
      'message', case
        when new.status = 'accepted'
          then 'ההצעה שלך התקבלה! — ' || coalesce(v_campaign_title, '')
          else 'ההצעה שלך נדחתה — '    || coalesce(v_campaign_title, '')
      end
    )
  );

  return new;
end;
$$;

-- Step 4: Attach the trigger to proposals
drop trigger if exists on_proposal_status_change on public.proposals;
create trigger on_proposal_status_change
  after update of status on public.proposals
  for each row
  execute function public.notify_proposal_status_change();
