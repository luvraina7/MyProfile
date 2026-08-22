import { Locale, ProfileData } from '@/types/career';
import { careerDataEn } from './career.en';
import { careerDataJa } from './career.ja';

export function getCareerData(locale: Locale = 'en'): ProfileData {
  return locale === 'ja' ? careerDataJa : careerDataEn;
}

export function getAllTechStacks(): string[] {
  const stacks = new Set<string>();
  careerDataEn.timeline.forEach((item) => {
    item.techStack.forEach((t) => stacks.add(t));
  });
  careerDataEn.skills.forEach((group) => {
    group.skills.forEach((s) => stacks.add(s.name));
  });
  return Array.from(stacks).sort();
}
