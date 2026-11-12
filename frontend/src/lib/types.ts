export type SocialIconStyle = "brand" | "mono";

export type Theme = {
  preset: string;
  background_color: string;
  background_image: string | null;
  button_color: string;
  button_text_color: string;
  button_style: string;
  font_family: string;
  text_color: string;
  /** brand = official colors; mono = single color for all social logos */
  social_icon_style: SocialIconStyle;
  /** Used when social_icon_style is mono */
  social_icon_color: string;
};

export type LinkType = "url" | "youtube" | "spotify" | "header" | "contact";
export type CollectionLayout = "list" | "grid";

export type Profile = {
  id: string;
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  theme_json: Theme;
  seo_title: string | null;
  seo_description: string | null;
  remove_branding: boolean;
  is_verified: boolean;
  show_email_capture: boolean;
  show_phone_capture: boolean;
  tip_jar_enabled: boolean;
  tip_jar_url: string | null;
  tip_jar_label: string;
  google_analytics_id: string | null;
  meta_pixel_id: string | null;
  qr_fg_color: string;
  qr_bg_color: string;
  qr_logo_enabled: boolean;
  background_music_url: string | null;
  background_music_enabled: boolean;
  background_music_video_id: string | null;
  has_profile_lock: boolean;
  redirect_link_id: string | null;
  custom_domain: string | null;
  custom_domain_verified: boolean;
  custom_domain_verify_token: string | null;
  created_at: string;
  updated_at: string;
};

export type DomainInfo = {
  custom_domain: string | null;
  custom_domain_verified: boolean;
  custom_domain_verify_token: string | null;
  txt_hostnames: string[];
  cname_target: string | null;
};

export type ProductItem = {
  id: string;
  title: string;
  description: string | null;
  price_label: string | null;
  checkout_url: string;
  thumbnail_url: string | null;
  position: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type PublicProduct = {
  id: string;
  title: string;
  description: string | null;
  price_label: string | null;
  checkout_url: string;
  thumbnail_url: string | null;
};

export type LinkItem = {
  id: string;
  title: string;
  url: string;
  link_type: LinkType;
  collection: string | null;
  collection_layout: CollectionLayout;
  thumbnail_url: string | null;
  icon: string | null;
  animation: string;
  is_active: boolean;
  is_featured: boolean;
  position: number;
  visible_from: string | null;
  visible_until: string | null;
  has_lock: boolean;
  created_at: string;
  updated_at: string;
};

export type LinkEmbed = {
  provider: string;
  id: string;
  kind?: string;
  embed_url: string;
};

export type PublicLink = {
  id: string;
  title: string;
  url: string | null;
  link_type: LinkType;
  collection: string | null;
  collection_layout: CollectionLayout;
  thumbnail_url: string | null;
  icon: string | null;
  animation: string;
  is_featured: boolean;
  has_lock: boolean;
  embed: LinkEmbed | null;
};

export type SocialLink = {
  id?: string;
  platform: string;
  url: string;
  position: number;
};

export type PublicProfile = {
  username: string;
  display_name: string;
  bio: string | null;
  avatar_url: string | null;
  theme_json: Theme;
  seo_title: string | null;
  seo_description: string | null;
  remove_branding: boolean;
  is_verified: boolean;
  show_email_capture: boolean;
  show_phone_capture: boolean;
  tip_jar_enabled: boolean;
  tip_jar_url: string | null;
  tip_jar_label: string;
  google_analytics_id: string | null;
  meta_pixel_id: string | null;
  is_locked: boolean;
  redirect_url: string | null;
  background_music_enabled: boolean;
  background_music_video_id: string | null;
  links: PublicLink[];
  social_links: SocialLink[];
  products: PublicProduct[];
};

export type AnalyticsSummary = {
  total_views: number;
  total_clicks: number;
  links: { link_id: string; title: string; clicks: number }[];
  devices: { device: string; count: number }[];
  referrers: { referrer: string; count: number }[];
  countries: { country: string; count: number }[];
  daily: { date: string; views: number; clicks: number }[];
};

export type Subscriber = {
  id: string;
  email: string | null;
  phone: string | null;
  created_at: string;
};

export type ShortLinkItem = {
  id: string;
  code: string;
  title: string | null;
  destination_url: string;
  final_url: string;
  short_url: string;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  utm_term: string | null;
  utm_content: string | null;
  rule_mobile_url: string | null;
  rule_desktop_url: string | null;
  geo_rules: Record<string, string> | null;
  is_active: boolean;
  clicks: number;
  created_at: string;
  updated_at: string;
};

export type TokenResponse = {
  access_token: string;
  refresh_token: string;
  token_type: string;
};

export type AuthUser = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
};

export type AdminDailyStat = {
  date: string;
  users: number;
  views: number;
  clicks: number;
};

export type AdminTopProfile = {
  user_id: string;
  username: string;
  display_name: string;
  views: number;
  clicks: number;
  links_count: number;
};

export type AdminReferralSource = {
  username: string;
  cta_clicks: number;
  signups: number;
};

export type AdminMetrics = {
  total_users: number;
  active_users: number;
  superusers: number;
  total_profiles: number;
  total_links: number;
  active_links: number;
  total_views: number;
  total_clicks: number;
  total_subscribers: number;
  new_users_7d: number;
  new_users_30d: number;
  views_7d: number;
  clicks_7d: number;
  cta_clicks_total: number;
  cta_clicks_7d: number;
  referred_signups_total: number;
  referred_signups_7d: number;
  daily: AdminDailyStat[];
  top_profiles: AdminTopProfile[];
  top_referral_sources: AdminReferralSource[];
};

export type AdminUserListItem = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  username: string | null;
  display_name: string | null;
  referred_by_username: string | null;
  links_count: number;
  views_count: number;
  clicks_count: number;
  subscribers_count: number;
};

export type AdminUserListResponse = {
  items: AdminUserListItem[];
  total: number;
  page: number;
  page_size: number;
};

export type AdminLinkItem = {
  id: string;
  title: string;
  url: string;
  is_active: boolean;
  is_featured: boolean;
  position: number;
  created_at: string;
  clicks_count: number;
  username: string | null;
  user_id: string | null;
  profile_id: string;
};

export type AdminUserDetail = {
  id: string;
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  created_at: string;
  username: string | null;
  display_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  is_verified: boolean;
  referred_by_username: string | null;
  profile_id: string | null;
  links_count: number;
  views_count: number;
  clicks_count: number;
  subscribers_count: number;
  links: AdminLinkItem[];
};

export type AdminLinkListResponse = {
  items: AdminLinkItem[];
  total: number;
  page: number;
  page_size: number;
};

export type ShortenerFunnelStep = { event: string; events: number; visitors: number };

export type ShortenerFunnel = {
  days: number;
  steps: ShortenerFunnelStep[];
  by_source: Record<string, ShortenerFunnelStep[]>;
};
