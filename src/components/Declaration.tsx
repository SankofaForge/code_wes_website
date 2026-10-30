'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { declare, languages, type Declarable, type Language } from '@/lib/declare';

const KEY = 'cw-lang';

function stored(): Language | null {
  try {
    const v = localStorage.getItem(KEY);
    return languages.includes(v as Language) ? (v as Language) : null;
  } catch {
    return null;
  }
}

// A member's file, declared in the visitor's language. The choice is remembered per browser, so
// every profile reads in the same language. Tabs follow the ARIA tabs pattern.
export function Declaration({ member }: { member: Declarable }) {
  const [lang, setLang] = useState<Language>('JavaScript');
  const id = useId();
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const saved = stored();
    // Hydrate with the server's language, then switch to the saved one.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved) setLang(saved);
  }, []);

  const choose = (l: Language, focus = false) => {
    setLang(l);
    try { localStorage.setItem(KEY, l); } catch { /* storage blocked: the choice lasts this page */ }
    if (focus) tabs.current[languages.indexOf(l)]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    const i = languages.indexOf(lang);
    const n = languages.length;
    const to = e.key === 'ArrowRight' ? (i + 1) % n : e.key === 'ArrowLeft' ? (i - 1 + n) % n
      : e.key === 'Home' ? 0 : e.key === 'End' ? n - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    choose(languages[to], true);
  };

  const lines = declare(member, lang);
  return (
    <div className="decl">
      <div className="decl__tabs" role="tablist" aria-label="Language" onKeyDown={onKey}>
        {languages.map((l, i) => (
          <button
            key={l}
            ref={(el) => { tabs.current[i] = el; }}
            type="button"
            role="tab"
            id={`${id}-${i}`}
            aria-selected={l === lang}
            aria-controls={`${id}-panel`}
            tabIndex={l === lang ? 0 : -1}
            className="decl__tab"
            onClick={() => choose(l)}
          >
            {l}
          </button>
        ))}
      </div>
      <pre className="decl__code" role="tabpanel" id={`${id}-panel`} aria-labelledby={`${id}-${languages.indexOf(lang)}`} tabIndex={0}>
        <code>
          {lines.map((line, i) => (
            <span key={i} className="decl__line">
              {line.map(([kind, text], j) => <span key={j} className={`tk-${kind}`}>{text}</span>)}
              {'\n'}
            </span>
          ))}
        </code>
      </pre>
    </div>
  );
}
