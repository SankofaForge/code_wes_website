import type { Metadata } from 'next';
import Link from 'next/link';
import { formatDate, getEvents } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Events',
  description: 'Every event Code_Wes has run: hackathons, workshops and talks, newest first.',
};

// The tags in the log, listed on their own: `git tag`, for skimming past events.
export default function Events() {
  const events = getEvents();
  return (
    <div className="page">
      <div className="rail rail--drawn" aria-hidden="true" />
      <header className="page__head">
        <h1 className="page__title" data-split="lines" data-intro>Events</h1>
        <p className="page__lede">
          {events.length > 0 ? (
            <>Hackathons, workshops and talks the club has run, newest first. Each one is also tagged in the <Link className="link" href="/log/">log</Link>.</>
          ) : (
            <>Past events are on their way to this page. Until then, the <Link className="link" href="/log/">log</Link> has the club&rsquo;s history.</>
          )}
        </p>
      </header>
      {events.length > 0 && (
        <ol className="roster">
          {events.map((e) => (
            <li key={e.slug}>
              <Link className="roster__link" href={`/events/${e.slug}/`}>
                <span className="roster__name">{e.name}</span>
                <span className="roster__role"><time dateTime={e.date}>{formatDate(e.date)}</time></span>
                <span className="roster__study">{e.place ?? e.kind}</span>
              </Link>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
