import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { getCourses, getEvents } from '@/lib/content';
import { getMembers } from '@/lib/members';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const events = getEvents();
  return [
    '/',
    '/log/',
    '/resources/',
    '/resources/courses/',
    ...getCourses().map((c) => `/resources/courses/${c.slug}/`),
    ...(events.length ? ['/events/', ...events.map((e) => `/events/${e.slug}/`)] : []),
    '/members/',
    '/join/',
    ...getMembers().map((m) => `/members/${m.slug}/`),
  ].map((path) => ({
    url: `${site.url}${path}`,
  }));
}
