export type NavLink = {
  label: string;
  href: string;
};

export type HeroStat = {
  label: string;
  value: string;
};

export type HeroContent = {
  title: string;
  role: string;
  subtitle: string;
  stats: HeroStat[];
  cta_primary: string;
  cta_secondary: string;
  image: string;
};

export type Experience = {
  role: string;
  company: string;
  duration: string;
  achievements: string[];
};

export type AboutContent = {
  headline: string;
  bio: string;
  philosophy: string;
  expertise: string[];
  experience: Experience[];
  certifications: string[];
  tools: string[];
  domains: string[];
};

export type Service = {
  title: string;
  description: string;
  icon: string;
  price: string;
  features: string[];
  deliverables: string[];
};

export type DocCategory =
  | "API"
  | "User Guide"
  | "SDK"
  | "Release Notes"
  | "Knowledge Base"
  | "Tutorial";

export type PortfolioItem = {
  slug: string;
  title: string;
  category: DocCategory;
  tech_stack: string[];
  description: string;
  content: string;
  client: string;
  published_date: string;
  download_link: string;
  featured_image: string;
};

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  published_date: string;
  read_time: string;
  category: string;
  featured_image: string;
};

export type Testimonial = {
  quote: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
};

export type Social = {
  label: string;
  href: string;
};

export type ContactContent = {
  email: string;
  phone: string;
  location: string;
  socials: Social[];
};

export type NavContent = {
  logo: string;
  links: NavLink[];
};

export type ClientLogo = {
  name: string;
  image: string;
};

export type SiteContent = {
  nav: NavContent;
  hero: HeroContent;
  about: AboutContent;
  services: Service[];
  portfolio: PortfolioItem[];
  blog: BlogPost[];
  testimonials: Testimonial[];
  contact: ContactContent;
  clients: ClientLogo[];
};

export type ContactSubmission = {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
};
