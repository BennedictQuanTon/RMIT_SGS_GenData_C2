# Unfound — Design System
> Gallery-white walls, black type, one light-blue seal. Every screen should feel like a quiet room where nothing about you is on display.

**Theme:** light only
**Derived from:** the Clutch Security style reference (clutch.security), adapted for Unfound. Clutch gives us the structure: gallery-white canvas, mixed-weight grotesk headlines, 6px corners, 1px hairlines, no decorative shadows. Unfound adds its own touch: a raw 2D mark instead of 3D renders, a light-blue "seal" colour for protected data, and ciphertext shown as a design material.

This file is the single source of truth for the landing page (`/`) and the demo app (`/demo`). The CSS tokens in `src/styles.css` mirror it one-to-one. If the two disagree, fix the code.

---

## Brand

| Item | Value |
|------|-------|
| Name | **Unfound** (un·found). Wordmark is lowercase: `unfound` |
| Slogan | **Be reached, not found.** |
| Support line | Your address, held by no one. |
| Mark | "The pin with no point": a map-pin head drawn as an open arch with a dot inside. The point that would land on a location is missing. Read twice, it is also a doorway. |
| Mark geometry | 64×64 grid. Arch stroke 9 units, butt caps, centre dot r = 5.5. Flat Obsidian. No gradients, no shadows, no 3D. |
| Voice | Short, calm, factual. Say "survivor" in the product. Never show violence. Name what people can now do, not the security mechanism. |

---

## Tokens — Colors

Black, white, greys and light blue. Nothing else.

| Name | Value | Token | Role |
|------|-------|-------|------|
| Obsidian | `#000000` | `--color-obsidian` | All primary text, the mark, Filled Black buttons, DENIED badges, the primary chart series |
| Canvas | `#ffffff` | `--color-canvas` | Page background, card surfaces, text on dark fills |
| Fog | `#f9fafb` | `--color-fog` | Alternating section background, sidebar and log panels |
| Slate Mist | `#e5e7eb` | `--color-slate-mist` | Primary 1px hairline borders, table rows, chart tracks |
| Pewter | `#dfdfdf` | `--color-pewter` | Card edges, input outlines |
| Stone | `#c9c9c9` | `--color-stone` | Context series in charts, disabled fills |
| Graphite | `#6e6e6e` | `--color-graphite` | Secondary text, captions, sources |
| Periwinkle Wash | `#d9e4ff` | `--color-periwinkle-wash` | **Seal surface**: protected fields, SEALED badges, highlighted chart track |
| Seal Blue | `#8fadff` | `--color-seal` | **Unfound's touch**: the light-blue data colour. Highlight series in charts, the sealed-field stripe, unit-chart fills |
| Electric Cobalt | `#004dff` | `--color-electric-cobalt` | One primary CTA per page ("Try the prototype"), focus rings. Never a chart colour |

**Rules**
- Charts use only Obsidian, Stone, Seal Blue and Slate Mist tracks. Light blue = the number we want you to remember.
- Status uses form and words, not red/green. **SEALED** = Periwinkle badge with lock glyph. **DENIED** = Obsidian badge, white text. **PENDING** = outlined Obsidian badge. **APPROVED** = Seal Blue badge.
- Electric Cobalt appears at most once per screen.

---

## Tokens — Typography

| Role | Family | Clutch original | Weights |
|------|--------|-----------------|---------|
| Display / headings / eyebrows | **Space Grotesk** (Google Fonts) | PP Radio Grotesk (commercial; Space Grotesk is the substitute named in the Clutch reference) | 400, 500, 600 |
| UI / body | **Inter** (Google Fonts) | Inter | 400, 500, 700 |
| Ciphertext and logs | `ui-monospace, SFMono-Regular, Menlo, monospace` (system, not loaded) | — | 400 |

**Signature move (kept from Clutch):** mixed-weight headlines. Key words at 600, supporting words at 400, all Obsidian. Example: "Be **reached.** Not **found.**" Never bold a whole headline.

### Type scale

| Role | Size | Line height | Tracking | Token |
|------|------|-------------|----------|-------|
| caption / eyebrow | 10–12px uppercase | 1.3 | 0.14em | `--text-caption` |
| body | 16px | 1.5 | -0.02em | `--text-body` |
| subheading | 20px | 1.4 | -0.01em | `--text-subheading` |
| heading-sm | 26px | 1.3 | -0.01em | `--text-heading-sm` |
| heading | 38px | 1.2 | -0.01em | `--text-heading` |
| heading-lg | 56px | 1.1 | -0.01em | `--text-heading-lg` |
| display | 68px (clamps to 40px on phones) | 1.1 | -0.01em | `--text-display` |
| stat number | 56px Space Grotesk 500, tabular | 1.0 | -0.02em | `--text-stat` |

