"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Particles from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Engine } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const [isDesktop, setIsDesktop] = useState(false)
  const engineInitialized = useRef(false)

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)") 

    const update = () => {
        setIsDesktop(mq.matches)
    }
    update()

    mq.addEventListener("change", update)

    return () => {
        mq.removeEventListener("change", update)
    }
  }, [])

  // 2) Init engine une seule fois
  useEffect(() => {
    if (!isDesktop) return // on n'init pas si pas desktop

    if (engineInitialized.current) return

    engineInitialized.current = true;

    (async () => {
      // loadSlim attend un Engine
      // @tsparticles/react va l'utiliser ensuite
      const { tsParticles } = await import("@tsparticles/engine");
      const engine = tsParticles as Engine;
      await loadSlim(engine)
    })()
  }, [isDesktop])

  const options = useMemo(
    () => ({
      fullScreen: { enable: false },
      background: { color: "white" },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 200, density: { enable: true, area: 200 } },
        color: { value: "#ffffff" },
        opacity: { value: { min: 0.10, max: 0.16 } },
        size: { value: { min: 1, max: 2 } },
        move: { enable: true, speed: 0.12, outMode: "out" },
    },
      interactivity: {
        events: {
          onHover: { enable: false },
          onClick: { enable: false },
        },
      },      
    }),
    []
  );

  if (!isDesktop) return null;

  return <Particles id="synea-particles" options={options} className="absolute inset-0 pointer-events-none" />;
}
