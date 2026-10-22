import { useMemo } from "react";
import { createAvatar } from "@dicebear/core";
import * as notionists from "@dicebear/notionists";
import type { ActorId } from "../demo/engine";

// 2D people by Zoish ("Notionists", CC0) rendered locally with DiceBear. No network, no tracking.
export type AvatarKey = ActorId | "court";

const LOOK: Record<AvatarKey, { seed: string; bg: string; glasses?: boolean }> = {
  linh: { seed: "Linh-survivor-2", bg: "e2eeff" },
  school: { seed: "Westgate-registrar", bg: "f3f4f6", glasses: true },
  gp: { seed: "Footscray-gp-7", bg: "f3f4f6" },
  dan: { seed: "Dan-it-admin-4", bg: "f3f4f6", glasses: true },
  mai: { seed: "Mai-caseworker-3", bg: "f3f4f6" },
  ruth: { seed: "Ruth-advocate-9", bg: "f3f4f6", glasses: true },
  officer: { seed: "Reyes-police-5", bg: "f3f4f6" },
  court: { seed: "Court-clerk-11", bg: "f3f4f6", glasses: true },
};

const cache = new Map<string, string>();

export function avatarUri(id: AvatarKey): string {
  const hit = cache.get(id);
  if (hit) return hit;
  const l = LOOK[id];
  const uri = createAvatar(notionists, {
    seed: l.seed,
    backgroundColor: [l.bg],
    radius: 50,
    glassesProbability: l.glasses ? 100 : 0,
    beardProbability: 0,
    gestureProbability: 0,
    bodyIconProbability: 0,
  }).toDataUri();
  cache.set(id, uri);
  return uri;
}

export function Avatar({ id, size = 32, ring = false, className }: { id: AvatarKey; size?: number; ring?: boolean; className?: string }) {
  const src = useMemo(() => avatarUri(id), [id]);
  return (
    <img
      src={src}
      width={size}
      height={size}
      alt=""
      className={`avatar-img ${ring ? "ring" : ""} ${className ?? ""}`}
      draggable={false}
    />
  );
}
