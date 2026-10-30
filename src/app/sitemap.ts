import type { MetadataRoute } from 'next';
import { site } from '@/data/site';
import { getMembers } from '@/lib/members';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/members/', '/join/', ...getMembers().map((m) => `/members/${m.slug}/`)].map((path) => ({
    url: `${site.url}${path}`,
  }));
}
