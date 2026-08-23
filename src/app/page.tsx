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
import { ApiDrawer } from '@/components/ApiDrawer';

export default function HomePage() {
  const [locale, setLocale] = useState<Locale>('en');
  const [isApiOpen, setIsApiOpen] = useState<boolean>(false);

  const data = getCareerData(locale);
  const allTechStacks = getAllTechStacks();

  return (
    <div className="relative min-h-screen flex flex-col items-center selection:bg-cyan-500 selection:text-black">
      {/* Dramatic Grid Pattern Layer */}
      <div className="grid-pattern" aria-hidden="true" />

      {/* Top Navigation — full width */}
      <div className="w-full">
        <Navbar
          locale={locale}
          onToggleLocale={(newLocale) => setLocale(newLocale)}
          onOpenApiDocs={() => setIsApiOpen(true)}
        />
      </div>

      {/* Main Content Sections — centered column */}
      <main className="flex-1 relative z-10 w-full flex flex-col items-center">
        {/* 1. Hero with Key Metrics */}
        <Hero
          data={data}
          locale={locale}
          onOpenApiDocs={() => setIsApiOpen(true)}
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
        <Footer
          locale={locale}
          onOpenApiDocs={() => setIsApiOpen(true)}
        />
      </div>

      {/* Interactive Resume-as-an-API Modal Playground */}
      <ApiDrawer
        isOpen={isApiOpen}
        onClose={() => setIsApiOpen(false)}
        locale={locale}
      />
    </div>
  );
}
