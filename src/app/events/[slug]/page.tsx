import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { formatDate, getEvent, getEvents } from '@/lib/content';

export const dynamicParams = false;

// A static export needs at least one page per route. Until the first event file lands, "_" (never a
// valid event file name) renders the 404 page.
export function generateStaticParams() {
  const events = getEvents();
  return events.length ? events.map((e) => ({ slug: e.slug })) : [{ slug: '_' }];
}

export async function generateMetadata({ params }: PageProps<'/events/[slug]'>): Promise<Metadata> {
  const e = getEvent((await params).slug);
  if (!e) return {};
  return { title: e.name, description: e.summary, openGraph: e.photos[0] ? { images: [e.photos[0].src] } : undefined };
}

// An event reads like release notes for its tag: when, where, what happened, what shipped.
export default async function EventPage({ params }: PageProps<'/events/[slug]'>) {
  const { slug } = await params;
  const events = getEvents();
  const i = events.findIndex((e) => e.slug === slug);
  if (i < 0) notFound();
  const e = events[i];
  const newer = events[i - 1];
  const older = events[i + 1];

  return (
    <article className="page event">
      <div className="rail rail--drawn" aria-hidden="true" />
      <header className="page__head">
        <p className="course__number">
          tag: {e.slug}
          <span>
            <time dateTime={e.date}>{formatDate(e.date)}</time>
            {e.endDate && <> to <time dateTime={e.endDate}>{formatDate(e.endDate)}</time></>}
            {e.place && <>, {e.place}</>}
          </span>
        </p>
        <h1 className="page__title" data-split="lines" data-intro>{e.name}</h1>
        <p className="page__lede">{e.summary}</p>
      </header>

      <div className="course__grid">
        {e.attendance && (
          <p className="event__count"><span>{e.attendance}</span> people came</p>
        )}

        {e.projects.length > 0 && (
          <section aria-labelledby="projects-h">
            <h2 id="projects-h" className="profile__h2">What got built</h2>
            <ul className="projects">
              {e.projects.map((p) => (
                <li key={p.name}>
                  {p.url ? <a className="projects__name draw" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a> : <span className="projects__name">{p.name}</span>}
                  {p.about && <p>{p.about}</p>}
                </li>
              ))}
            </ul>
          </section>
        )}

        {e.links.length > 0 && (
          <ul className="profile__links">
            {e.links.map((l) => <li key={l.url}><a className="link" href={l.url} target="_blank" rel="noopener noreferrer">{l.label}</a></li>)}
          </ul>
        )}
      </div>

      {e.photos.length > 0 && (
        <section className="event__photos" aria-labelledby="photos-h">
          <h2 id="photos-h" className="profile__h2">Photos</h2>
          <ul className="gallery">
            {e.photos.map((g) => (
              <li key={g.src} style={{ aspectRatio: `${g.width} / ${g.height}` }}>
                <img src={g.src} alt={g.alt} width={g.width} height={g.height} loading="lazy" decoding="async" data-reveal="clip" />
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav className="branches" aria-label="Other events">
        {newer && (
          <Link className="branches__link branches__link--prev" href={`/events/${newer.slug}/`}>
            <span className="branches__dir">newer tag</span>
            <span className="branches__name">{newer.name}</span>
          </Link>
        )}
        {older && (
          <Link className="branches__link branches__link--next" href={`/events/${older.slug}/`}>
            <span className="branches__dir">older tag</span>
            <span className="branches__name">{older.name}</span>
          </Link>
        )}
      </nav>
    </article>
  );
}
