import { Link } from "react-router-dom";

// "The pin with no point": a map-pin head drawn as an open arch with a dot inside.
export function Mark({ size = 28, color = "currentColor", title }: { size?: number; color?: string; title?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" role={title ? "img" : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <path d="M16 60V28a16 16 0 0 1 32 0v32" fill="none" stroke={color} strokeWidth="9" />
      <circle cx="32" cy="28" r="5.5" fill={color} />
    </svg>
  );
}

export function Brand({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="brand" aria-label="Unfound home">
      <Mark size={26} />
      <span className="brand-word">unfound</span>
    </Link>
  );
}
