import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderArt } from '@/components/FolderArt';
import { LogDriver } from '@/components/LogDriver';
import { mix, Node } from '@/components/Node';
import { ResourceIcon } from '@/components/ResourceIcon';
import { ResourcesDriver } from '@/components/ResourcesDriver';
import { site } from '@/data/site';
import { courseKinds, getCourses, getResourceFolders } from '@/lib/content';
import { courseMapLayout } from '@/lib/courseMap';

export const metadata: Metadata = {
  title: 'Resources',
  description: "Wesleyan's CS courses mapped by prerequisite, plus the grants, tutoring, career help and free learning sites a CS student at Wesleyan should know about.",
};

const kindLabel = { intro: '100-level', gateway: 'Gateway', core: 'Cores', elective: 'Electives' } as const;
const title = (slug: string) => slug[0].toUpperCase() + slug.slice(1);
const artFor = (slug: string) => (slug === 'campus' || slug === 'careers' || slug === 'learning' ? slug : null);

// The resources folder, read as a log: every folder is a commit on the main line, its file path in
// the meta column where the log puts dates, and a drawing of what's inside.
export default function Resources() {
  const courses = getCourses();
  const folders = getResourceFolders();
  const rows = folders.length + 2;
  return (
    <div className="log log--page" data-log>
      <div className="rail" aria-hidden="true"><span className="rail__fill" /></div>
      <ol className="log__list">
        <li className="commit commit--intro" data-ref="resources" style={mix(0, rows)}>
          <Node />
          <div className="commit__text">
            <h1 className="page__title" data-split="lines" data-intro>Resources</h1>
            <p className="page__lede">
              What the club knows about getting through CS at Wesleyan: the courses and what they lead to, the money
              and help on campus, and where to learn for free.
            </p>
          </div>
        </li>

        <li className="commit commit--folder" data-ref="resources/courses" data-folder style={mix(1, rows)}>
          <Node />
          <p className="commit__meta"><span>content/courses/</span><span>{courses.length} files</span></p>
          <Link className="art-link" href="/resources/courses/" tabIndex={-1} aria-hidden="true">
            <FolderArt kind="courses" layout={courseMapLayout(courses)} />
          </Link>
          <div className="commit__text">
            <h2 className="commit__title commit__title--big">Courses</h2>
            <p className="commit__body">
              Every COMP course the department offers regularly, mapped by prerequisite, with what students said about
              each one in the club&rsquo;s 2023 guide.
            </p>
            <dl className="levels">
              {courseKinds.map((kind) => {
                const group = courses.filter((c) => c.kind === kind);
                if (!group.length) return null;
                return (
                  <div key={kind} className="levels__row">
                    <dt>{kindLabel[kind]}</dt>
                    <dd>
                      {group.map((c) => (
                        <Link key={c.slug} className="levels__course draw" href={`/resources/courses/${c.slug}/`}>{c.number.replace('COMP ', '')}</Link>
                      ))}
                    </dd>
                  </div>
                );
              })}
            </dl>
            <p className="commit__cta"><Link className="btn" href="/resources/courses/">Open the course map</Link></p>
          </div>
        </li>

        {folders.map((f, i) => {
          const art = artFor(f.slug);
          return (
            <li key={f.slug} className="commit commit--folder" data-ref={`resources/${f.slug}`} data-folder style={mix(i + 2, rows)}>
              <Node />
              <p className="commit__meta">
                <a className="draw" href={`${site.repo}/blob/main/content/${f.file}`}>content/{f.file}</a>
                <span>{f.entries.length} links</span>
              </p>
              {art && <FolderArt kind={art} />}
              <div className="commit__text">
                <h2 className="commit__title commit__title--big">{title(f.slug)}</h2>
                <p className="commit__body">{f.about}</p>
                {f.steps.length > 0 && (
                  <ol className="start">
                    {f.steps.map((s) => <li key={s}>{s}</li>)}
                  </ol>
                )}
                <ul className="shelf">
                  {f.entries.map((e) => (
                    <li key={e.name + e.url}>
                      <ResourceIcon name={e.icon} />
                      <div className="shelf__text">
                        <a className="shelf__name draw" href={e.url} target="_blank" rel="noopener noreferrer">{e.name}</a>
                        {e.from && <span className="shelf__from">{e.from}</span>}
                        <p className="shelf__about">{e.about}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
      <LogDriver />
      <ResourcesDriver />
    </div>
  );
}
