import { NextRequest, NextResponse } from 'next/server';
import { getCareerData } from '@/data';
import { Locale } from '@/types/career';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const locale = (searchParams.get('locale') as Locale) || 'en';
  const skillFilter = searchParams.get('skill');
  const categoryFilter = searchParams.get('category');

  const data = getCareerData(locale === 'ja' ? 'ja' : 'en');

  let timeline = data.timeline;

  if (categoryFilter) {
    timeline = timeline.filter(
      (item) => item.category.toLowerCase() === categoryFilter.toLowerCase()
    );
  }

  if (skillFilter) {
    timeline = timeline.filter((item) =>
      item.techStack.some((t) => t.toLowerCase() === skillFilter.toLowerCase())
    );
  }

  return NextResponse.json({
    meta: {
      version: '1.0.0',
      locale,
      totalMilestones: timeline.length,
      timestamp: new Date().toISOString(),
    },
    profile: {
      name: data.name,
      title: data.title,
      location: data.location,
      yearsOfExperience: data.yearsOfExperience,
      socials: data.socials,
      metricsOverview: data.metricsOverview,
    },
    timeline,
    skills: data.skills,
  });
}
