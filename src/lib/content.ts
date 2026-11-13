import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { resourceIcons } from '@/data/resource-icons';

// Loaders for everything in content/ except members (src/lib/members.ts). Each file is someone's
// pull request, so a mistake stops the build with the file and the field to fix.

const root = path.join(process.cwd(), 'content');
const publicDir = path.join(process.cwd(), 'public');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const datePattern = /^\d{4}-\d{2}-\d{2}$/;

type Data = Record<string, unknown>;

function fail(file: string, problem: string): never {
  throw new Error(`content/${file}: ${problem}`);
}

function read(file: string): Data {
  try {
    return JSON.parse(readFileSync(path.join(root, file), 'utf8'));
  } catch (error) {
    fail(file, `is not valid JSON (${(error as Error).message})`);
  }
}

function str(file: string, data: Data, key: string): string {
  const value = data[key];
  if (typeof value !== 'string' || value.trim() === '') fail(file, `"${key}" must be a non-empty string`);
  return value;
}

const optStr = (data: Data, key: string) => (typeof data[key] === 'string' ? (data[key] as string) : undefined);

function oneOf<T extends string>(file: string, data: Data, key: string, options: readonly T[]): T {
  const value = data[key];
  if (!options.includes(value as T)) fail(file, `"${key}" must be one of ${options.join(', ')}`);
  return value as T;
}

function https(file: string, url: unknown, what: string) {
  if (typeof url !== 'string' || !url.startsWith('https://')) fail(file, `${what} needs an https:// url`);
  return url;
}

/** JSON files in a content folder, with their slugs. */
function folder(dir: string) {
  const full = path.join(root, dir);
  if (!existsSync(full)) return [];
  return readdirSync(full)
    .filter((f) => f.endsWith('.json'))
    .map((f) => {
      const slug = f.replace(/\.json$/, '');
      const file = `${dir}/${f}`;
      if (!slugPattern.test(slug)) fail(file, 'file names use lowercase letters, numbers and hyphens');
      return { slug, file, data: read(file) };
    });
}

const memo = <T>(load: () => T) => {
  let value: T | undefined;
  return () => (value ??= load());
};

// ---------- Courses ----------

export const courseKinds = ['intro', 'gateway', 'core', 'elective'] as const;
export type CourseKind = (typeof courseKinds)[number];

export type Course = {
  slug: string;
  number: string;
  title: string;
  short: string;
  kind: CourseKind;
  area?: string;
  /** Each inner list is one requirement; any course in it satisfies it. */
  requires: string[][];
  requiresNote?: string;
  summary: string;
  take?: string;
  syllabus?: { url: string; term: string; professor?: string };
};

export const courseSlug = (number: string) => number.toLowerCase().replace(' ', '-');

export const getCourses = memo((): Course[] => {
  const courses = folder('courses').map(({ slug, file, data }) => {
    const number = str(file, data, 'number');
    if (!/^COMP \d{3}$/.test(number)) fail(file, '"number" is written like "COMP 212"');
    if (courseSlug(number) !== slug) fail(file, `the file name must be ${courseSlug(number)}.json`);
    const requires = data.requires;
    if (!Array.isArray(requires) || !requires.every((g) => Array.isArray(g) && g.length > 0 && g.every((c) => typeof c === 'string'))) {
      fail(file, '"requires" is a list of lists, such as [["COMP 212"], ["MATH 228"]]');
    }
    const syllabus = data.syllabus as Course['syllabus'] | undefined;
    if (syllabus) {
      https(file, syllabus.url, 'the syllabus');
      if (!syllabus.term) fail(file, '"syllabus.term" says which term it is from');
    }
    const title = str(file, data, 'title');
    return {
      slug,
      number,
      title,
      short: optStr(data, 'short') ?? title,
      kind: oneOf(file, data, 'kind', courseKinds),
      area: optStr(data, 'area'),
      requires: requires as string[][],
      requiresNote: optStr(data, 'requiresNote'),
      summary: str(file, data, 'summary'),
      take: optStr(data, 'take'),
      syllabus,
    };
  });
  // A COMP prerequisite has to be a course in the map, or its arrow points nowhere.
  const numbers = new Set(courses.map((c) => c.number));
  for (const c of courses) {
    for (const n of c.requires.flat()) {
      if (n.startsWith('COMP ') && !numbers.has(n)) fail(`courses/${c.slug}.json`, `requires ${n}, which has no file in content/courses/`);
    }
  }
  return courses.sort((a, b) => courseKinds.indexOf(a.kind) - courseKinds.indexOf(b.kind) || a.number.localeCompare(b.number));
});

export const getCourse = (slug: string) => getCourses().find((c) => c.slug === slug);

/** "COMP 212, and MATH 228", or "COMP 212 or COMP 312". */
export const needs = (c: Course) => c.requires.map((g) => g.join(' or ')).join(', and ');

/** Courses that list this one as a prerequisite. */
export const coursesNeeding = (number: string) => getCourses().filter((c) => c.requires.some((g) => g.includes(number)));

// ---------- Resources ----------

export type ResourceEntry = { name: string; from?: string; icon?: string; url: string; about: string };
export type ResourceFolder = { slug: string; file: string; order: number; about: string; steps: string[]; entries: ResourceEntry[] };

