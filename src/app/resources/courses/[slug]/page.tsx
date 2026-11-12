import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { site } from '@/data/site';
import { courseSlug, coursesNeeding, getCourse, getCourses } from '@/lib/content';
import { getMembers } from '@/lib/members';

export const dynamicParams = false;

export function generateStaticParams() {
  return getCourses().map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<'/resources/courses/[slug]'>): Promise<Metadata> {
  const c = getCourse((await params).slug);
  if (!c) return {};
  const lead = `${c.number}, ${c.title}, at Wesleyan: what it needs, what it opens, and what students say about it.`;
  return { title: `${c.number}: ${c.title}`, description: lead.length <= 160 ? lead : `${c.number} at Wesleyan: what it needs, what it opens, and what students say about it.` };
}

const WESMAPS = 'https://owaprod-pub.wesleyan.edu/reg/!wesmaps_page.html?crse_list=COMP&offered=Y';
const kindLine = { intro: '100-level', gateway: 'Gateway to the major', core: 'Core', elective: 'Elective' } as const;

function CourseRef({ number }: { number: string }) {
  if (!number.startsWith('COMP ')) return <span>{number}</span>;
  return <Link className="link" href={`/resources/courses/${courseSlug(number)}/`}>{number}</Link>;
}

export default async function CoursePage({ params }: PageProps<'/resources/courses/[slug]'>) {
  const { slug } = await params;
  const courses = getCourses();
  const i = courses.findIndex((c) => c.slug === slug);
  if (i < 0) notFound();
  const c = courses[i];
  const prev = courses[(i - 1 + courses.length) % courses.length];
  const next = courses[(i + 1) % courses.length];
  const opens = coursesNeeding(c.number);
  const askers = getMembers().filter((m) => m.askMeAbout.some((t) => t.toUpperCase().replace(/\s+/g, ' ').includes(c.number)));
  const file = `content/courses/${c.slug}.json`;

  return (
    <article className="page course">
      <div className="rail rail--drawn" aria-hidden="true" />
      <header className="page__head">
        <p className="course__number">
          {c.number}
          <span>{kindLine[c.kind]}{c.area ? `: ${c.area}` : ''}</span>
        </p>
        <h1 className="page__title course__title" data-split="lines" data-intro>{c.title}</h1>
        <p className="page__lede">{c.summary}</p>
      </header>

      <div className="course__grid">
        <section aria-labelledby="needs-h">
          <h2 id="needs-h" className="profile__h2">Before you take it</h2>
          {c.requires.length > 0 ? (
            <ul className="chips">
              {c.requires.map((g) => (
                <li key={g.join()}>
                  {g.map((n, j) => <span key={n}>{j > 0 && ' or '}<CourseRef number={n} /></span>)}
                </li>
              ))}
            </ul>
          ) : (
            <p className="course__plain">{c.kind === 'intro' ? 'Nothing. Start here.' : 'No prerequisites listed.'}</p>
          )}
          {c.requiresNote && <p className="profile__note">{c.requiresNote}</p>}
        </section>

        <section aria-labelledby="opens-h">
          <h2 id="opens-h" className="profile__h2">What it opens</h2>
          {opens.length > 0 ? (
            <ul className="chips">
              {opens.map((o) => (
                <li key={o.slug}><Link className="draw" href={`/resources/courses/${o.slug}/`}>{o.number} <span className="course__opens-title">{o.title}</span></Link></li>
              ))}
            </ul>
          ) : (
            <p className="course__plain">No regular course lists it as a prerequisite.</p>
          )}
        </section>

        {c.take && (
          <figure className="profile__fact course__take">
            <blockquote><p>{c.take}</p></blockquote>
            <figcaption>A student&rsquo;s take, from the club&rsquo;s 2023 <a className="link" href="https://github.com/Code-Wes/Code_Wes_Introduction/blob/main/wesCS.md">guide to the CS major</a></figcaption>
          </figure>
        )}

        <section aria-labelledby="syllabus-h">
          <h2 id="syllabus-h" className="profile__h2">Syllabus</h2>
          {c.syllabus ? (
            <p className="course__plain">
              <a className="link" href={c.syllabus.url}>{c.syllabus.term} syllabus</a>
              {c.syllabus.professor && <>, {c.syllabus.professor}</>}
            </p>
          ) : (
            <p className="profile__note">
              None shared yet. If the professor has posted one publicly or agreed to share it, add it to{' '}
              <a className="link" href={`${site.repo}/blob/main/${file}`}>{file}</a>.
            </p>
          )}
        </section>

        {askers.length > 0 && (
          <section aria-labelledby="ask-h">
            <h2 id="ask-h" className="profile__h2">Ask a member</h2>
            <ul className="chips">
              {askers.map((m) => <li key={m.slug}><Link className="draw" href={`/members/${m.slug}/`}>{m.name}</Link></li>)}
            </ul>
          </section>
        )}
      </div>

      <p className="page__source">
        <Link className="link" href="/resources/courses/">Back to the course map</Link>. For when it runs and who teaches it
        this year, check <a className="link" href={WESMAPS}>WesMaps</a>.
      </p>

      <nav className="branches" aria-label="Other courses">
        <Link className="branches__link branches__link--prev" href={`/resources/courses/${prev.slug}/`}>
          <span className="branches__dir">previous course</span>
          <span className="branches__name">{prev.number}</span>
        </Link>
        <Link className="branches__link branches__link--next" href={`/resources/courses/${next.slug}/`}>
          <span className="branches__dir">next course</span>
          <span className="branches__name">{next.number}</span>
        </Link>
      </nav>
    </article>
  );
}
