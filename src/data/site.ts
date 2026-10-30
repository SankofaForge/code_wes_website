export const site = {
  name: 'Code_Wes',
  url: 'https://code-wes-website.vercel.app',
  tagline: "Wesleyan's coding club",
  description:
    "Code_Wes is Wesleyan's coding club: a place to talk through the CS major, meet outside of classes, and work on projects together.",
  about:
    'A place where students interested in coding can talk through the CS major, meet outside of classes, and work on projects together.',
  // The proposal fork. Point this at Code-Wes/code_wes_website if the board adopts the redesign.
  repo: 'https://github.com/SankofaForge/code_wes_website',
  links: [
    { label: 'Discord', href: 'https://discord.gg/abTZpXBM7', note: 'where the club talks between meetings' },
    { label: 'Instagram', href: 'https://www.instagram.com/code_wes/', note: 'events and the board' },
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

export type Commit = {
  sha?: string;
  repo?: string;
  date: string; // YYYY-MM-DD
  author?: string;
  message?: string; // the real commit message
  title: string;
  body: string;
  href?: string;
};

const commit = (repo: string, sha: string) => `https://github.com/Code-Wes/${repo}/commit/${sha}`;

// The club's real history on GitHub, newest first. Messages are quoted as committed.
export const history: Commit[] = [
  {
    sha: 'bd85950',
    repo: 'weshack-2024',
    date: '2024-09-21',
    author: 'ananafrida',
    message: 'Update README.md',
    title: 'WesHack 2024',
    body: 'The 2024 hackathon gets a repo in the Code-Wes org, pointing to its website.',
    href: commit('weshack-2024', 'bd85950'),
  },
  {
    sha: 'b70a1d8',
    repo: 'Code_Wes_Introduction',
    date: '2023-10-08',
    author: 'danielgoldelman',
    message: 'update before presentation',
    title: 'The guide gets presented',
    body: 'The club guide is updated before a presentation, and an officer is added the same day.',
    href: commit('Code_Wes_Introduction', 'b70a1d8'),
  },
  {
    sha: '76b71aa',
    repo: 'code_wes_website',
    date: '2023-10-01',
    author: 'n-aggarwal',
    message: 'Create nextjs.yml',
    title: 'The site learns to deploy itself',
    body: 'A workflow builds the homepage on every push to main.',
    href: commit('code_wes_website', '76b71aa'),
  },
  {
    sha: '8885245',
    repo: 'code_wes_website',
    date: '2023-09-07',
    author: 'danielgoldelman',
    message: 'initial homepage implimented',
    title: 'The first homepage',
    body: 'Pull request #1 brings the typed name line that still opens this page.',
    href: commit('code_wes_website', '8885245'),
  },
  {
    sha: 'a0327c2',
    repo: 'Code_Wes_Introduction',
    date: '2023-06-21',
    author: 'n-aggarwal',
    message: 'updated readme, emails, and wesCS',
    title: 'A guide to the CS major',
    body: "The club writes down what it knows about Wesleyan's CS courses and faculty, from COMP 112 to the 300-level cores.",
    href: 'https://github.com/Code-Wes/Code_Wes_Introduction/blob/main/wesCS.md',
  },
  {
    date: '2023-06-20',
    title: 'Code-Wes on GitHub',
    body: 'The organization opens, and the website repo gets its first commit two days later.',
    href: 'https://github.com/Code-Wes',
  },
  {
    sha: '9edff70',
    repo: 'Code_Wes_Introduction',
    date: '2022-09-25',
    author: 'danielgoldelman',
    message: 'Initial commit',
    title: 'Initial commit',
    body: 'The oldest trace of the club on GitHub: the start of the guide that became Code_Wes_Introduction.',
    href: commit('Code_Wes_Introduction', '9edff70'),
  },
];

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return `${months[m - 1]} ${d}, ${y}`;
};
