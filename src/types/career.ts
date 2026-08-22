export type Locale = 'en' | 'ja';

export interface SocialLink {
  platform: 'github' | 'linkedin' | 'email' | 'twitter';
  url: string;
  label: string;
}

export interface ImpactMetric {
  label: string;
  value: string;
  description?: string;
}

export interface Project {
  id: string;
  title: string;
  role: string;
  period: string;
  summary: string;
  highlights: string[];
  techStack: string[];
  metrics?: ImpactMetric[];
  githubUrl?: string;
  liveUrl?: string;
}

export interface CareerMilestone {
  id: string;
  company: string;
  role: string;
  period: {
    start: string;
    end: string | 'Present' | '現在';
  };
  location: string;
  summary: string;
  highlights: string[];
  techStack: string[];
  projects?: Project[];
  metrics?: ImpactMetric[];
  teamSize?: string;
  workingLanguage?: string;
  category: 'Full-Stack' | 'Frontend' | 'Mobile' | 'Performance & DevOps' | 'AI & Automation';
}

export interface SkillGroup {
  category: string;
  skills: {
    name: string;
    level: 'Expert' | 'Proficient' | 'Familiar';
    years?: number;
  }[];
}

export interface ProfileData {
  name: string;
  title: string;
  tagline: string;
  bio: string;
  yearsOfExperience: string;
  location: string;
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  socials: SocialLink[];
  metricsOverview: ImpactMetric[];
  skills: SkillGroup[];
  timeline: CareerMilestone[];
}
