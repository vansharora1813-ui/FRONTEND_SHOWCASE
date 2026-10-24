"use client";

import * as React from "react";
import { Pause, RotateCcw } from "lucide-react";
import { FerrisWheelGallery } from "./ferris-wheel-gallery";
import type { FerrisWheelItem } from "./ferris-wheel-gallery";

const U = (id: string) => "https://images.unsplash.com/photo-" + id + "?q=80&w=1200&auto=format&fit=crop";

export const FERRIS_WHEEL_DEMO_ITEMS: FerrisWheelItem[] = [
  { id: "geometry", title: "Soft Geometry", discipline: "Architecture", year: "2026", alt: "Angular concrete balconies seen from below", src: U("1513694203232-719a280e022f") },
  { id: "tidal", title: "Tidal Studies", discipline: "Aerial photography", year: "2026", alt: "Turquoise water beside a forested coast and winding road", src: U("1507525428034-b723cf961d3e") },
  { id: "dunes", title: "After the Dunes", discipline: "Landscape", year: "2025", alt: "Sculpted orange sand dunes with fine ripples", src: U("1509316975850-ff9c5deb0cd9") },
  { id: "arches", title: "Open Arches", discipline: "Architecture", year: "2026", alt: "A sequence of warmly lit stone arches", src: U("1513584684374-8bab748fbf90") },
  { id: "fields", title: "Contour Fields", discipline: "Landscape", year: "2025", alt: "Green terraced fields in morning mist", src: U("1506744038136-46273834b3fb") },
  { id: "water", title: "Still Water", discipline: "Landscape", year: "2026", alt: "A mountain lake below a pink evening sky", src: U("1501785888041-af3ef285b470") },
  { id: "bloom", title: "Brief Bloom", discipline: "Botanical study", year: "2025", alt: "Pink blossoms on a branch against a dark background", src: U("1518895949257-7621c3c786d7") },
  { id: "clouds", title: "Cloud Atlas", discipline: "Aerial photography", year: "2026", alt: "Sunlight breaking through deep blue clouds", src: U("1534088568595-a066f410bcda") },
];

export const DEMO_TOUR = [
  { at: 600, index: 4 },
  { at: 3900, index: 5 },
  { at: 5400, index: 3 },
];

export default function FerrisWheelGalleryDemo({ autoplay = true }: { autoplay?: boolean }) {
  const [active, setActive] = React.useState(0);
  const [playing, setPlaying] = React.useState(autoplay);
  const [run, setRun] = React.useState(0);
  const [reducedMotion, setReducedMotion] = React.useState(true);
  const [photosReady, setPhotosReady] = React.useState(false);

  React.useLayoutEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);

  React.useEffect(() => {
    let cancelled = false;
    const arrive = (src: string) => new Promise((resolve) => {
      const image = new Image();
      image.onload = image.onerror = () => resolve(src);
      image.src = src;
    });
    const limit = new Promise((resolve) => window.setTimeout(resolve, 1500));
    Promise.race([Promise.all(FERRIS_WHEEL_DEMO_ITEMS.map((item) => arrive(item.src))), limit]).then(() => { if (!cancelled) setPhotosReady(true); });
    return () => { cancelled = true; };
  }, []);

  React.useLayoutEffect(() => {
    if (!playing || reducedMotion || !autoplay || !photosReady) return;
    const timers = DEMO_TOUR.map(({ at, index }) => window.setTimeout(() => setActive(index), at));
    timers.push(window.setTimeout(() => setPlaying(false), 7200));
    return () => timers.forEach(window.clearTimeout);
  }, [playing, run, reducedMotion, autoplay, photosReady]);

  const stop = (target: EventTarget) => {
    if (!(target instanceof Element) || !target.closest("[data-demo-control]")) setPlaying(false);
  };

  return (
    <div data-ferris-demo data-tour={!autoplay || reducedMotion ? "off" : !playing ? "stopped" : photosReady ? "playing" : "loading"} className="flex min-h-screen w-full items-center justify-center bg-background px-5 py-4 text-foreground" onPointerDownCapture={(event) => stop(event.target)} onWheelCapture={(event) => stop(event.target)} onKeyDownCapture={(event) => stop(event.target)} onFocusCapture={(event) => stop(event.target)}>
      <div className="w-full max-w-[720px]">
        <header className="mb-3 flex items-end justify-between gap-4 border-b border-border pb-3">
          <div><p className="mb-1.5 text-[10px] font-medium uppercase tracking-[0.24em] text-muted-foreground">A collection in motion</p><h1 className="text-2xl font-medium tracking-tight">Round &amp; round.</h1></div>
          <span className="mb-0.5 rounded-full border border-border px-2.5 py-1 text-[10px] tracking-wide text-muted-foreground">Sample collection</span>
        </header>
        <FerrisWheelGallery key={run} items={FERRIS_WHEEL_DEMO_ITEMS} active={active} onActiveChange={(index: number) => { setPlaying(false); setActive(index); }} />
        <footer className="mt-2 flex min-h-8 items-center justify-between gap-3 text-[10px] text-muted-foreground">
          <span>Eight studies. A different point of view.</span>
          {autoplay && !reducedMotion && <button data-demo-control type="button" onClick={() => { if (playing) setPlaying(false); else { setActive(0); setRun((value) => value + 1); setPlaying(true); } }} className="flex min-h-8 items-center gap-1.5 rounded-md px-1 outline-none hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring">{playing ? <Pause aria-hidden="true" className="size-3" /> : <RotateCcw aria-hidden="true" className="size-3" />}{playing ? "Pause demo" : "Replay demo"}</button>}
        </footer>
      </div>
    </div>
  );
}
