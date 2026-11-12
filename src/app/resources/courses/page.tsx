import type { Metadata } from 'next';
import Link from 'next/link';
import { CourseMap } from '@/components/CourseMap';
import { courseKinds, getCourses, needs } from '@/lib/content';
import { courseMapLayout } from '@/lib/courseMap';

export const metadata: Metadata = {
  title: 'Course map',
  description: "Wesleyan's regularly offered COMP courses, from COMP 112 to the 300-level cores, drawn by prerequisite.",
};

const kindLabel = {
  intro: '100-level: start anywhere',
  gateway: 'Gateway: take both to declare the major',
  core: '300-level cores',
  elective: 'Electives',
} as const;

const DEPT = 'https://www.wesleyan.edu/mathcs/cs/regular_courses.html';
const WESMAPS = 'https://owaprod-pub.wesleyan.edu/reg/!wesmaps_page.html?crse_list=COMP&offered=Y';

export default function CoursesPage() {
  const courses = getCourses();
  return (
    <div className="page">
      <div className="rail rail--drawn" aria-hidden="true" />
      <header className="page__head">
        <h1 className="page__title" data-split="lines" data-intro>Course map</h1>
        <p className="page__lede">
          Every COMP course the department offers regularly, and what each one needs first. Point at a course to trace
          the way there.
        </p>
      </header>

      <CourseMap layout={courseMapLayout(courses)} />
      <ul className="map__key" aria-hidden="true">
        <li><svg viewBox="0 0 40 8"><path className="lane" d="M0 4 H40" /></svg>required</li>
        <li><svg viewBox="0 0 40 8"><path className="lane lane--any" d="M0 4 H40" /></svg>any one of these</li>
        <li><span className="map__key-extra">+ MATH 228</span>also needs Discrete Mathematics</li>
      </ul>

      <div className="catalog">
        {courseKinds.map((kind) => {
          const group = courses.filter((c) => c.kind === kind);
          if (!group.length) return null;
          return (
            <section key={kind} className="catalog__group" aria-labelledby={`k-${kind}`}>
              <h2 id={`k-${kind}`} className="profile__h2">{kindLabel[kind]}</h2>
              <ul className="roster">
                {group.map((c) => (
                  <li key={c.slug}>
                    <Link className="roster__link catalog__link" href={`/resources/courses/${c.slug}/`}>
                      <span className="roster__name">{c.number}</span>
                      <span className="catalog__title">{c.title}</span>
                      <span className="roster__study">{c.requires.length ? `Needs ${needs(c)}` : c.kind === 'intro' ? 'No prerequisites' : 'See the course page'}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>

      <p className="page__source">
        Titles and prerequisites from the department&rsquo;s <a className="link" href={DEPT}>courses regularly offered</a>.
        For what runs this term, check <a className="link" href={WESMAPS}>WesMaps</a>.
      </p>
    </div>
  );
}
