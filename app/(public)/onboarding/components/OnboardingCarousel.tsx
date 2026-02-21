"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";

type Slide = {
  id: number;
  imageSrc: string,
}

export default function OnboardingCarousel({
  slides,
  activeIndex,
  onIndexChange,
  requestedIndex,
  onRequestHandled,
}: {
  slides: Slide[]
  activeIndex: number
  onIndexChange: (index: number) => void
  requestedIndex: number | null
  onRequestHandled: () => void
}) {
  const scrollerRef = useRef<HTMLDivElement | null>(null) // ref vers la div qui scroll horizontalement (carousel)
  // useRef accede directement au dom sans provoquer de re render diff de usestate

  const handleScroll = () => { // quel slide est actuellement visible
    const element = scrollerRef.current
    if (!element) return

    requestAnimationFrame(() => { // permet d'att le prochain frame du navigateur
        // scrolleft = distance scrolé horizontalement offsetwidth = largeur visible (1 slide) / nombre de slide , mathround arrondi au plus proche
      const index = Math.round(element.scrollLeft / element.offsetWidth) 
      onIndexChange(index) // met a jour
    })
  }

  const goToSlide = (index: number) => { // manuellement via les dotes 
    const element = scrollerRef.current
    if (!element) return

    const left = index * element.offsetWidth
    element.scrollTo({ left, behavior: "smooth" }) // scroll fuide
  }

  // écoute les “demandes” du parent (dots desktop / next)
  useEffect(() => {
    if (requestedIndex === null) return
    goToSlide(requestedIndex)
    onRequestHandled()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedIndex])

  return (
    <div className="w-full lg:h-full lg:min-h-0 flex flex-col">
      <div className="w-full px-4 pt-2 lg:px-0 lg:pt-0 flex-1 lg:min-h-0">
        <div
          ref={scrollerRef}
          onScroll={handleScroll}
          className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar
                     h-[55vh] lg:h-full lg:min-h-0 rounded-2xl lg:rounded-none
                     overscroll-x-contain touch-pan-x"
        >
          {slides.map((slide, index) => (
            <div key={slide.id} className="relative w-full h-full shrink-0 snap-center">
              <Image
                src={slide.imageSrc}
                alt="image-onboarding"
                fill
                priority={index === 0}
                className="object-cover rounded-2xl lg:rounded-none"
              />
              <div className="absolute inset-0 bg-black/0 lg:bg-black/10" />
            </div>
          ))}
        </div>
      </div>

      {/* dots mobile */}
      <div className="lg:hidden flex justify-center gap-2 pt-4">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goToSlide(i)}
            aria-label={`Aller au slide ${i + 1}`}
            className={`btn h-2.5 w-2.5 rounded-full ${
              i === activeIndex ? "btn--primary" : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  )
}
