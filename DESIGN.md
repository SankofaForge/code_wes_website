# Code_Wes site: design notes

A redesign proposal for the Code_Wes board. It keeps the parts of the 2023 site
that already belong to the club (the typed `name = "We are Code_Wes!"` line in a
rotating language, the cardinal, the `#0d1117` ground) and adds member profiles.

## Brief

- **Subject:** Code_Wes, Wesleyan's student coding club.
- **Audience:** Wesleyan students deciding whether to show up, members looking
  each other up, and the board itself.
- **Job:** say what the club is in three seconds, introduce the people, and make
  joining concrete.
- **Assets:** the cardinal logo, the 2026 "meet the board" Instagram post (seven
  portraits, roles, majors, fun facts, and Kyle Quintana's photographs), and the
  club's GitHub history.
- **Constraint:** static export, so either GitHub Pages or Vercel can host it.
  The board decides where it ships.

### Assumptions

- Profiles are opt-in. Board members appear because they posted the same
  material publicly. Each one should confirm before this goes live.
- Fields marked `"seeded": true` in a member file were written from the
  Instagram post, not by the member. Members replace them.
- The course list comes from the club's own 2023 `wesCS.md` guide and may be
  out of date.

## Concepts

| | A. The log (club material) | B. The prerequisite map (place) | C. The declaration (name) |
|---|---|---|---|
| Idea | The site is the club's history read as one `git log --graph`: events are commits, every member is a branch that merged in | The site is Wesleyan's COMP prerequisite graph; members stand on the courses they have taken | The site is one statement, `name = "We are Code_Wes!"`, retyped in the visitor's language; every member is a declaration |
| Anchor | The club lives in the `Code-Wes` GitHub org with real commits back to 2022-09-25, and joining means opening a pull request | The club's own `wesCS.md` course guide | The 2023 homepage's rotating-language title |
| Structure | the log is the site; you read down through time; a unit is a commit or a branch | a map; travel along prerequisite edges; a unit is a course | a document; each clause opens a page |
| Signature | the 2026 board merge: seven branches draw out of main and each polaroid develops at its tip | edges light up from 112 to the 300 cores | the whole page retypes in another language |
| O / F / Fe / P / S | 4 / 5 / 4 / 2 / 5 | 4 / 4 / 3 / 2 / 5 | 3 / 4 / 5 / 3 / 3 |

**Pick A.** The material is real, the history is short enough to show whole, and
the member system (one file per member, added by pull request) is the same
mechanism the site draws. From C: each member's profile renders as a
declaration in the language the visitor picks. From B: "ask me about" can name
courses from the club's guide.

## Concept card

```
Idea:         Code_Wes is a repository, and this site is its log: the club's real history as one
              commit graph, where every member is a branch that merged in.
Metaphor:     git log --graph, read top (HEAD, now) to bottom (the first commit, 2022).
Signature:    The board merge. Scrolling the 2026 commit draws seven branch lines out of main;
              each carries a polaroid that develops from blank white to the full photo as its
              line arrives. Scrubbed ScrollTrigger timeline over SVG pathLength strokes.
Emotion:      "These are real people, and this club has actually been here a while."
Motion verb:  commit and develop: lines draw and lock; images develop like instant film.
Screenshot:   the merge, seven lanes running from blue to red, each ending in a tilted polaroid.
Structure:    The site is the log. You move by reading down the graph; the main line is the
              navigation and the year in the corner tracks where you are. A unit is a commit
              (an event, with its real SHA) or a branch (a member). Opening a member checks out
              their branch: /members/<slug> draws their lane alone and shows their file.
Escape hatch: /members, a plain list of every member with links. It is always in the corner.
```

## Art direction

### Palette

| Role | Hex | Source |
|---|---|---|
| ground | `#0d1117` | the 2023 site's background |
| ink | `#e6edf3` | text on ground |
| muted | `#8d96a0` | dates, secondary text (6.4:1 on ground) |
| line | `#30363d` | the main line before it is drawn |
| blue | `#5cb8ff` | name color in the 2026 board post |
| red | `#ff4d5e` | the cardinal and the board post's glow (5.4:1 on ground) |
| paper | `#e9eaec` | polaroid frame, cool grey taken from the post |

The blue-to-red run is the club's 2026 identity. It appears only as line color:
the main line runs blue at HEAD to red at the first commit, and the seven member
lanes take seven steps along the same run. It is never a background wash.

### Type

- **Hanken Grotesk** (Google) for names, headings and body. Names are the
  display type: 700, `--t-mega` on profiles, tracking -0.045em.
- **Space Mono** (Google) for code only: the typed HEAD line, the member
  declarations, commit SHAs and dates on the graph. Its slashed zero matches the
  post's `_Code_wes_2Ø26`. No decorative monospace labels.
- Scale: mega (profile names), xl (HEAD line, board heading), m (commit
  subjects), body 17px, s 14px for dates. Four levels with large jumps.

### Grid and space

- 12 columns. The main line hangs at the left edge of column 1 on every page;
  commit text starts at column 2, wide copy runs to column 8.
- Dense where the history is (commit rows sit close, like a real log). Open at
  HEAD, and around the board merge, where the drawing needs the room.
- No borders around blocks. The only lines are the graph.

### Shape and motion

- Radius 0 everywhere except the polaroid photo corners (2px, as printed).
- Eases from the engine: `expo.out` for entrances, `expo.inOut` for the
  curtain. Lines draw on scroll scrub; polaroids develop over 0.9s.
- Native scroll with ScrollSmoother on desktop (touch stays native).
- Hover treatments, one per role: polaroids straighten and lift with their lane
  brightening; commit links draw an underline from the SHA; corner refs roll.
- Idle: the HEAD line keeps typing and erasing the club's name in rotating
  languages, as it has since 2023. Off under reduced motion, where the
  TypeScript line stays put.
- Page transition: "checkout". The curtain redraws the screen top to bottom in
  stepped bands, like a terminal repaint, with the target path in the middle.

### Structure plan

```
DESKTOP                                         PHONE (390)
[cardinal] Code_Wes          members  join      [cardinal]      members join
│                                               │
●  HEAD   const name = "We are Code_Wes!"▌      ● HEAD
│         one paragraph: what the club is       │ name = "We are…"▌
│                                               │ paragraph
●  2026   The board                             ● 2026 The board
├─╮─╮─╮─╮─╮─╮─╮                                 ├─╮ [pol] [pol]
│ ╰[pol] ╰[pol] ╰[pol] ╰[pol]                   ├─╮ [pol] [pol]
│     ╰[pol] ╰[pol] ╰[pol]                      ├─╮ [pol] [pol]
│                                               ╰─╮ [pol]
●  2024-09  bd85950  WesHack 2024               ● 2024-09 WesHack 2024
●  2023-10  b70a1d8  The club guide, presented  ● …
●  2023-09  8885245  First homepage             │
●  2023-06  5ca27bb  Code-Wes on GitHub         │
●  2022-09  9edff70  Initial commit             │
◯  branch off here: Discord, GitHub, WesNest,   ◯ branch off here
   add yourself (/join)

/members/<slug>     main line on the left, one lane forks to the profile: polaroid, name at
                    mega size, role, the member file as a declaration (language tabs),
                    fun fact, ask me about, projects; prev and next branch at the bottom.
/members            plain list: name, role, majors, link. The escape hatch.
/join               the member file template and the five steps to open the pull request.
404                 git's own error: "fatal: ambiguous argument … unknown revision".
```

### Genericness test

- Skeleton: not a navbar over a hero. There is no hero block; HEAD is the first
  commit of the log and shares its row layout.
- The board could have been a grid of four cards. It is a merge, because that is
  how the members actually joined the club's history.
- Purple-blue gradient tell: avoided as a wash; the colors are data on lines.
- Mono-label tell: monospace is reserved for real code, real SHAs and dates.
