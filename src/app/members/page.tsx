import type { Metadata } from 'next';
import Link from 'next/link';
import { getMembers } from '@/lib/members';

export const metadata: Metadata = {
  title: 'Members',
  description: 'Everyone with a member file in the Code_Wes site, board first.',
};

// The escape hatch: every branch in the log as a plain list with real links.
export default function Members() {
  const members = getMembers();
  return (
    <div className="page">
      <div className="rail rail--drawn" aria-hidden="true" />
      <header className="page__head">
        <h1 className="page__title" data-split="lines" data-intro>Members</h1>
        <p className="page__lede">
          Everyone with a file in the site, board first. {members.length} so far. <Link className="link" href="/join/">Add yours</Link>.
        </p>
      </header>
      <ol className="roster">
        {members.map((m) => (
          <li key={m.slug} className="roster__row">
            <Link className="roster__link" href={`/members/${m.slug}/`}>
              <span className="roster__name">{m.name}</span>
              <span className="roster__role">{m.role}{m.board ? `, ${m.board}` : ''}</span>
              <span className="roster__study">{m.study}</span>
            </Link>
          </li>
        ))}
      </ol>
    </div>
  );
}
