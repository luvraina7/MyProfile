'use client';

import React, { useState } from 'react';
import { Locale } from '@/types/career';
import { getCareerData, getAllTechStacks } from '@/data';
import { Navbar } from '@/components/Navbar';
import { Hero } from '@/components/Hero';
import { TimelineSection } from '@/components/TimelineSection';
import { AgenticShowcase } from '@/components/AgenticShowcase';
import { ProjectsSection } from '@/components/ProjectsSection';
import { SkillsSection } from '@/components/SkillsSection';
import { Footer } from '@/components/Footer';
import { BackToTop } from '@/components/BackToTop';

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');

  const data = getCareerData(locale);
  const allTechStacks = getAllTechStacks();

  return (
    <div className="relative min-h-screen flex flex-col w-full max-w-full overflow-x-clip selection:bg-cyan-500 selection:text-black">
      {/* Top Navigation — full width */}
      <div className="w-full">
        <Navbar
          locale={locale}
          onToggleLocale={(newLocale) => setLocale(newLocale)}
        />
      </div>

      {/* Main Content Sections — block flow; each section centers itself via internal max-w-5xl */}
      <main className="flex-1 relative z-10 w-full max-w-full overflow-x-clip">
        {/* 1. Hero with Key Metrics */}
        <Hero
          data={data}
          locale={locale}
        />

        {/* 2. Interactive Career Timeline */}
        <TimelineSection
          timeline={data.timeline}
          allTechStacks={allTechStacks}
          locale={locale}
        />

        {/* 3. AI & Agentic Engineering Showcase */}
        <AgenticShowcase locale={locale} />

        {/* 4. Projects & Featured Work */}
        <ProjectsSection locale={locale} />

        {/* 5. Skills & Competencies */}
        <SkillsSection
          skills={data.skills}
          locale={locale}
        />
      </main>

      {/* Footer — full width, inner centered */}
      <div className="w-full">
        <Footer locale={locale} />
      </div>

      <BackToTop locale={locale} />
    </div>
  );
}
