// Motion tokens. Mirrors the Motion section of DESIGN.md.
// Strong ease-out for anything the user triggers (instant feedback, soft landing);
// ease-in-out only for things that move across the screen on their own (curtains, wipes).

export const ease = {
  out: [0.23, 1, 0.32, 1] as const,
  outExpo: [0.16, 1, 0.3, 1] as const,
  inOut: [0.77, 0, 0.175, 1] as const,
};

export const dur = {
  press: 0.12, // button press
  ui: 0.22, // tabs, badges, persona switch
  reveal: 0.8, // scroll reveals
  curtain: 0.55, // page transition
};

export const spring = { type: "spring", stiffness: 520, damping: 42, mass: 0.8 } as const;
