import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hbiiviynczzmzqpdclmr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiaWl2aXluY3p6bXpxcGRjbG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTIwMTgsImV4cCI6MjA5MzYyODAxOH0.N-Zicu-lnG4QdbSUd7e43bQErrHThIKYF12bZeqteIU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type DbCreator = {
  id: string;
  name: string;
  niche: string;
  platform: string;
  followers: number;
  engagement_rate: number;
  location: string;
  price_min: number;
  price_max: number;
  profile_image: string | null;
  created_at?: string;
};

export type DbCampaign = {
  id?: string;
  business_type: string;
  goal: string;
  budget_min: number;
  budget_max: number;
  platform: string;
  content_types: string[];
  deadline?: string | null;
  created_at?: string;
};

export type DbMatch = {
  id?: string;
  campaign_id: string;
  creator_id: string;
  score: number;
  created_at?: string;
};
