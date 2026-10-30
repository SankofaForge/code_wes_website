import type { Metadata } from 'next';
import { site } from '@/data/site';

export const metadata: Metadata = {
  title: 'Add yourself',
  description: 'How to add your own member page to the Code_Wes site: one JSON file, an optional photo, one pull request.',
};

const template = `{
  "$schema": "../member.schema.json",
  "name": "Ada Lovelace",
  "role": "Member",
  "study": "Computer Science and Mathematics",
  "funFact": "One true sentence about you.",
  "askMeAbout": ["COMP 212", "Rust"],
  "photo": {
    "src": "/members/ada-lovelace.webp",
    "alt": "Ada Lovelace smiling outside Olin Library"
  },
  "projects": [
    {
      "name": "A thing you built",
      "url": "https://github.com/you/thing",
      "about": "What it does, in a sentence."
    }
  ],
  "links": { "github": "https://github.com/you" }
}`;

export default function Join() {
  return (
    <div className="page">
      <div className="rail rail--drawn" aria-hidden="true" />
      <header className="page__head">
        <h1 className="page__title" data-split="lines" data-intro>Add yourself</h1>
        <p className="page__lede">
          A member page is one JSON file in this site&rsquo;s repository. If you have never opened a pull request,
          this is a gentle first one.
        </p>
      </header>

      <ol className="steps">
        <li>
          <h2>Fork the repository</h2>
          <p>
            Open <a className="link" href={site.repo}>{site.repo.replace('https://', '')}</a> and fork it, or clone it
            if you already have access.
          </p>
        </li>
        <li>
          <h2>Make your file</h2>
          <p>
            Create <code>content/members/your-name.json</code>. The file name becomes your address:{' '}
            <code>ada-lovelace.json</code> is <code>/members/ada-lovelace/</code>. Only <code>name</code>,{' '}
            <code>role</code> and <code>study</code> are required; leave out anything you would rather not share.
          </p>
        </li>
        <li>
          <h2>Add a photo, if you want one</h2>
          <p>
            Put it in <code>public/members/</code> as a WebP or JPEG under 200&nbsp;KB, and describe it in{' '}
            <code>alt</code> for people using screen readers. No photo is fine; your polaroid shows your initials.
          </p>
        </li>
        <li>
          <h2>Open a pull request</h2>
          <p>
            The build reads every member file and stops with a message naming the file and field to fix, so you will
            know before anyone reviews it.
          </p>
        </li>
        <li>
          <h2>Merge</h2>
          <p>Once it is merged, your page is live and your name joins the members list.</p>
        </li>
      </ol>

      <section className="template" aria-labelledby="template-h">
        <h2 id="template-h" className="profile__h2">A starting file</h2>
        <pre className="decl__code" tabIndex={0}><code>{template}</code></pre>
      </section>
    </div>
  );
}
