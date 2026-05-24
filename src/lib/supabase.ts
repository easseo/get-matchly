import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ─── Database Types ───────────────────────────────────────────────────────────

export type UserRole = "advertiser" | "creator" | "agency";

export type Profile = {
  id: string;
  role: UserRole;
  full_name: string;
  email: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
};

export type AdvertiserProfile = {
  id: string;
  user_id: string;
  business_name: string;
  business_type: string;
  website: string | null;
  location: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatorProfile = {
  id: string;
  user_id: string;
  instagram_username: string;
  followers: number;
  engagement_rate: number;
  niche: string;
  location: string;
  bio: string | null;
  price_min: number;
  price_max: number;
  content_types: string[];
  availability: boolean;
  portfolio_urls: string[];
  created_at: string;
  updated_at: string;
};

export type AgencyProfile = {
  id: string;
  user_id: string;
  agency_name: string;
  commission_rate: number;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type AgencyCreator = {
  id: string;
  agency_id: string;
  creator_id: string;
  status: "pending" | "active" | "inactive";
  created_at: string;
};

export type CampaignStatus =
  | "draft"
  | "published"
  | "receiving_proposals"
  | "creator_selected"
  | "payment_pending"
  | "payment_deposited"
  | "in_progress"
  | "content_submitted"
  | "waiting_approval"
  | "approved"
  | "completed"
  | "cancelled"
  | "disputed";

export type Campaign = {
  id: string;
  advertiser_id: string;
  title: string;
  business_name: string;
  business_type: string;
  goal: string;
  description: string | null;
  platform: "instagram";
  content_format: string[];
  content_count: number;
  budget_min: number;
  budget_max: number;
  target_location: string;
  deadline: string | null;
  requirements: string | null;
  status: CampaignStatus;
  created_at: string;
  updated_at: string;
};

export type ProposalStatus = "pending" | "accepted" | "rejected" | "withdrawn";

export type Proposal = {
  id: string;
  campaign_id: string;
  creator_id: string;
  price: number;
  message: string;
  estimated_delivery: string | null;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  campaign_id: string;
  advertiser_id: string;
  creator_id: string;
  created_at: string;
};

export type Message = {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read_at: string | null;
  created_at: string;
};

export type PaymentStatus = "pending" | "deposited" | "released" | "refunded" | "disputed";

export type Payment = {
  id: string;
  campaign_id: string;
  proposal_id: string;
  advertiser_id: string;
  creator_id: string;
  amount: number;
  status: PaymentStatus;
  paypal_transaction_id: string | null;
  deposited_at: string | null;
  released_at: string | null;
  created_at: string;
};

export type ContentSubmission = {
  id: string;
  campaign_id: string;
  creator_id: string;
  instagram_post_url: string;
  notes: string | null;
  status: "submitted" | "approved" | "rejected";
  submitted_at: string;
  reviewed_at: string | null;
};

export type Review = {
  id: string;
  campaign_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
};

export type NotificationType =
  | "new_proposal"
  | "proposal_accepted"
  | "proposal_rejected"
  | "payment_deposited"
  | "content_submitted"
  | "content_approved"
  | "campaign_completed"
  | "new_message";

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  data: Record<string, unknown>;
  read_at: string | null;
  created_at: string;
};

export type Match = {
  id: string;
  campaign_id: string;
  creator_id: string;
  score: number;
  reasons: string[];
  created_at: string;
};
