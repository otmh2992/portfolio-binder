// =====================================================
// TypeScript Types for Database Schema
// =====================================================

// Chat message type for Ollama integration
export interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface User {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Auth & Identity
  email: string;
  username: string;
  
  // Profile Info
  full_name: string;
  bio?: string;
  avatar_url?: string;
  cover_image_url?: string;
  location?: string;
  website?: string;
  
  // Social Links
  instagram?: string;
  twitter?: string;
  youtube?: string;
  vimeo?: string;
  
  // Role & Status
  role: 'filmmaker' | 'backer' | 'admin';
  is_verified: boolean;
  
  // Stats
  total_projects: number;
  total_backed: number;
  total_raised: number;
  
  // Metadata
  metadata?: Record<string, any>;
}

export interface Portfolio {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Owner
  user_id: string;
  user?: User; // Optional populated user data
  
  // Content
  title: string;
  slug: string;
  description?: string;
  
  // Media
  thumbnail_url?: string;
  video_url?: string;
  images?: string[];
  
  // Metadata
  category?: string;
  tags?: string[];
  year?: number;
  duration?: number;
  
  // Display
  featured: boolean;
  display_order: number;
  view_count: number;
  
  // Additional data
  credits?: {
    director?: string;
    producer?: string;
    cinematographer?: string;
    editor?: string;
    [key: string]: string | undefined;
  };
  awards?: Array<{
    name: string;
    year: number;
    category?: string;
  }>;
}

export interface Campaign {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Owner
  user_id: string;
  user?: User;
  portfolio_id?: string;
  portfolio?: Portfolio;
  
  // Campaign Info
  title: string;
  slug: string;
  tagline?: string;
  description?: string;
  story?: string;
  
  // Media
  cover_image_url?: string;
  video_url?: string;
  gallery_images?: string[];
  
  // Funding
  goal_amount: number;
  current_amount: number;
  currency: string;
  
  // Timeline
  start_date: string;
  end_date: string;
  status: 'draft' | 'active' | 'successful' | 'failed' | 'cancelled';
  
  // Stats
  backer_count: number;
  
  // Settings
  is_flexible: boolean;
  
  // Metadata
  category?: string;
  tags?: string[];
  risks_and_challenges?: string;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  
  // Relations
  pledge_tiers?: PledgeTier[];
}

export interface PledgeTier {
  id: string;
  created_at: string;
  
  // Campaign
  campaign_id: string;
  
  // Tier Info
  title: string;
  description?: string;
  amount: number;
  
  // Rewards
  rewards?: string[];
  estimated_delivery?: string;
  
  // Limits
  limited_quantity?: number;
  backers_count: number;
  
  // Display
  display_order: number;
  is_available: boolean;
}

export interface Pledge {
  id: string;
  created_at: string;
  
  // Parties
  backer_id?: string;
  backer?: User;
  campaign_id: string;
  campaign?: Campaign;
  tier_id?: string;
  tier?: PledgeTier;
  
  // Backer Info (for non-logged-in backers)
  backer_email?: string;
  backer_name?: string;
  
  // Payment
  amount: number;
  currency: string;
  
  // Stripe Integration
  stripe_payment_intent_id?: string;
  stripe_charge_id?: string;
  
  // Status
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  
  // Metadata
  is_anonymous: boolean;
  message?: string;
  metadata?: Record<string, any>;
}

export interface CampaignUpdate {
  id: string;
  created_at: string;
  
  // Campaign
  campaign_id: string;
  
  // Content
  title: string;
  content: string;
  
  // Visibility
  is_backers_only: boolean;
}

export interface Comment {
  id: string;
  created_at: string;
  updated_at: string;
  
  // Author
  user_id: string;
  user?: User;
  
  // Target
  campaign_id?: string;
  portfolio_id?: string;
  
  // Content
  content: string;
  
  // Nested replies
  parent_comment_id?: string;
  replies?: Comment[];
  
  // Moderation
  is_deleted: boolean;
}

export interface Follow {
  id: string;
  created_at: string;
  
  follower_id: string;
  following_id: string;
  
  follower?: User;
  following?: User;
}

// =====================================================
// Helper Types
// =====================================================

export interface CampaignWithProgress extends Campaign {
  progress_percentage: number;
  days_remaining: number;
  is_funded: boolean;
}

export interface UserWithStats extends User {
  followers_count?: number;
  following_count?: number;
  active_campaigns?: number;
}

// =====================================================
// API Response Types
// =====================================================

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ApiError {
  error: string;
  message: string;
  status: number;
}
