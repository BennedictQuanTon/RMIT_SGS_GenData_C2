import { forwardRef, type ReactNode } from "react";

// Flat device frames drawn in CSS. The screen is a normal scrollable box, so real UI runs inside.
export type DeviceKind = "macbook" | "iphone" | "ipad";

export const Device = forwardRef<HTMLDivElement, { kind: DeviceKind; children: ReactNode; className?: string }>(function Device(
  { kind, children, className },
  screenRef,
) {
  return (
    <div className={`device device-${kind} ${className ?? ""}`}>
      <div className="device-body">
        {kind === "iphone" && <span className="device-island" aria-hidden="true" />}
        {kind === "macbook" && <span className="device-cam" aria-hidden="true" />}
        <div className="device-screen" ref={screenRef}>
          {children}
        </div>
      </div>
      {kind === "macbook" && (
        <div className="device-base" aria-hidden="true">
          <span className="device-notch" />
        </div>
      )}
    </div>
  );
});
