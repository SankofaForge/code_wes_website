import type { Metadata } from 'next';
import Link from 'next/link';
import { LogDriver } from '@/components/LogDriver';
import { mix, Node } from '@/components/Node';
import { formatDate, getLog, getStats } from '@/lib/content';

export const metadata: Metadata = {
  title: 'Log',
  description: "Code_Wes's history, newest first: the club's commits on GitHub and every event it has run.",
};

const THIS_YEAR = 2026;

export default function Log() {
  const log = getLog();
  const { founded, foundedSource, stats } = getStats();
  // git's summary line: every number the board has confirmed, with what it counts underneath.
  const summary = [
    ...(founded ? [{ value: THIS_YEAR - founded, label: 'years', counts: `since ${founded}`, source: foundedSource! }] : []),
    ...stats,
  ];
  const rows = log.length + 1;

  return (
    <div className="log log--page" data-log>
      <div className="rail" aria-hidden="true"><span className="rail__fill" /></div>
      <ol className="log__list">
        <li className="commit commit--intro" data-ref="log" style={mix(0, rows)}>
          <Node />
          <div className="commit__text">
            <h1 className="page__title" data-split="lines" data-intro>Log</h1>
            <p className="page__lede">
              The club&rsquo;s history, newest first. Commits link to GitHub, and events carry a tag that opens their
              own page.
            </p>
            {summary.length > 0 && (
              <div className="stat">
                <p className="stat__line">
                  {summary.map((s, i) => (
                    <span key={s.label}>
                      <span className="stat__num">{s.value}</span> {s.label}{i < summary.length - 1 ? ', ' : ''}
                    </span>
                  ))}
                </p>
                <dl className="stat__notes">
                  {summary.map((s) => (
                    <div key={s.label}>
                      <dt>{s.label}</dt>
                      <dd>{s.counts}. Source: {s.source}.</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </li>

        {log.map((c, i) => (
          <li key={c.date + c.title} className={`commit${c.event ? ' commit--tag' : ''}`} data-ref={c.event ? `tag/${c.event.slug}` : c.date.slice(0, 4)} style={mix(i + 1, rows)}>
            <Node />
            <p className="commit__meta">
              <time dateTime={c.date}>{formatDate(c.date)}</time>
              {c.sha && <span className="commit__sha">{c.sha}</span>}
              {c.event && <span className="commit__tag">tag: {c.event.slug}</span>}
            </p>
            <div className="commit__text">
              <h2 className="commit__title">
                {c.event ? (
                  <Link className="draw" href={`/events/${c.event.slug}/`}>{c.title}</Link>
                ) : c.href ? (
                  <a className="draw" href={c.href}>{c.title}</a>
                ) : (
                  c.title
                )}
              </h2>
              <p className="commit__body">{c.body}</p>
              {c.message && (
                <p className="commit__msg">
                  {c.author} committed <q>{c.message}</q> to {c.repo}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>
      <LogDriver />
    </div>
  );
}
