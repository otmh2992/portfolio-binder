import { createClient } from '@supabase/supabase-js';
import type {
  User,
  Portfolio,
  Campaign,
  PledgeTier,
  Pledge,
  CampaignUpdate,
  Comment,
  Follow
} from './types';

// Supabase configuration
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Re-export types for convenience
export type {
  User,
  Portfolio,
  Campaign,
  PledgeTier,
  Pledge,
  CampaignUpdate,
  Comment,
  Follow
};

// Database type for Supabase client
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at'>>;
      };
      portfolios: {
        Row: Portfolio;
        Insert: Omit<Portfolio, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Portfolio, 'id' | 'created_at'>>;
      };
      campaigns: {
        Row: Campaign;
        Insert: Omit<Campaign, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Campaign, 'id' | 'created_at'>>;
      };
      pledge_tiers: {
        Row: PledgeTier;
        Insert: Omit<PledgeTier, 'id' | 'created_at'>;
        Update: Partial<Omit<PledgeTier, 'id' | 'created_at'>>;
      };
      pledges: {
        Row: Pledge;
        Insert: Omit<Pledge, 'id' | 'created_at'>;
        Update: Partial<Omit<Pledge, 'id' | 'created_at'>>;
      };
      campaign_updates: {
        Row: CampaignUpdate;
        Insert: Omit<CampaignUpdate, 'id' | 'created_at'>;
        Update: Partial<Omit<CampaignUpdate, 'id' | 'created_at'>>;
      };
      comments: {
        Row: Comment;
        Insert: Omit<Comment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Comment, 'id' | 'created_at'>>;
      };
      follows: {
        Row: Follow;
        Insert: Omit<Follow, 'id' | 'created_at'>;
        Update: Partial<Omit<Follow, 'id' | 'created_at'>>;
      };
    };
  };
}

export interface PortfolioItem {
  id: string;
  created_at: string;
  user_id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
  featured: boolean;
  category: string | null;
  tags: string[] | null;
}


