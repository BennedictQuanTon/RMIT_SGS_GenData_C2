# How we used Tide's MCP

Unfound was built with Claude Code connected to **Tide's MCP server** (`https://mcp.tide.org/mcp`, Tide Agent Pack v1.9.33). The server is declared for the project in [`.mcp.json`](../.mcp.json), so anyone who opens this repo in Claude Code gets the same tools. `scripts/setup-local.sh` also registers it.

```bash
claude mcp add --transport http tide https://mcp.tide.org/mcp    # what .mcp.json declares
```

## What the MCP decided or checked

| Tool | What it told us | What we did |
|---|---|---|
| `tide_hosting` | A realm in local Docker only serves that machine; a public URL needs hosted TideCloak (Skycloak). The choice must be made before bootstrap; a realm cannot be moved. It also requires the user to give the licence email and accept Tide's Terms themselves. | Chose local Docker for the hackathon. Our setup script refuses to run without `TIDE_LICENSE_EMAIL` and `TIDE_TERMS_ACCEPTED=yes`, never hardcodes the admin password, and documents the hosted path in the README. |
| `tide_doctor` | Checks the app for the faults behind broken Tide logins. First run: DPoP relay page missing, `useDPoP` not set, adapter not yet exported. | Copied `tide_dpop_auth.html` byte-exact into `public/`, set `useDPoP: { mode: "auto", alg: "ES256" }` in the provider config (`src/demo/live.tsx`). Re-run: both now **PASS**. |
| `tide_doctor` (adapter) | `tidecloak.json` has no `jwk` / `vendorId` / `realm`: the realm has no enrolled admin yet. | Blocked by Tide's network on 22 Oct 2026 (see below). Everything else passes. |

Latest doctor run (`bash .tide-pack/templates/shared/tide-doctor.sh --app . --check`):

```
DPoP — client
  PASS  useDPoP is set in the provider config
DPoP — relay page
  PASS  public/tide_dpop_auth.html is the known-good page
Secrets
  PASS  no master-admin password written into a script or config
Adapter
  FAIL  adapter has no "jwk" (and vendorId, realm, resource): realm not enrolled yet
```

## The Tide pieces in the code

| Where | Tide feature |
|---|---|
| `src/demo/live.tsx` | `@tidecloak/react` provider with DPoP, Tide sign-in (BYOiD), `doEncrypt` / `doDecrypt` per tag, `AdminAPI.addUserRoles` → change set, `getPendingChangeSets`, `commitChangeSet` (expect `412 QUORUM_NOT_MET` alone) |
| `src/demo/engine.ts` | Roles `_tide_<tag>.selfencrypt/.selfdecrypt` for `addrfull`, `addrzone`, `addrcontact`; quorum threshold `max(1, floor(0.7 × N))` |
| `src/demo/fabric.ts` | The `Fabric` interface both modes implement; the mock applies the same role rule |
| `tools/tide-setup.mjs` | Copies the exported adapter into the app, creates the six `_tide_addr*` roles, assigns them (a governed change set under QEA) |
| `scripts/setup-local.sh` | TideCloak in Docker, licensed realm via Tide's realm kit, enrolment, wiring, app start |

## Live run, 22 Oct 2026

The realm `unfound1` was provisioned and licensed (`Finalized wallet for realm unfound1`), with Quorum-Enforced Governance enabled. Creating the first Tide account then failed in Tide's enclave on every attempt: *"Could not reach enough NEW ORKs (got 3 of 20 required, 17 of 20 failed)"* and *"(got 7 of 20 required, 13 of 20 failed)"*; earlier licence attempts had returned *"Midgard.FinalizeWallet: Not enough orks returned an ok response"*. Screenshots: [`assets/tide-enrol-error-1.png`](assets/tide-enrol-error-1.png), [`assets/tide-enrol-error-2.png`](assets/tide-enrol-error-2.png).
