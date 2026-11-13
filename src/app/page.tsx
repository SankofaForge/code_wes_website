import Link from 'next/link';
import { BoardMerge } from '@/components/BoardMerge';
import { HeadLine } from '@/components/HeadLine';
import { LogDriver } from '@/components/LogDriver';
import { mix, Node } from '@/components/Node';
import { site } from '@/data/site';
import { linkIcons } from '@/data/link-icons';
import { getBoard } from '@/lib/members';

const BOARD_YEAR = 2026;

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
              Seven people run the club this year. Select a board member to learn more about them.
            </p>
          </div>
          <BoardMerge members={board} />
        </li>

        <li className="commit commit--root" data-ref="your branch" style={mix(rows - 1, rows)}>
          <Node hollow />
          <div className="commit__text">
            <h2 className="commit__title commit__title--big">Branch off here</h2>
            <p className="commit__body">
              Want a page on this site? Add a JSON file and, if you like, a photo through a pull request.
            </p>
            <p className="commit__cta">
              <Link className="btn" href="/join/">Add yourself</Link>
            </p>
            <ul className="elsewhere">
              {site.links.map((l) => (
                <li key={l.label}>
                  <a className="elsewhere__link draw" href={l.href} target="_blank" rel="noopener noreferrer">
                    {linkIcons[l.label] && (
                      <svg className="elsewhere__icon" viewBox="0 0 24 24" aria-hidden="true">
                        <path d={linkIcons[l.label]} />
                      </svg>
                    )}
                    <span>{l.label}</span>
                  </a>
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
