import type { Metadata } from 'next';
import Link from 'next/link';
import { MissingRef } from '@/components/MissingRef';

export const metadata: Metadata = { title: 'Not found' };

// git's own answer when you ask for a revision that does not exist.
export default function NotFound() {
  return (
    <div className="page page--lost">
      <div className="rail rail--broken" aria-hidden="true" />
      <h1 className="lost__title">Not found</h1>
      <pre className="lost__git" aria-label="This page does not exist.">
        <code>
          <span className="tk-p">$ </span>git checkout <MissingRef />{'\n'}
          <span className="tk-err">fatal:</span> ambiguous argument &apos;<MissingRef />&apos;: unknown revision or path
          not in the working tree.
        </code>
      </pre>
      <p className="lost__next">
        <Link className="btn" href="/">git checkout main</Link>
        <Link className="link" href="/members/">see every member</Link>
      </p>
    </div>
  );
}
