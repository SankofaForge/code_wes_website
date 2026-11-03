export const site = {
  name: 'Code_Wes',
  url: 'https://code-wes-redesign.vercel.app',
  tagline: "Wesleyan's coding club",
  description:
    "Code_Wes is Wesleyan's coding club: a place to talk through the CS major, meet outside of classes, and work on projects together.",
  about:
    'A place where students interested in coding can talk through the CS major, meet outside of classes, and work on projects together.',
  // The proposal fork. Point this at Code-Wes/code_wes_website if the board adopts the redesign.
  repo: 'https://github.com/SankofaForge/code_wes_website',
  links: [
    { label: 'GroupMe', href: 'https://groupme.com/join_group/117817725/zQgq4oL4', note: 'where the club talks between meetings' },
    { label: 'Instagram', href: 'https://www.instagram.com/code_wes/', note: 'events and the board' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/codewes/', note: 'alumni, updates, and careers' },
    { label: 'WesNest', href: 'https://wesleyan.campuslabs.com/engage/organization/code_wes', note: 'the official club page' },
    { label: 'GitHub', href: 'https://github.com/Code-Wes', note: 'every repo, this site included' },
  ],
} as const;

/** The HEAD line types the club's name as a declaration in a rotating language (from the 2023 site). */
export const declarations = [
  { lang: 'JavaScript', start: 'const name = ', end: ';' },
  { lang: 'Python', start: 'name = ', end: '' },
  { lang: 'Java', start: 'String name = ', end: ';' },
  { lang: 'C++', start: 'std::string name = ', end: ';' },
  { lang: 'Swift', start: 'let name = ', end: '' },
  { lang: 'Go', start: 'var name string = ', end: '' },
  { lang: 'Go', start: 'name := ', end: '' },
  { lang: 'PHP', start: '$name = ', end: ';' },
  { lang: 'Lua', start: 'local name = ', end: '' },
  { lang: 'R', start: 'name <- ', end: '' },
  { lang: 'Perl', start: 'my $name = ', end: ';' },
] as const;
