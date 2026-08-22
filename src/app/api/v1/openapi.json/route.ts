import { NextResponse } from 'next/server';

export async function GET() {
  const openApiSpec = {
    openapi: '3.1.0',
    info: {
      title: 'Luv Raina Career & Portfolio API',
      version: '1.0.0',
      description:
        'RESTful API serving structured career timeline, achievements, technical skills, and agentic workflows in English and Japanese.',
      contact: {
        name: 'Luv Raina',
        url: 'https://github.com',
      },
    },
    servers: [
      {
        url: '/',
        description: 'Current Next.js Environment',
      },
    ],
    paths: {
      '/api/v1/career': {
        get: {
          summary: 'Retrieve career timeline and profile',
          description: 'Fetch career milestones with optional filtering by locale, tech skill, or category.',
          parameters: [
            {
              name: 'locale',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['en', 'ja'],
                default: 'en',
              },
              description: 'Language of career data (English or Japanese)',
            },
            {
              name: 'skill',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
              },
              description: 'Filter milestones by tech stack (e.g. Next.js, AWS, TypeScript)',
            },
            {
              name: 'category',
              in: 'query',
              required: false,
              schema: {
                type: 'string',
                enum: ['AI & Automation', 'Performance & DevOps', 'Frontend', 'Full-Stack', 'Mobile'],
              },
              description: 'Filter milestones by role category',
            },
          ],
          responses: {
            '200': {
              description: 'Successful response with career milestones and profile metadata',
              content: {
                'application/json': {
                  schema: {
                    type: 'object',
                    properties: {
                      meta: { type: 'object' },
                      profile: { type: 'object' },
                      timeline: { type: 'array' },
                      skills: { type: 'array' },
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  };

  return NextResponse.json(openApiSpec);
}