export const getResourceFolders = memo((): ResourceFolder[] =>
  folder('resources')
    .map(({ slug, file, data }) => {
      const entries = data.entries;
      if (!Array.isArray(entries) || entries.length === 0) fail(file, '"entries" needs at least one link');
      return {
        slug,
        file,
        order: typeof data.order === 'number' ? data.order : 99,
        about: str(file, data, 'about'),
        steps: (data.steps as string[] | undefined) ?? [],
        entries: entries.map((e: Data, i: number) => ({
          name: str(file, e, 'name'),
          from: optStr(e, 'from'),
          icon: (() => {
            const icon = optStr(e, 'icon');
            if (icon && !resourceIcons[icon]) fail(file, `"${icon}" is not a mark in src/data/resource-icons.ts`);
            return icon;
          })(),
          url: https(file, e.url, `entry ${i + 1}`),
          about: str(file, e, 'about'),
        })),
      };
    })
    .sort((a, b) => a.order - b.order || a.slug.localeCompare(b.slug)),
);

// ---------- Events ----------

export const eventKinds = ['hackathon', 'workshop', 'talk', 'social', 'other'] as const;

export type ClubEvent = {
  slug: string;
  name: string;
  date: string;
  endDate?: string;
  kind: (typeof eventKinds)[number];
  place?: string;
  summary: string;
  attendance?: number;
  projects: { name: string; url?: string; about?: string }[];
  photos: { src: string; alt: string; width: number; height: number }[];
  links: { label: string; url: string }[];
};

export const getEvents = memo((): ClubEvent[] =>
  folder('events')
    .map(({ slug, file, data }) => {
      const date = str(file, data, 'date');
      if (!datePattern.test(date)) fail(file, '"date" is written YYYY-MM-DD');
      const photos = (data.photos as ClubEvent['photos'] | undefined) ?? [];
      for (const p of photos) {
        if (!p.src?.startsWith('/events/') || !existsSync(path.join(publicDir, p.src))) fail(file, `photo "${p.src}" is not in public/events/`);
        if (!p.alt || p.alt.length < 8) fail(file, `photo "${p.src}" needs alt text`);
      }
      const links = (data.links as ClubEvent['links'] | undefined) ?? [];
      for (const l of links) https(file, l.url, `link "${l.label}"`);
      return {
        slug,
        name: str(file, data, 'name'),
        date,
        endDate: optStr(data, 'endDate'),
        kind: oneOf(file, data, 'kind', eventKinds),
        place: optStr(data, 'place'),
        summary: str(file, data, 'summary'),
        attendance: typeof data.attendance === 'number' ? data.attendance : undefined,
        projects: (data.projects as ClubEvent['projects'] | undefined) ?? [],
        photos,
        links,
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date)),
);

export const getEvent = (slug: string) => getEvents().find((e) => e.slug === slug);

// ---------- History and numbers ----------

export type Commit = {
  date: string;
  title: string;
  body: string;
  href?: string;
  sha?: string;
  repo?: string;
  author?: string;
  message?: string;
  /** Set when the row is an event: its tag and page. */
  event?: ClubEvent;
};

const commitUrl = (repo: string, sha: string) => `https://github.com/Code-Wes/${repo}/commit/${sha}`;

/** The club's history and every event, newest first. */
export const getLog = memo((): Commit[] => {
  const file = 'history.json';
  const data = read(file);
  if (!Array.isArray(data.entries)) fail(file, '"entries" must be a list');
  const history = (data.entries as Data[]).map((e): Commit => {
    const date = str(file, e, 'date');
    if (!datePattern.test(date)) fail(file, `"${date}" is written YYYY-MM-DD`);
    const sha = optStr(e, 'sha');
    const repo = optStr(e, 'repo');
    return {
      date,
      title: str(file, e, 'title'),
      body: str(file, e, 'body'),
      href: optStr(e, 'href') ?? (sha && repo ? commitUrl(repo, sha) : undefined),
      sha,
      repo,
      author: optStr(e, 'author'),
      message: optStr(e, 'message'),
    };
  });
  const events = getEvents().map((ev): Commit => ({ date: ev.date, title: ev.name, body: ev.summary, event: ev }));
  return [...history, ...events].sort((a, b) => b.date.localeCompare(a.date));
});

export type Stat = { label: string; value: number; counts: string; source: string };
export type Stats = { founded?: number; foundedSource?: string; stats: Stat[] };

export const getStats = memo((): Stats => {
  const file = 'stats.json';
  const data = read(file);
  if (!Array.isArray(data.stats)) fail(file, '"stats" must be a list, even an empty one');
  const stats = (data.stats as Data[]).map((s, i) => {
    if (typeof s.value !== 'number' || s.value < 0) fail(file, `stat ${i + 1} needs a "value" of 0 or more`);
    return { label: str(file, s, 'label'), value: s.value, counts: str(file, s, 'counts'), source: str(file, s, 'source') };
  });
  const founded = typeof data.founded === 'number' ? data.founded : undefined;
  if (founded !== undefined && !optStr(data, 'foundedSource')) fail(file, '"founded" needs a "foundedSource" saying how we know');
  return { founded, foundedSource: optStr(data, 'foundedSource'), stats };
});

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${months[m - 1]} ${d}, ${y}`;
};
