import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Declaration } from '@/components/Declaration';
import { Polaroid } from '@/components/Polaroid';
import { ProfileLane } from '@/components/ProfileLane';
import { site } from '@/data/site';
import { laneMix } from '@/lib/merge';
import { getMember, getMembers } from '@/lib/members';

export const dynamicParams = false;

export function generateStaticParams() {
  return getMembers().map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<'/members/[slug]'>): Promise<Metadata> {
  const m = getMember((await params).slug);
  if (!m) return {};
  const what = m.board ? `${m.role} on the ${m.board} Code_Wes board` : 'Code_Wes member';
  return {
    title: m.name,
    description: `${m.name}, ${what}. Studies ${m.study}.`,
    openGraph: m.photo ? { images: [m.photo.src] } : undefined,
  };
}

export default async function MemberPage({ params }: PageProps<'/members/[slug]'>) {
  const { slug } = await params;
  const members = getMembers();
  const i = members.findIndex((m) => m.slug === slug);
  if (i < 0) notFound();
  const m = members[i];
  const prev = members[(i - 1 + members.length) % members.length];
  const next = members[(i + 1) % members.length];
  const first = m.name.split(' ')[0];
  const file = `content/members/${m.slug}.json`;
  const links = Object.entries(m.links).filter(([, href]) => href) as [string, string][];

  return (
    <article className="profile">
      <div className="rail rail--drawn" aria-hidden="true" />
      <div className="profile__grid">
        <ProfileLane mix={laneMix(i, members.length)}>
          <Polaroid name={m.name} photo={m.photo} priority sizes="(max-width: 767px) 64vw, 30vw" />
        </ProfileLane>

        <header className="profile__head">
          <h1 className="profile__name" data-split="lines" data-intro>{m.name}</h1>
          <p className="profile__role">
            {m.role}
            {m.board && <span>, {m.board} board</span>}
          </p>
          <p className="profile__study">{m.study}</p>
        </header>

        {m.funFact && (
          <figure className="profile__fact">
            <blockquote><p>{m.funFact}</p></blockquote>
            <figcaption>{first}&rsquo;s fun fact</figcaption>
          </figure>
        )}

        <section className="profile__file" aria-labelledby="file-h">
          <h2 id="file-h" className="profile__h2">{first}&rsquo;s file</h2>
          <p className="profile__note">
            The same <a className="link" href={`${site.repo}/blob/main/${file}`}>{file}</a>, declared in the
            language you pick.
          </p>
          <Declaration member={{ slug: m.slug, role: m.role, board: m.board, study: m.study, askMeAbout: m.askMeAbout, funFact: m.funFact }} />
        </section>

        {m.askMeAbout.length > 0 && (
          <section className="profile__ask" aria-labelledby="ask-h">
            <h2 id="ask-h" className="profile__h2">Ask {first} about</h2>
            <ul className="chips">
              {m.askMeAbout.map((topic) => <li key={topic}>{topic}</li>)}
            </ul>
          </section>
        )}

        {m.projects.length > 0 && (
          <section className="profile__projects" aria-labelledby="projects-h">
            <h2 id="projects-h" className="profile__h2">Building</h2>
            <ul className="projects">
              {m.projects.map((p) => (
                <li key={p.url}>
                  <a className="projects__name draw" href={p.url} target="_blank" rel="noopener noreferrer">{p.name}</a>
                  <p>{p.about}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        {m.gallery.length > 0 && (
          <section className="profile__gallery" aria-labelledby="gallery-h">
            <h2 id="gallery-h" className="profile__h2">Photographs by {first}</h2>
            <ul className="gallery">
              {m.gallery.map((g) => (
                <li key={g.src} style={{ aspectRatio: `${g.width} / ${g.height}` }}>
                  <img src={g.src} alt={g.alt} width={g.width} height={g.height} loading="lazy" decoding="async" data-reveal="clip" />
                </li>
              ))}
            </ul>
          </section>
        )}

        {links.length > 0 && (
          <ul className="profile__links">
            {links.map(([kind, href]) => (
              <li key={kind}><a className="link" href={href} target="_blank" rel="noopener noreferrer">{kind}</a></li>
            ))}
          </ul>
        )}

        {m.seeded && (
          <p className="profile__seeded">
            Written from the {m.board ?? ''} board post, not by {first}. {first} can change any of it in{' '}
            <a className="link" href={`${site.repo}/blob/main/${file}`}>{file}</a>.
          </p>
        )}
      </div>

      <nav className="branches" aria-label="Other members">
        <Link className="branches__link branches__link--prev" href={`/members/${prev.slug}/`}>
          <span className="branches__dir">previous branch</span>
          <span className="branches__name">{prev.name}</span>
        </Link>
        <Link className="branches__link branches__link--next" href={`/members/${next.slug}/`}>
          <span className="branches__dir">next branch</span>
          <span className="branches__name">{next.name}</span>
        </Link>
      </nav>
    </article>
  );
}
