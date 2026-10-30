import Link from 'next/link';
import type { CSSProperties } from 'react';
import { BoardMerge } from '@/components/BoardMerge';
import { HeadLine } from '@/components/HeadLine';
import { LogDriver } from '@/components/LogDriver';
import { site } from '@/data/site';
import { getBoard } from '@/lib/members';

const BOARD_YEAR = 2026;

// Each node's color is its place in time, on the board post's blue-to-red run.
const mix = (i: number, n: number) => ({ '--mix': `${Math.round((i / (n - 1)) * 100)}%` }) as CSSProperties;

function Node({ hollow }: { hollow?: boolean }) {
  return (
    <svg className={`node${hollow ? ' node--hollow' : ''}`} viewBox="0 0 20 20" aria-hidden="true">
      <circle cx="10" cy="10" r="6" />
    </svg>
  );
}

export default function Home() {
  const board = getBoard(BOARD_YEAR);
  const rows = 3;
  return (
    <div className="log" data-log>
      <div className="rail" aria-hidden="true"><span className="rail__fill" /></div>
      <ol className="log__list">
        <li className="commit commit--head" data-ref="HEAD" style={mix(0, rows)}>
          <Node />
          <HeadLine />
          <p className="commit__lede" data-split="lines" data-intro data-delay="0.15">{site.about}</p>
        </li>

        <li className="commit commit--board" data-ref={String(BOARD_YEAR)} style={mix(1, rows)}>
          <Node />
          <div className="commit__text">
            <h2 className="commit__title commit__title--big">The {BOARD_YEAR} board</h2>
            <p className="commit__body">
              Seven people run the club this year. Each one is a branch that merged into Code_Wes. Open one to read
              their file.
            </p>
          </div>
          <BoardMerge members={board} />
        </li>

        <li className="commit commit--root" data-ref="your branch" style={mix(rows - 1, rows)}>
          <Node hollow />
          <div className="commit__text">
            <h2 className="commit__title commit__title--big">Branch off here</h2>
            <p className="commit__body">
              Every member has a file in this site&rsquo;s repository. Adding yours is a pull request with one small JSON
              file and, if you like, a photo.
            </p>
            <p className="commit__cta">
              <Link className="btn" href="/join/">Add yourself</Link>
            </p>
            <ul className="elsewhere">
              {site.links.map((l) => (
                <li key={l.label}>
                  <a className="draw" href={l.href} target="_blank" rel="noopener noreferrer">{l.label}</a>
                  <span className="elsewhere__note">{l.note}</span>
                </li>
              ))}
            </ul>
          </div>
        </li>
      </ol>
      <LogDriver />
    </div>
  );
}
