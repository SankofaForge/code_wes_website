'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { REF_EVENT } from './LogDriver';

const subscribeNothing = () => () => {};

// The corner is the only fixed UI. Its ref says where you are in the log: HEAD on the home page
// (the home driver rewrites it to the year in view), the member's branch on a profile.
function refFor(path: string) {
  const p = path.replace(/\/$/, '');
  if (p === '') return 'HEAD';
  if (p.startsWith('/members/')) return `members/${p.split('/')[2]}`;
  return p.slice(1);
}

function Roll({ href, label, current }: { href: string; label: string; current: boolean }) {
  return (
    <Link className="roll" href={href} aria-current={current ? 'page' : undefined}>
      <span>{label}</span>
      <span aria-hidden="true">{label}</span>
    </Link>
  );
}

export function Corner() {
  const path = usePathname();
  const at = (p: string) => path === p || path === `${p}/`;
  // The home driver names the commit in view; the value only counts on the page that sent it.
  const [live, setLive] = useState<{ ref: string; path: string } | null>(null);
  useEffect(() => {
    const on = (e: Event) => setLive((e as CustomEvent<{ ref: string; path: string }>).detail);
    addEventListener(REF_EVENT, on);
    return () => removeEventListener(REF_EVENT, on);
  }, []);
  // The static 404 page is rendered for one path and served for any other, so the ref waits for
  // the browser's real path instead of trusting the server's.
  const mounted = useSyncExternalStore(subscribeNothing, () => true, () => false);
  const ref = !mounted ? '' : live && live.path === path ? live.ref : refFor(path);
  return (
    <header className="corner">
      <Link className="corner__home" href="/" aria-label="Code_Wes, home">
        <img src="/cardinal.webp" alt="" width={240} height={274} />
        <span className="corner__name">Code_Wes</span>
      </Link>
      <p className="corner__ref" aria-live="off">
        <span className="sr-only">You are at </span>
        <span>{ref}</span>
      </p>
      <nav className="corner__nav" aria-label="Site">
        <Roll href="/members/" label="members" current={at('/members')} />
        <Roll href="/join/" label="join" current={at('/join')} />
      </nav>
    </header>
  );
}
