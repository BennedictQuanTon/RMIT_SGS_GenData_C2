// Demo engine: synthetic data, the change-request state machine (mirrors TideCloak QEA),
// and the event log. Encryption itself goes through a Fabric (mock or live TideCloak).

export type Tag = "addrfull" | "addrzone" | "addrcontact";
export type ActorId = "linh" | "school" | "gp" | "dan" | "mai" | "ruth" | "officer";
export type ActorKind = "survivor" | "service" | "admin" | "approver" | "police";

export interface Actor {
  id: ActorId;
  name: string;
  title: string;
  initials: string;
  kind: ActorKind;
  realmAdmin: boolean; // holds tide-realm-admin, so counts towards the quorum
}

export const ACTORS: Actor[] = [
  { id: "linh", name: "Linh N.", title: "Survivor", initials: "LN", kind: "survivor", realmAdmin: false },
  { id: "school", name: "Westgate Primary", title: "School registrar", initials: "WP", kind: "service", realmAdmin: false },
  { id: "gp", name: "Footscray Family GP", title: "Clinic reception", initials: "GP", kind: "service", realmAdmin: false },
  { id: "dan", name: "Dan K.", title: "Agency IT admin", initials: "DK", kind: "admin", realmAdmin: true },
  { id: "mai", name: "Mai T.", title: "Caseworker lead", initials: "MT", kind: "approver", realmAdmin: true },
  { id: "ruth", name: "Ruth A.", title: "Independent advocate", initials: "RA", kind: "approver", realmAdmin: true },
  { id: "officer", name: "Const. Reyes", title: "Police, welfare checks", initials: "CR", kind: "police", realmAdmin: false },
];

export const actor = (id: ActorId): Actor => ACTORS.find((a) => a.id === id)!;

export const TAGS: Record<Tag, { label: string; plain: string }> = {
  addrfull: { label: "Full address", plain: "Street, unit and postcode" },
  addrzone: { label: "School zone", plain: "Catchment only" },
  addrcontact: { label: "Contact relay", plain: "Suburb and relay number" },
};

export const role = (tag: Tag, op: "selfencrypt" | "selfdecrypt") => `_tide_${tag}.${op}`;

// TideCloak QEA threshold: max(1, floor(0.7 × N)) where N = number of tide-realm-admin holders.
export const REALM_ADMINS = ACTORS.filter((a) => a.realmAdmin).map((a) => a.id);
export const THRESHOLD = Math.max(1, Math.floor(0.7 * REALM_ADMINS.length));

export interface Sealed {
  tag: Tag;
  ct: string;
}

export interface SurvivorRecord {
  id: string;
  alias: string;
  enrolment: string;
  sealed: Partial<Record<Tag, Sealed>>;
  // Only used by the "legacy system" comparison view. Never read by the Unfound path.
  legacyPlain: Record<Tag, string>;
}

export type CRStatus = "PENDING" | "APPROVED" | "DENIED" | "USED";

export interface ChangeRequest {
  id: string;
  action: "GRANT" | "REVOKE";
  target: ActorId;
  role: string;
  subject?: string; // survivor record the request is about
  requestedBy: ActorId;
  reason: string;
  approvals: ActorId[];
  denials: ActorId[];
  status: CRStatus;
  oneTime: boolean;
  createdAt: number;
}

export type Result = "ok" | "denied" | "pending";

export interface LogEvent {
  id: number;
  at: number;
  actor: ActorId;
  op: string;
  detail: string;
  result: Result;
  subject?: string;
}

export interface DemoState {
  records: SurvivorRecord[];
  roles: Record<ActorId, string[]>;
  requests: ChangeRequest[];
  log: LogEvent[];
  seq: number;
}

export const LINH_ID = "sv-001";

// The landing page embeds the demo in an iframe (?embed). It keeps its own storage so it never
// disturbs a demo the viewer is running in another tab.
export const EMBED = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("embed");
// ?clean hides the chrome around the device (used to record footage for the film).
export const CLEAN = typeof window !== "undefined" && new URLSearchParams(window.location.search).has("clean");
export const storageKey = (base: string) => (EMBED ? `${base}-embed` : base);

// Synthetic people and places. Any resemblance to real addresses is accidental.
export const SEED_RECORDS: Omit<SurvivorRecord, "sealed">[] = [
  {
    id: LINH_ID,
    alias: "Linh N.",
    enrolment: "Year 3 enrolment · child: An N.",
    legacyPlain: {
      addrfull: "Unit 4, 18 Moreland St, Footscray VIC 3011",
      addrzone: "Footscray North catchment",
      addrcontact: "Footscray · relay 0400 000 117",
    },
  },
  {
    id: "sv-002",
    alias: "Priya S.",
    enrolment: "Prep enrolment · child: Dev S.",
    legacyPlain: {
      addrfull: "7 Clarke Ct, Braybrook VIC 3019",
      addrzone: "Braybrook catchment",
      addrcontact: "Braybrook · relay 0400 000 204",
    },
  },
  {
    id: "sv-003",
    alias: "Hannah W.",
    enrolment: "Year 5 transfer · child: Mia W.",
    legacyPlain: {
      addrfull: "22/140 Ballarat Rd, Maidstone VIC 3012",
      addrzone: "Maidstone catchment",
      addrcontact: "Maidstone · relay 0400 000 318",
    },
  },
  {
    id: "sv-004",
    alias: "Thu H.",
    enrolment: "Year 1 enrolment · child: Bao H.",
    legacyPlain: {
      addrfull: "3 Errol St, Seddon VIC 3011",
      addrzone: "Seddon catchment",
      addrcontact: "Seddon · relay 0400 000 422",
    },
  },
];

export const LINH_NEW_ADDRESS = SEED_RECORDS[0].legacyPlain;

// Roles already approved by the quorum during onboarding.
export function seedRoles(): Record<ActorId, string[]> {
  const all: Tag[] = ["addrfull", "addrzone", "addrcontact"];
  return {
    linh: all.flatMap((t) => [role(t, "selfencrypt"), role(t, "selfdecrypt")]),
    school: [role("addrzone", "selfdecrypt")],
    gp: [role("addrcontact", "selfdecrypt")],
    dan: ["tide-realm-admin"],
    mai: ["tide-realm-admin", ...all.map((t) => role(t, "selfencrypt"))],
    ruth: ["tide-realm-admin"],
    officer: [],
  };
}

export function emptyState(): DemoState {
  return {
    records: SEED_RECORDS.map((r) => ({ ...r, sealed: {} })),
    roles: seedRoles(),
    requests: [],
    log: [],
    seq: 1,
  };
}

export function decide(cr: ChangeRequest): CRStatus {
  if (cr.status !== "PENDING") return cr.status;
  if (cr.approvals.length >= THRESHOLD) return "APPROVED";
  if (REALM_ADMINS.length - cr.denials.length < THRESHOLD) return "DENIED";
  return "PENDING";
}

export const fmtTime = (t: number) =>
  new Date(t).toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });

export const shortCt = (ct: string, n = 28) => (ct.length > n ? ct.slice(0, n) + "…" : ct);