---

## Spacing, shape, elevation

- Base unit 8px. Scale: 8, 16, 24, 32, 40, 48, 64, 80, 96.
- Page max-width 1200px. Section gap 80px (48px on phones). Card padding 24px. Element gap 16px.
- Radius 6px on cards, buttons, inputs, badges. The mark tile on the hero orbit is the only round element.
- Borders 1px Slate Mist or Pewter. Never 2px+.
- One shadow only: `rgba(0,0,0,0.16) 0 2px 6px` on hover of interactive cards.

---

## Components

**Nav header.** Canvas, sticky, no border until scrolled. Left: mark + `unfound` wordmark. Centre: Inter 14px links. Right: Filled Black "Open demo".

**Buttons.** Filled Black (default) · Electric Cobalt (one per page) · Outlined (1px Obsidian, with →) · Ghost (text only). Inter 14px/500, padding 10px 20px, radius 6px.

**Eyebrow pill.** Fog fill, Graphite text, Space Grotesk 11px/500 uppercase 0.14em, radius 6px, padding 4px 10px.

**Stat card (landing).** Canvas, 1px Slate Mist, 24px padding. Eyebrow with country flag code (AU / VN), stat number 56px, one-sentence claim, chart, source line in Graphite 12px.

**Sealed field (app).** Periwinkle Wash background, 3px Seal Blue left stripe, lock glyph, label "Sealed", ciphertext preview in monospace Graphite truncated with "…".

**Badge.** SEALED / DENIED / PENDING / APPROVED as defined above. 11px uppercase.

**Fabric log (app).** Fog panel, monospace 12px, one line per Tide operation: time · actor · operation · result. This is the "technical output" judges see on screen.

**Persona switcher (app).** Segmented control of avatars (initials in 28px circles, Obsidian on Canvas, selected = Obsidian fill). In live mode it becomes "Sign in as…".

**Hero visual.** The mark large in the centre, a dashed Slate Mist orbit, and service tokens (School, GP, Court mail, Police, Admin) on Canvas circles with Pewter borders. Flat 2D only.

---

## Charts

- Bars: 16px tall, Slate Mist track, Seal Blue or Obsidian fill, 4px rounded data end.
- Stacked columns: Stone (context) at the bottom, Seal Blue (what grew) on top, 2px Canvas gap between segments.
- Unit chart: 10×10 squares, Seal Blue = the share, Slate Mist = the rest.
- Values and labels are always text in Obsidian or Graphite, never in the series colour.
- Every chart has a source line.

---

## Layout

- Landing: Nav → Hero → Problem (4 stats, 2×2 grid) → Real cases → How it works (3 steps) → Who sees what → Prototype → What changes → Footer.
- Demo app: top bar (mark, mode badge, persona switcher, reset) → two columns on desktop (persona screen 2/3, Fabric log 1/3) → single column on phones with the log below.
- The survivor screen is designed phone-first (max 420px column) so it can be shown in a phone mockup. Admin, service and approver screens are desktop-first for laptop mockups.

## Do / Don't

- Do keep 80% of every screen Canvas + Obsidian.
- Do show ciphertext. It is the proof, and it looks good.
- Don't add new colours, gradients, 3D renders, photos or emoji.
- Don't use red for errors. A DENIED badge in Obsidian is louder on a white page.
- Don't centre body text. Only hero headline and short CTAs are centred.

---

## CSS custom properties

```css
:root {
  --color-obsidian: #000000;
  --color-canvas: #ffffff;
  --color-fog: #f9fafb;
  --color-slate-mist: #e5e7eb;
  --color-pewter: #dfdfdf;
  --color-stone: #c9c9c9;
  --color-graphite: #6e6e6e;
  --color-periwinkle-wash: #d9e4ff;
  --color-seal: #8fadff;
  --color-electric-cobalt: #004dff;

  --font-display: 'Space Grotesk', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-ui: 'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;

  --text-caption: 11px;
  --text-body: 16px;
  --text-subheading: 20px;
  --text-heading-sm: 26px;
  --text-heading: 38px;
  --text-heading-lg: 56px;
  --text-display: 68px;
  --text-stat: 56px;

  --radius: 6px;
  --shadow-sm: rgba(0, 0, 0, 0.16) 0px 2px 6px 0px;
  --page-max-width: 1200px;
  --section-gap: 80px;
  --card-padding: 24px;
  --element-gap: 16px;
}
```
