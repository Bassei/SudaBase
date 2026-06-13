export type University = {
  university_id: string;
  name_en: string | null;
  name_ar: string | null;
  city: string | null;
  country: string | null;
  ownership: string | null;
  website: string | null;
  rank_unirank_sudan: number | null;
  rank_edurank_sudan: number | null;
  rank_webometrics_sudan: number | null;
  sources: string | null;
  source_urls: string | null;
  last_updated: string | null;
};

export type Program = {
  program_id: string;
  university_id: string | null;
  university_name: string | null;
  program_or_faculty: string | null;
  degree: string | null;
  source_url: string | null;
  confidence: 'high' | 'medium' | 'low' | string | null;
  last_updated: string | null;
};

export type StudentReview = {
  review_id: string;
  university_id: string;
  reviewer_name: string | null;
  faculty: string | null;
  study_year: string | null;
  teaching_score: number;
  admin_score: number;
  facilities_score: number;
  environment_score: number;
  value_score: number;
  overall_score: number | null;
  comment: string | null;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type EconomicSector = {
  sector_id: string;
  sector_name_ar: string | null;
  sector_name_en: string | null;
  description: string | null;
  competition_level: string | null;
  opportunity_score: number | null;
  risk_level: string | null;
  market_size_estimate: string | null;
  notes: string | null;
  last_updated: string | null;
};

export type Business = {
  business_id: string;
  name: string;
  sector_id: string | null;
  state: string | null;
  city: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  facebook: string | null;
  employees_estimate: number | null;
  branches_count: number | null;
  competitor_strength: number | null;
  source_url: string | null;
  source_name: string | null;
  data_confidence: string | null;
  last_updated: string | null;
};

export type MarketIndicator = {
  indicator_id: string;
  indicator_type: string;
  name: string;
  value: number;
  currency: string | null;
  unit: string | null;
  source_name: string | null;
  source_url: string | null;
  fetched_at: string;
};
