import { readdirSync, readFileSync, existsSync } from 'node:fs';
import path from 'node:path';

export type Photo = { src: string; alt: string; srcSet?: string };
export type GalleryImage = Photo & { width: number; height: number };
export type Project = { name: string; url: string; about: string };

export type Member = {
  slug: string;
  name: string;
  role: string;
  board?: number;
  order?: number;
  study: string;
  funFact?: string;
  askMeAbout: string[];
  photo?: Photo;
  gallery: GalleryImage[];
  projects: Project[];
  links: { github?: string; linkedin?: string; website?: string };
  seeded: boolean;
};

const dir = path.join(process.cwd(), 'content', 'members');
const publicDir = path.join(process.cwd(), 'public');
const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

// A member file is someone's first pull request, so a mistake should fail the build with a
// message that says which file and which field to fix.
function fail(file: string, problem: string): never {
  throw new Error(`content/members/${file}: ${problem}`);
}

function requireString(file: string, data: Record<string, unknown>, key: string) {
  const value = data[key];
  if (typeof value !== 'string' || value.trim() === '') fail(file, `"${key}" must be a non-empty string`);
  return value;
}

function requireImage(file: string, src: string) {
  if (!src.startsWith('/members/')) fail(file, `image "${src}" must live in public/members/`);
  if (!existsSync(path.join(publicDir, src))) fail(file, `image "${src}" is not in public/members/`);
}

function parse(file: string): Member {
  const slug = file.replace(/\.json$/, '');
  if (!slugPattern.test(slug)) fail(file, 'file names use lowercase letters, numbers and hyphens');
  let data: Record<string, unknown>;
  try {
    data = JSON.parse(readFileSync(path.join(dir, file), 'utf8'));
  } catch (error) {
    fail(file, `is not valid JSON (${(error as Error).message})`);
  }

  const photo = data.photo as Photo | undefined;
  if (photo) {
    requireImage(file, photo.src);
    if (!photo.alt || photo.alt.length < 8) fail(file, '"photo.alt" must describe the photo');
    // A smaller copy next to the photo (name-480.webp) is used where polaroids are small.
    const small = photo.src.replace(/\.(webp|jpe?g|png)$/, '-480.webp');
    if (small !== photo.src && existsSync(path.join(publicDir, small))) photo.srcSet = `${small} 480w, ${photo.src} 900w`;
  }
  const gallery = (data.gallery as GalleryImage[] | undefined) ?? [];
  for (const image of gallery) {
    requireImage(file, image.src);
    if (!image.alt || image.alt.length < 8) fail(file, `gallery image "${image.src}" needs alt text`);
  }
  const projects = (data.projects as Project[] | undefined) ?? [];
  for (const project of projects) {
    if (!project.url?.startsWith('https://')) fail(file, `project "${project.name}" needs an https:// url`);
  }

  return {
    slug,
    name: requireString(file, data, 'name'),
    role: requireString(file, data, 'role'),
    board: typeof data.board === 'number' ? data.board : undefined,
    order: typeof data.order === 'number' ? data.order : undefined,
    study: requireString(file, data, 'study'),
    funFact: typeof data.funFact === 'string' ? data.funFact : undefined,
    askMeAbout: (data.askMeAbout as string[] | undefined) ?? [],
    photo,
    gallery,
    projects,
    links: (data.links as Member['links'] | undefined) ?? {},
    seeded: data.seeded === true,
  };
}

let cache: Member[] | null = null;

/** Every member, board first (in board order), then everyone else by name. */
export function getMembers(): Member[] {
  if (cache) return cache;
  if (!existsSync(dir)) return (cache = []);
  cache = readdirSync(dir)
    .filter((file) => file.endsWith('.json'))
    .map(parse)
    .sort((a, b) => {
      if (a.board !== b.board) return (b.board ?? 0) - (a.board ?? 0);
      if (a.order !== b.order) return (a.order ?? Infinity) - (b.order ?? Infinity);
      return a.name.localeCompare(b.name);
    });
  return cache;
}

export const getBoard = (year: number) => getMembers().filter((m) => m.board === year);
export const getMember = (slug: string) => getMembers().find((m) => m.slug === slug);
