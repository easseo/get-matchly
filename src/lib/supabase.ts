import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://hbiiviycnzzmzqpdclmr.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhiaWl2aXluY3p6bXpxcGRjbG1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgwNTIwMTgsImV4cCI6MjA5MzYyODAxOH0.N-Zicu-lnG4QdbSUd7e43bQErrHThIKYF12bZeqteIU";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export type DbCreator = {
  id: string;
  name: string;
  niches: string[];
  platform: string;
  followers: number;
  engagement_rate: number;
  location: string;
  price: number;
  avatar: string;
  gradient: string;
};

export type DbCampaign = {
  id?: string;
  business: string;
  goal: string;
  budget: number;
  location: string;
  platform: string;
  content_type: string;
  contents: { type: string; qty: number }[];
  deadline?: string | null;
  created_at?: string;
};

export type DbMatch = {
  id?: string;
  campaign_id: string;
  creator_id: string;
  score: number;
  success_probability: number;
  reasons: string[];
  rank: number;
  created_at?: string;
};
