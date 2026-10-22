import type { ActorId } from "./engine";

// The guided demo: an end-to-end run through the real screens. Each op targets a
// data-demo="…" element inside the device, so the story clicks the same buttons a person would.

export interface Callout {
  title: string;
  body: string;
}

export type Op =
  | { do: "click"; target: string }
  | { do: "focus"; target: string; callout: Callout; hold?: number; zoom?: number }
  | { do: "wait"; ms: number };

export interface Scene {
  who: ActorId;
  chapter: number;
  caption: string;
  ops: Op[];
}

export const CHAPTERS = ["Seal once", "Share the minimum", "No one alone", "Emergencies, with witnesses"];

export const STORY: Scene[] = [
  {
    who: "linh",
    chapter: 0,
    caption: "Linh has just moved. She types her new address once, on her phone.",
    ops: [
      { do: "focus", target: "seal", callout: { title: "Sealed on the phone", body: "TideCloak encrypts the address in the browser, before it goes anywhere." }, hold: 2200 },
      { do: "click", target: "seal" },
      { do: "focus", target: "field-addrfull", callout: { title: "Ciphertext only", body: "This is all the server stores. There is no key on it to steal." }, zoom: 1.25 },
    ],
  },
  {
    who: "school",
    chapter: 1,
    caption: "Her son's new school needs to know one thing: is the family in the zone?",
    ops: [
      { do: "click", target: "check-0" },
      { do: "focus", target: "zone-0", callout: { title: "One fact, not the street", body: "The school's role opens the zone tag only." } },
      { do: "click", target: "open-0" },
      { do: "focus", target: "denied-0", callout: { title: "Denied by Tide", body: "No _tide_addrfull.selfdecrypt role, so the network refuses to decrypt." } },
    ],
  },
  {
    who: "dan",
    chapter: 2,
    caption: "Dan runs the agency's systems. He is also a friend of Linh's ex-partner.",
    ops: [
      { do: "click", target: "legacy" },
      { do: "focus", target: "db-table", callout: { title: "Today", body: "Any admin can read every survivor's address." }, zoom: 1.12 },
      { do: "click", target: "unfound" },
      { do: "focus", target: "db-table", callout: { title: "With Unfound", body: "Same admin, same database. Ciphertext, and no key." }, zoom: 1.12 },
      { do: "click", target: "tab-roles" },
      { do: "click", target: "assign" },
      { do: "focus", target: "cr-dan", callout: { title: "A request, not a change", body: "His self-grant becomes a change set that needs 2 of 3 admins." } },
      { do: "click", target: "authorize" },
      { do: "click", target: "commit" },
      { do: "focus", target: "blocked", callout: { title: "412 QUORUM_NOT_MET", body: "One admin is not enough. Cryptography says no, not an if-statement." } },
    ],
  },
  {
    who: "officer",
    chapter: 3,
    caption: "Three days later the school reports An absent. Police need to check on the family.",
    ops: [
      { do: "click", target: "breakglass" },
      { do: "focus", target: "cr-officer", callout: { title: "Break-glass", body: "Emergencies still work. They just need two independent witnesses." } },
    ],
  },
  {
    who: "mai",
    chapter: 3,
    caption: "Mai, the caseworker lead, reviews both requests.",
    ops: [
      { do: "click", target: "deny-CR-001" },
      { do: "click", target: "approve-CR-002" },
      { do: "focus", target: "card-CR-002", callout: { title: "1 of 2", body: "Mai denies Dan's self-grant and approves the welfare check." } },
    ],
  },
  {
    who: "ruth",
    chapter: 3,
    caption: "Ruth, an independent advocate, is the second approver.",
    ops: [
      { do: "click", target: "deny-CR-001" },
      { do: "click", target: "approve-CR-002" },
      { do: "focus", target: "closed", callout: { title: "Quorum met", body: "Two of three signed. The change is applied by threshold signature." } },
    ],
  },
  {
    who: "officer",
    chapter: 3,
    caption: "The officer can now open the address. Once.",
    ops: [
      { do: "click", target: "open-once" },
      { do: "focus", target: "revealed", callout: { title: "One view, then gone", body: "The role is removed the moment it has been used." } },
    ],
  },
  {
    who: "linh",
    chapter: 0,
    caption: "Linh can see everything that happened around her address.",
    ops: [
      { do: "click", target: "tab-looked" },
      { do: "focus", target: "timeline", callout: { title: "Who looked", body: "Every attempt, approval and refusal, including Dan's." }, hold: 3000, zoom: 1.08 },
    ],
  },
];
