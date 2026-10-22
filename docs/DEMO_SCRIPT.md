# Demo script and video storyboard (2:00)

**Fastest way to record:** open `/demo?story=1` (or press **Play the story** in the demo top bar). The app runs all eight scenes by itself in about 70 seconds: it switches persona and device (iPhone, MacBook, iPad), zooms onto each key feature, pops a callout with sound, and clicks the real buttons. Record the screen with sound on. The landing page's "How it works" section plays the same story inside a MacBook.

Record at 1440×900 for desktop screens and 390×844 for Linh (phone). Press **Reset demo** before each take.

## Click path

| # | Persona | Action | What the screen shows | Fabric log |
|---|---------|--------|-----------------------|------------|
| 1 | Linh | Seal my address | Three sealed fields with ciphertext | `doEncrypt … 3 ciphertexts stored, 0 plaintext` OK |
| 2 | Westgate | Check zone, then Try to open | "Footscray North catchment ✓", then DENIED | `doDecrypt addrzone` OK · `doDecrypt addrfull` DENIED |
| 3 | Dan | Database: Legacy system, then Unfound | Plaintext addresses, then ciphertext | — |
| 4 | Dan | Open Linh's full address | DENIED | `doDecrypt addrfull` DENIED |
| 5 | Dan | Roles: Assign role → Authorize → Commit | Black "Blocked by quorum" notice | `assignRole` PENDING · `authorize 1/2` · `commit 412 QUORUM_NOT_MET` |
| 6 | Const. Reyes | Request break-glass | CR-002 PENDING 0/2 | `assignRole` PENDING |
| 7 | Mai | Deny CR-001, Approve CR-002 | Inbox, self-grant warning | `deny` · `authorize 1/2` |
| 8 | Ruth | Deny CR-001, Approve CR-002 | CR-001 DENIED, CR-002 APPROVED | `commit … quorum met, signed by threshold` |
| 9 | Const. Reyes | Open address (one time) | Address shown once, "now revoked" | `doDecrypt` OK · `revoke … removed after one use` |
| 10 | Linh | Who looked | Every attempt, approval and denial | — |

## Storyboard (Tide's four parts)

| Time | Part | Picture | Voice-over / on-screen text |
|------|------|---------|-----------------------------|
| 0:00–0:15 | The possibility | White screen, black type line by line, then the mark | "She moved. New school. New doctor. New address." → "Be reached, not found." |
| 0:15–0:40 | The constraint | The four stat cards from the landing page, 5 s each, then the 2014 case | "1.5 million women. 64% moved. 2,215 insider misuse allegations. 90.4% never asked for help." "One lookup. One friend in the system." |
| 0:40–1:35 | The prototype | Click path 1–10, phone mockup for Linh, laptop mockup for the rest. Hold on the 412 notice and the break-glass approval | "TideCloak seals the address in the browser. No one holds the key. Not the school, not the admin, not us." |
| 1:35–2:00 | What changes | Landing "What changes" section, then end card: mark, "Built with TideCloak", team name | "Survivors stop choosing between help and hiding. Services stop being the leak." |

Keep the final `public/video/unfound.mp4` under 100 MB (1080p, H.264, ~6 Mbps is about 90 MB for 2 minutes).
