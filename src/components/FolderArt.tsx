import type { CSSProperties } from 'react';
import type { CourseMapLayout } from '@/lib/courseMap';

// One drawing per resources folder, made in Glaxnimate (design/marks/*.svg) and inlined so GSAP can
// draw it on. Strokes take the site's tokens: ink, muted, line, and steps along the blue-to-red run
// (--mix). Every stroke that draws on carries pathLength="1" and data-draw; filled marks pop in
// (data-pop). The static drawing is the server render, so it's complete without JavaScript.

type Kind = 'courses' | 'campus' | 'careers' | 'learning';
const run = (mix: number) => ({ '--mix': `${mix}%` }) as CSSProperties;
const P = (props: { d: string; c: string; mix?: number }) => (
  <path d={props.d} className={`art__${props.c}`} style={props.mix === undefined ? undefined : run(props.mix)} pathLength={1} data-draw />
);

const columns = [98, 123, 148, 172, 197, 222];

function Campus() {
  return (
    <svg viewBox="0 0 320 240" focusable="false">
      <P d="M16 214H304" c="line" />
      <P d="M62 214V206H258V214M72 206V198H248V206" c="muted" />
      <P d="M82 198V190H238V198" c="ink" />
      {columns.map((x, i) => (
        <P key={x} d={`M${x - 5} 190V120M${x + 5} 190V120M${x - 9} 120H${x + 9}`} c="run" mix={(i / (columns.length - 1)) * 100} />
      ))}
      <P d="M80 120H240V108H80Z" c="ink" />
      <P d="M74 108L160 64L246 108" c="ink" />
      <circle cx="160" cy="92" r="7" className="art__run" style={run(0)} pathLength={1} data-draw />
      <P d="M160 64V38" c="ink" />
      <path d="M160 40L182 46L160 52Z" className="art__fill" data-pop data-flutter />
      <P d="M40 214V182M40 182C22 182 16 166 22 154C26 144 36 140 40 140C46 140 56 144 60 154C64 166 58 182 40 182Z" c="muted" />
      <P d="M282 214V188M282 188C268 188 262 176 266 166C270 158 278 154 282 154C288 154 296 158 298 166C302 176 296 188 282 188Z" c="muted" />
    </svg>
  );
}

function Careers() {
  return (
    <svg viewBox="0 0 320 240" focusable="false">
      <P d="M40 16V224" c="line" />
      <P d="M40 66V118Q40 150 72 150H118" c="run" mix={40} />
      <circle cx="40" cy="60" r="6" className="art__node" style={run(0)} pathLength={1} data-draw />
      <P d="M124 104H284Q292 104 292 112V198Q292 206 284 206H124Q116 206 116 198V112Q116 104 124 104Z" c="ink" />
      <P d="M180 104V92Q180 84 188 84H220Q228 84 228 92V104" c="ink" />
      <P d="M116 146H192M216 146H292" c="muted" />
      <P d="M192 138H216V156H192Z" c="run" mix={100} />
      <g data-twinkle><P d="M262 56V72M254 64H270" c="run" mix={100} /></g>
      <g data-twinkle><P d="M292 76V86M287 81H297" c="run" mix={75} /></g>
    </svg>
  );
}

function Learning() {
  return (
    <svg viewBox="0 0 320 240" focusable="false">
      <P d="M160 72Q118 56 52 64V188Q118 180 160 196Z" c="ink" />
      <P d="M160 72Q202 56 268 64V188Q202 180 160 196Z" c="ink" />
      <P d="M160 72V196" c="muted" />
      <P d="M68 92H134M68 110H118M82 128H140M82 146H124M68 164H132" c="run" mix={0} />
      <P d="M178 92H236M178 110H236M192 128H226" c="run" mix={55} />
      <rect x="232" y="121" width="7" height="14" className="art__fill" data-pop data-blink />
      <P d="M244 62V98L250 92L256 98V62" c="run" mix={100} />
      <P d="M36 214H284" c="line" />
    </svg>
  );
}

/** The real course map, small: the same lanes and courses as /resources/courses/, without labels. */
function Courses({ layout }: { layout: CourseMapLayout }) {
  const { width, height, nodeH, nodes, edges } = layout;
  return (
    <svg viewBox={`-20 -20 ${width + 40} ${height + 40}`} focusable="false" className="art__map">
      {edges.map((e) => (
        <path key={`${e.from}-${e.to}`} d={e.d} className="art__run art__lane" style={run(e.mix)} pathLength={1} data-draw />
      ))}
      {nodes.map((n) => (
        <rect key={n.slug} x={n.x - n.w / 2} y={n.y} width={n.w} height={nodeH} className="art__box" style={run(n.mix)} data-pop />
      ))}
    </svg>
  );
}

export function FolderArt({ kind, layout }: { kind: Kind; layout?: CourseMapLayout }) {
  return (
    <div className={`art art--${kind}`} aria-hidden="true" data-art>
      {kind === 'courses' && layout ? <Courses layout={layout} /> : kind === 'campus' ? <Campus /> : kind === 'careers' ? <Careers /> : <Learning />}
    </div>
  );
}
