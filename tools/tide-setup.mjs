// One-shot live setup, run after the TideCloak initializer and your Tide enrolment have finished:
//   node tools/tide-setup.mjs [path-to-generated-project] [realm]
// 1. copies the generated tidecloak.json into public/
// 2. creates the six _tide_addr* realm roles
// 3. assigns them to every user in the realm (with QEA on, approve the change set in the admin console)

import fs from "node:fs";
import path from "node:path";
import os from "node:os";

const project = process.argv[2] ?? path.join(os.homedir(), "tide-setup", "unfound-realm");
const realm = process.argv[3] ?? "nextjs-test";
const base = process.env.TIDECLOAK_URL ?? "http://localhost:8080";
const admin = { user: process.env.TC_ADMIN ?? "admin", pass: process.env.TC_PASS ?? process.env.KC_BOOTSTRAP_ADMIN_PASSWORD };
if (!admin.pass) {
  console.error("Set TC_PASS (or KC_BOOTSTRAP_ADMIN_PASSWORD) to your local TideCloak master admin password.");
  process.exit(2);
}

function find(dir, name, depth = 0) {
  if (depth > 4 || !fs.existsSync(dir)) return null;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    const p = path.join(dir, e.name);
    if (e.isFile() && e.name === name) return p;
    if (e.isDirectory()) {
      const hit = find(p, name, depth + 1);
      if (hit) return hit;
    }
  }
  return null;
}

const cfg = find(project, "tidecloak.json");
const parsed = cfg ? JSON.parse(fs.readFileSync(cfg, "utf8") || "{}") : {};
if (!cfg || !parsed.realm) {
  console.error(`No tidecloak.json under ${project}. Finish "bash init/tcinit.sh" and the Tide enrolment first.`);
  process.exit(1);
}
fs.copyFileSync(cfg, path.resolve("public/tidecloak.json"));
console.log(`✔ copied ${cfg} → public/tidecloak.json`);

const tok = await fetch(`${base}/realms/master/protocol/openid-connect/token`, {
  method: "POST",
  headers: { "Content-Type": "application/x-www-form-urlencoded" },
  body: new URLSearchParams({ grant_type: "password", client_id: "admin-cli", username: admin.user, password: admin.pass }),
}).then((r) => r.json());
if (!tok.access_token) {
  console.error("Could not sign in to the master realm:", tok);
  process.exit(1);
}
const api = (p, init = {}) =>
  fetch(`${base}/admin/realms/${realm}${p}`, { ...init, headers: { Authorization: `Bearer ${tok.access_token}`, "Content-Type": "application/json", ...(init.headers ?? {}) } });

const names = ["addrfull", "addrzone", "addrcontact"].flatMap((t) => [`_tide_${t}.selfencrypt`, `_tide_${t}.selfdecrypt`]);
for (const name of names) {
  const r = await api("/roles", { method: "POST", body: JSON.stringify({ name, description: "Unfound address tag" }) });
  console.log(`${r.status === 201 ? "✔ created" : r.status === 409 ? "• exists " : `✖ ${r.status}`} ${name}`);
}
const roles = await Promise.all(names.map((n) => api(`/roles/${encodeURIComponent(n)}`).then((r) => r.json())));
const users = await api("/users?max=50").then((r) => r.json());
for (const u of users) {
  const r = await api(`/users/${u.id}/role-mappings/realm`, { method: "POST", body: JSON.stringify(roles) });
  const note = r.status === 202 ? "change set created, approve it in the admin console (QEA)" : r.status === 204 ? "assigned" : `status ${r.status}`;
  console.log(`→ ${u.username}: ${note}`);
}
console.log("\nNext: restart `npm run dev`, sign in with Tide on /demo, then Seal my address (real doEncrypt).");
