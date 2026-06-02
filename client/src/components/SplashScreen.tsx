import { useEffect } from "react";
import { useAppStore } from "../store/appStore";

// ---------------------------------------------------------------------------
// SplashScreen — My intro animation that plays when the app first loads.
// I show the Zyra logo with a soft glow, let it scale up dramatically, then
// the background expands outward like a burst to reveal the landing page.
// The whole sequence runs for ~2.8 seconds before auto-advancing.
// I keep the animation purely CSS-driven so there's zero JS overhead.
// ---------------------------------------------------------------------------

const logoUrl = new URL("../public/Zyra_logo.png", import.meta.url).href;

export function SplashScreen() {
  const setCurrentPage = useAppStore((s) => s.setCurrentPage);

  // Auto-advance to landing after the animation completes
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage("landing");
    }, 2800);
    return () => clearTimeout(timer);
  }, [setCurrentPage]);

  return (
    <div className="splash-screen">
      {/* Radial glow pulse behind the logo */}
      <div className="splash-glow" />

      {/* Logo container — scales up then bursts outward */}
      <div className="splash-logo-wrapper">
        <img src={logoUrl} alt="Zyra" className="splash-logo" />
        <span className="splash-brand-text">Zyra</span>
      </div>

      {/* Expanding ring that creates the "burst reveal" effect */}
      <div className="splash-ring" />
    </div>
  );
}
