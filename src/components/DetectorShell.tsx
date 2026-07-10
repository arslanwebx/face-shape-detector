"use client";

import dynamic from "next/dynamic";

const Detector = dynamic(() => import("./Detector"), {
  ssr: false,
  loading: () => <div className="tool-loading" aria-live="polite">Preparing the private photo tool…</div>,
});

export default function DetectorShell() {
  return <Detector />;
}
