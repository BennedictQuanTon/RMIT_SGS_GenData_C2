// A Fabric performs the Tide operations the app needs: tag-based encrypt and decrypt.
// - live: TideCloak's doEncrypt/doDecrypt. Keys live in Tide's ORK network; the browser and our
//   server never hold them, and the network checks _tide_<tag>.selfdecrypt on the user's token.
// - mock: a local stand-in for offline demos and static deploys. It applies the same role rule
//   with real AES-GCM, but the keys sit in this browser, so it proves the UX, not the security.

import type { ActorId, Tag } from "./engine";
import { role } from "./engine";

export interface EncryptItem { data: string; tags: Tag[] }
export interface DecryptItem { encrypted: string; tags: Tag[] }

export interface Fabric {
  mode: "mock" | "live";
  encrypt(as: ActorId, roles: string[], items: EncryptItem[]): Promise<string[]>;
  decrypt(as: ActorId, roles: string[], items: DecryptItem[]): Promise<string[]>;
}

export class DeniedError extends Error {
  constructor(public missing: string, message?: string) {
    super(message ?? `missing role ${missing}`);
  }
}

const KEY_STORE = "unfound-mock-fabric-keys";
const keyCache = new Map<Tag, CryptoKey>();

function loadJwks(): Record<string, JsonWebKey> {
  try {
    return JSON.parse(localStorage.getItem(KEY_STORE) ?? "{}");
  } catch {
    return {};
  }
}

async function keyFor(tag: Tag): Promise<CryptoKey> {
  const hit = keyCache.get(tag);
  if (hit) return hit;
  const jwks = loadJwks();
  let key: CryptoKey;
  if (jwks[tag]) {
    key = await crypto.subtle.importKey("jwk", jwks[tag], "AES-GCM", true, ["encrypt", "decrypt"]);
  } else {
    key = await crypto.subtle.generateKey({ name: "AES-GCM", length: 256 }, true, ["encrypt", "decrypt"]);
    jwks[tag] = await crypto.subtle.exportKey("jwk", key);
    try {
      localStorage.setItem(KEY_STORE, JSON.stringify(jwks));
    } catch {
      /* private mode: keys stay in memory for this tab */
    }
  }
  keyCache.set(tag, key);
  return key;
}

const toB64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));
const fromB64 = (s: string) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

function requireRoles(roles: string[], tags: Tag[], op: "selfencrypt" | "selfdecrypt") {
  for (const t of tags) {
    const r = role(t, op);
    if (!roles.includes(r)) throw new DeniedError(r);
  }
}

export const mockFabric: Fabric = {
  mode: "mock",
  async encrypt(_as, roles, items) {
    return Promise.all(
      items.map(async ({ data, tags }) => {
        requireRoles(roles, tags, "selfencrypt");
        const iv = crypto.getRandomValues(new Uint8Array(12));
        const ct = new Uint8Array(
          await crypto.subtle.encrypt({ name: "AES-GCM", iv }, await keyFor(tags[0]), new TextEncoder().encode(data)),
        );
        const out = new Uint8Array(iv.length + ct.length);
        out.set(iv);
        out.set(ct, iv.length);
        return toB64(out);
      }),
    );
  },
  async decrypt(_as, roles, items) {
    return Promise.all(
      items.map(async ({ encrypted, tags }) => {
        requireRoles(roles, tags, "selfdecrypt");
        const raw = fromB64(encrypted);
        const pt = await crypto.subtle.decrypt({ name: "AES-GCM", iv: raw.slice(0, 12) }, await keyFor(tags[0]), raw.slice(12));
        return new TextDecoder().decode(pt);
      }),
    );
  },
};

export function resetMockKeys() {
  keyCache.clear();
  try {
    localStorage.removeItem(KEY_STORE);
  } catch {
    /* ignore */
  }
}
