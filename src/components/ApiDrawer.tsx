'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Locale } from '@/types/career';
import { X, Play, Copy, Check, Terminal, Sparkles } from 'lucide-react';

interface ApiDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export function ApiDrawer({ isOpen, onClose, locale }: ApiDrawerProps) {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>('/api/v1/career?locale=en');
  const [responseJson, setResponseJson] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const sampleEndpoints = [
    { label: 'Full Career (English)', url: '/api/v1/career?locale=en' },
    { label: 'Full Career (Japanese)', url: '/api/v1/career?locale=ja' },
    { label: 'Filter by Skill (Next.js)', url: '/api/v1/career?skill=Next.js' },
    { label: 'Filter by Category (AI & Automation)', url: '/api/v1/career?category=AI%20%26%20Automation' },
    { label: 'OpenAPI 3.1 Spec (JSON)', url: '/api/v1/openapi.json' },
  ];

  const handleExecute = async (targetUrl?: string) => {
    const url = targetUrl || selectedEndpoint;
    setIsLoading(true);
    try {
      const res = await fetch(url);
      const data = await res.json();
      setResponseJson(JSON.stringify(data, null, 2));
    } catch (err) {
      setResponseJson(JSON.stringify({ error: 'Failed to fetch API endpoint', details: String(err) }, null, 2));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !responseJson) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void handleExecute('/api/v1/career?locale=' + locale);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, locale]);

  const copyCurl = () => {
    const host = typeof window !== 'undefined' ? window.location.origin : 'https://luvraina.dev';
    const curlCommand = `curl -X GET "${host}${selectedEndpoint}"`;
    navigator.clipboard.writeText(curlCommand);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const isClient = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  if (!isOpen || !isClient) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border-cyan-500/30">
        {/* Modal Header */}
        <div className="p-4 border-b border-[var(--border-subtle)] flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                <span>Resume as an API Playground</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                  OpenAPI 3.1
                </span>
              </h2>
              <p className="text-xs text-[var(--text-muted)]">
                Query career history, tech stacks, and AI workflows programmatically.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {/* Preset Buttons */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-[var(--text-secondary)]">
              Select Preset Endpoint:
            </span>
            <div className="flex flex-wrap gap-2">
              {sampleEndpoints.map((ep, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedEndpoint(ep.url);
                    handleExecute(ep.url);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono transition-all ${
                    selectedEndpoint === ep.url
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 border shadow-sm shadow-cyan-500/20 font-bold'
                      : 'bg-white/5 hover:bg-white/10 text-[var(--text-muted)] border border-[var(--border-subtle)]'
                  }`}
                >
                  {ep.label}
                </button>
              ))}
            </div>
          </div>

          {/* Endpoint Bar & cURL copy */}
          <div className="flex items-center gap-2">
            <div className="flex-1 flex items-center px-3 py-2 rounded-xl bg-black/60 border border-[var(--border-subtle)] font-mono text-xs text-cyan-300">
              <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold mr-2">GET</span>
              <span className="truncate">{selectedEndpoint}</span>
            </div>
            <button
              onClick={() => handleExecute()}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>{isLoading ? 'Running...' : 'Execute'}</span>
            </button>
            <button
              onClick={copyCurl}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[var(--text-secondary)] border border-[var(--border-subtle)] text-xs flex items-center gap-1.5 hover:text-white"
              title="Copy cURL command"
            >
              {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{isCopied ? 'Copied!' : 'cURL'}</span>
            </button>
          </div>

          {/* JSON Terminal Viewer */}
          <div className="relative">
            <div className="flex items-center justify-between text-[11px] font-mono text-[var(--text-muted)] mb-1 px-1">
              <span>Response Body (application/json)</span>
              <span className="text-emerald-400">Status: 200 OK</span>
            </div>
            <div className="terminal-block max-h-80 overflow-y-auto relative">
              <pre className="text-xs font-mono text-cyan-200">
                {responseJson || '// Click "Execute" to fetch live JSON payload'}
              </pre>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-3 border-t border-[var(--border-subtle)] bg-black/40 flex items-center justify-between text-xs text-[var(--text-muted)]">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Built using Next.js App Router Route Handlers & Zod Schema Validation</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-[var(--text-primary)]"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
