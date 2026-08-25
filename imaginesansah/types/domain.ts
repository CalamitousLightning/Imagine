export type RequestStatus = "new" | "reviewing" | "in_progress" | "completed" | "cancelled";

export type HeroComposition =
  | "portrait_with_artwork"
  | "editorial"
  | "portrait_beside_design"
  | "full_impact_showcase"
  | "portrait_typography_branding";

export interface Media {
  id: string;
  bucket: "portfolio" | "hero" | "profile" | "client-files" | "site-assets";
  path: string;
  file_name: string;
  file_type: string | null;
  file_size_bytes: number | null;
  alt_text: string | null;
  width: number | null;
  height: number | null;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  display_order: number;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  category_id: string | null;
  category?: Category | null;
  description: string | null;
  client: string | null;
  tools_used: string[];
  project_date: string | null;
  cover_media_id: string | null;
  cover?: Media | null;
  thumbnail_media_id: string | null;
  thumbnail?: Media | null;
  gallery?: Media[];
  is_featured: boolean;
  is_published: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Service {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon_media_id: string | null;
  icon?: Media | null;
  display_order: number;
  is_published: boolean;
}

export interface HeroSlide {
  id: string;
  composition: HeroComposition;
  headline: string | null;
  subtext: string | null;
  primary_media_id: string | null;
  primary_media?: Media | null;
  secondary_media_id: string | null;
  secondary_media?: Media | null;
  featured_project_id: string | null;
  duration_ms: number;
  is_enabled: boolean;
  display_order: number;
}

export interface SiteSettings {
  id: true;
  site_name: string;
  logo_media_id: string | null;
  profile_media_id: string | null;
  email: string | null;
  whatsapp_number: string | null;
  whatsapp_default_greeting: string;
  whatsapp_project_message_template: string;
  location: string | null;
  social_links: Record<string, string>;
  seo_title: string | null;
  seo_description: string | null;
  og_image_media_id: string | null;
}

export interface ClientRequest {
  id: string;
  full_name: string;
  whatsapp_number: string;
  email: string | null;
  project_type: string;
  service_id: string | null;
  description: string;
  preferred_deadline: string | null;
  budget_range: string | null;
  reference_notes: string | null;
  status: RequestStatus;
  created_at: string;
}
