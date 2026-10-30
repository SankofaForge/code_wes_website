// Renders a member file as a declaration in one of the languages the HEAD line rotates through.
// Output is a list of lines, each a list of [kind, text] tokens, so the page can color them
// without a syntax-highlighting library.

export const languages = ['JavaScript', 'Python', 'Go', 'Swift', 'R', 'Lua'] as const;
export type Language = (typeof languages)[number];
export type Token = [kind: 'kw' | 'id' | 'key' | 'str' | 'num' | 'p', text: string];
export type Line = Token[];

export type Declarable = {
  slug: string;
  role: string;
  board?: number;
  study: string;
  askMeAbout: string[];
  funFact?: string;
};

type Field = { key: string; value: string | number | string[] };

const camel = (s: string) => s.replace(/[-_](\w)/g, (_, c: string) => c.toUpperCase());
const snake = (s: string) => s.replace(/-/g, '_').replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
const pascal = (s: string) => camel(s).replace(/^\w/, (c) => c.toUpperCase());
const quote = (s: string) => `"${s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

function fields(m: Declarable): Field[] {
  const out: Field[] = [{ key: 'role', value: m.role }];
  if (m.board) out.push({ key: 'board', value: m.board });
  out.push({ key: 'study', value: m.study });
  if (m.askMeAbout.length) out.push({ key: 'askMeAbout', value: m.askMeAbout });
  if (m.funFact) out.push({ key: 'funFact', value: m.funFact });
  return out;
}

type Style = {
  open: (name: string) => Line;
  close: Line;
  key: (k: string) => string;
  assign: Token;
  list: [string, string];
  indent: string;
  trailingComma: boolean;
  align?: boolean;
};

const styles: Record<Language, (slug: string) => Style> = {
  JavaScript: (slug) => ({
    open: () => [['kw', 'const '], ['id', camel(slug)], ['p', ' = {']],
    close: [['p', '};']],
    key: camel,
    assign: ['p', ': '],
    list: ['[', ']'],
    indent: '  ',
    trailingComma: true,
  }),
  Python: (slug) => ({
    open: () => [['id', snake(slug)], ['p', ' = '], ['kw', 'Member'], ['p', '(']],
    close: [['p', ')']],
    key: snake,
    assign: ['p', '='],
    list: ['[', ']'],
    indent: '    ',
    trailingComma: true,
  }),
  Go: (slug) => ({
    open: () => [['id', camel(slug)], ['p', ' := '], ['kw', 'Member'], ['p', '{']],
    close: [['p', '}']],
    key: pascal,
    assign: ['p', ': '],
    list: ['[]string{', '}'],
    indent: '\t',
    trailingComma: true,
    align: true,
  }),
  Swift: (slug) => ({
    open: () => [['kw', 'let '], ['id', camel(slug)], ['p', ' = '], ['kw', 'Member'], ['p', '(']],
    close: [['p', ')']],
    key: camel,
    assign: ['p', ': '],
    list: ['[', ']'],
    indent: '    ',
    trailingComma: false,
  }),
  R: (slug) => ({
    open: () => [['id', snake(slug)], ['p', ' <- '], ['kw', 'list'], ['p', '(']],
    close: [['p', ')']],
    key: snake,
    assign: ['p', ' = '],
    list: ['c(', ')'],
    indent: '  ',
    trailingComma: false,
  }),
  Lua: (slug) => ({
    open: () => [['kw', 'local '], ['id', snake(slug)], ['p', ' = {']],
    close: [['p', '}']],
    key: snake,
    assign: ['p', ' = '],
    list: ['{ ', ' }'],
    indent: '  ',
    trailingComma: true,
  }),
};

function value(v: Field['value'], list: [string, string]): Token[] {
  if (typeof v === 'number') return [['num', String(v)]];
  if (typeof v === 'string') return [['str', quote(v)]];
  const items: Token[] = [['p', list[0]]];
  v.forEach((item, i) => {
    if (i) items.push(['p', ', ']);
    items.push(['str', quote(item)]);
  });
  items.push(['p', list[1]]);
  return items;
}

export function declare(m: Declarable, lang: Language): Line[] {
  const s = styles[lang](m.slug);
  const fs = fields(m);
  const width = s.align ? Math.max(...fs.map((f) => s.key(f.key).length)) + 1 : 0;
  const lines: Line[] = [s.open(m.slug)];
  fs.forEach((f, i) => {
    const key = s.key(f.key);
    const assign: Token = s.align ? ['p', ':'.padEnd(width - key.length + 1)] : s.assign;
    const last = i === fs.length - 1;
    const comma: Token[] = !last || s.trailingComma ? [['p', ',']] : [];
    lines.push([['p', s.indent], ['key', key], assign, ...value(f.value, s.list), ...comma]);
  });
  lines.push(s.close);
  return lines;
}
