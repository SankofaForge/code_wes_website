# Events

One JSON file per past event. The file name is the address: `weshack-2024.json` is served at `/events/weshack-2024/`, and the event also shows up on `/log` as a tagged commit.

Only `name`, `date`, `kind` and `summary` are required. [`../event.schema.json`](../event.schema.json) lists every field. Put photos in `public/events/`.

```json
{
  "$schema": "../event.schema.json",
  "name": "WesHack 2024",
  "date": "2024-10-05",
  "kind": "hackathon",
  "place": "Exley Science Center",
  "summary": "What happened, in two or three sentences.",
  "attendance": 60,
  "links": [{ "label": "Devpost", "url": "https://example.devpost.com/" }]
}
```

The values above are an example, not the real event. Only add facts someone on the board has checked.
