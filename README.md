[![Built with TideCloak](https://tide.org/badges/built-with-tidecloak.svg)](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked)

## Project overview

_Unfound lets family-violence survivors use schools, clinics and courts after they move, without their new address ever being readable by any single employee, admin or operator._

Built with [TideCloak](https://tide.org/tidecloak?utm_source=github&utm_medium=readme&utm_campaign=unlocked).

### 1. Vision & originality

A safe-address layer for public services. A survivor seals her new address once, on her phone. Each service gets only the part it needs: the school sees "in zone", the GP gets a relay number. Opening the full address, even in an emergency, needs two of three independent approvers.

### 2. Trust constraint insight

After leaving, the new address is the most dangerous data a survivor owns, and every service stores it in plain text. The threat is insiders: 2,215 misuse-of-information allegations in four years across seven Queensland agencies. In 2014 an officer passed a survivor's new address to her abuser. Permissions can't help: admins are the risk. Survivors stay away: 90.4% of Vietnamese women abused by husbands never seek formal help.

### 3. Value & impact

1.5 million Australian women have experienced violence from a previous partner, and 866,700 moved out when it ended. With Unfound, Linh can enrol her son at a new school and see a GP in the same week. Agencies stop being the leak, and can prove it.

### 4. Why TideCloak matters

Addresses are encrypted in the browser with TideCloak's tag-based E2EE (`doEncrypt`/`doDecrypt`). The server holds only ciphertext. Each part is a tag gated by a `_tide_<tag>.selfdecrypt` role that Tide's network checks. Every role grant passes Quorum-Enforced Governance: a lone admin's self-grant stays pending, and committing it returns `412 QUORUM_NOT_MET`.

### 5. Prototype & storytelling

Look for: Linh seals her address and the admin table shows only ciphertext; the school confirms the zone but is denied the street; Dan grants himself access and is blocked; a police welfare check is approved 2 of 3, opens once, then is revoked; Linh's "Who looked" timeline shows it all.

---

## Demo

- Video: [`unfound-demo.mp4`](unfound-demo.mp4) (2 minutes)
- Live site (mock fabric, no server needed): add your Vercel URL here
- Landing page: `/` · Prototype: `/demo`

## Setup

Requirements: Node.js 20+. Docker only for live mode.

### Mock mode (default, runs anywhere)

```bash
npm install
npm run dev          # http://localhost:3000
```

With no `public/tidecloak.json`, the demo uses a local mock fabric. It applies the same role rules with real AES-GCM in the browser, so the flow is identical, but the keys live in your browser. This is what the static deploy runs.

### Live mode (real TideCloak)

1. Start TideCloak:
   ```bash
   docker run --name mytidecloak -d -p 8080:8080 \
     -e KC_BOOTSTRAP_ADMIN_USERNAME=admin -e KC_BOOTSTRAP_ADMIN_PASSWORD=password \
     tideorg/tidecloak-dev:latest
   ```
2. In a separate folder, run `npm init @tidecloak/nextjs@latest tide-setup` and complete the Tide enrolment link it prints. This creates the realm, license, Tide IdP, first admin and enables Quorum-Enforced Governance.
3. Copy the generated `tidecloak.json` into this repo as `public/tidecloak.json`.
4. Create the roles and users in `docs/LIVE_TIDECLOAK.md`, then run `npm run dev`. The demo detects the config and switches to **Live · TideCloak**.

### Build and deploy

```bash
npm run build        # outputs dist/
```

Vercel: import the repo, framework "Vite", no settings needed (`vercel.json` handles routes). Netlify: drag `dist/` onto app.netlify.com/drop (`public/_redirects` is included).

### Project layout

```
src/landing/      landing page and charts
src/demo/         prototype: engine (state machine), fabric (mock + live), screens per persona
src/demo/live.tsx TideCloak wiring: @tidecloak/react provider, doEncrypt/doDecrypt, AdminAPI change sets
src/motion/       intro, route curtain, smooth scroll, reveal primitives, Web Audio SFX
public/sfx/       Kenney Interface Sounds (CC0)
DESIGN.md         design system the UI follows
REPORT.md         research, numbers and sources
```

Credits: UI sounds by Kenney (Interface Sounds, CC0). Motion: [motion](https://motion.dev) and [Lenis](https://lenis.darkroom.engineering).

All people, addresses and records in this repository are synthetic.
