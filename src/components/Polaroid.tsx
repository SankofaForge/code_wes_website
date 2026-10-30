import type { Photo } from '@/lib/members';

type Props = {
  name: string;
  role?: string;
  photo?: Photo;
  priority?: boolean;
  sizes: string;
};

// The polaroid from the board post: a cool grey frame, the photo, and the name written in the
// margin. The emulsion layer covers the photo until the motion code develops it; without JS or
// with reduced motion it is transparent from the start.
export function Polaroid({ name, role, photo, priority, sizes }: Props) {
  const initials = name.split(/\s+/).map((w) => w[0]).join('').slice(0, 2);
  return (
    <span className="pol">
      <span className="pol__photo">
        {photo ? (
          <img
            src={photo.src}
            srcSet={photo.srcSet}
            alt={photo.alt}
            width={900}
            height={1126}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : undefined}
            decoding="async"
          />
        ) : (
          <span className="pol__blank" aria-hidden="true">{initials}</span>
        )}
        <span className="pol__emulsion" aria-hidden="true" />
      </span>
      <span className="pol__caption">
        <span className="pol__name">{name}</span>
        {role && <span className="pol__role">{role}</span>}
      </span>
    </span>
  );
}
