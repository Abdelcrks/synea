"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import OnboardingCarousel from "./components/OnboardingCarousel";
import OnboardingPanel from "./components/OnboardingPanel";

type Slide = {
  id: number;
  badge: string,
  title: string,
  description: string;
  imageSrc: string,
};

export default function Onboarding() {
  const router = useRouter()
  const [activeIndex, setActiveIndex] = useState(0)
  const [requestedIndex, setRequestedIndex] = useState<number | null>(null) // si null aucune commande si 2 scrolle jusqu'au slide 3 (carrosel)

  const slides: Slide[] = useMemo(
    () => [
      {
        id: 1,
        badge: "Bienvenue sur SYNEA",
        title: "Parfois, le chemin est difficile. Mais personne ne devrait avancer seul.",
        description:
          "SYNEA est un espace d'entraide entre personnes qui vivent l'épreuve et celles qui l'ont déjà traversée",
        imageSrc: "/onboarding/onboarding-1.png",
      },
      {
        id: 2,
        badge: "Une communauté humaine",
        title: "Tu n'es plus seul. Ici des héros comme toi, comprennent vraiment",
        description:
          "Échange avec des personnes passées par là. Parle librement, sans te justifier. Trouve un soutien humain et bienveillant.",
        imageSrc: "/onboarding/onboarding-2.png",
      },
      {
        id: 3,
        badge: "Choix du profil",
        title: "Choisis ton rôle sur SYNEA.",
        description:
          "Héros : tu traverses l'épreuve. Pair-Héros: tu l'as déjà traversée. Tu pourras faire évoluer ton rôle à tout moment.",
        imageSrc: "/onboarding/onboarding-3.png",
      },
    ],
    []
  );

  const currentSlide = slides[activeIndex] ?? slides[0]
  const isLastSlide = activeIndex === slides.length - 1

  // const goToLastSlide = () => {
  //   requestGoToSlide(slides.length -1)
  // }

  const goToSignUp = () => {
    router.push("/auth/sign-up")
  }
  
  const goToSignUpWithRole = (role:"hero"| "peer_hero") => {
    router.push(`/auth/sign-up?role=${role}`)
  }

  //  le parent demande au carousel de scroller
  const requestGoToSlide = (index: number) => {
    setRequestedIndex(index)
  }

  const handleNext = () => {
    if (isLastSlide)
        return
    requestGoToSlide(activeIndex + 1)
  }
  return (
    <main className="min-h-dvh w-full relative flex flex-col pb-[env(safe-area-inset-bottom)]">

      {/* Header mobile only */}
      <header className="w-full px-4 pt-2 flex items-center justify-between lg:hidden">
        <img
          src="/onboarding/logo-synea.svg"
          alt="SYNEA"
          width={50}
          height={50}
          className="select-none"
        />
        <button
          type="button"
          onClick={goToSignUp}
          className="text-sm font-sans text-black/70 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 rounded-full px-3"
          aria-label="Passer l'onboarding"
        >
          Passer
        </button>
      </header>

      <div className="relative z-10 flex-1 w-full flex flex-col lg:grid lg:grid-cols-2 lg:min-h-0">
        <OnboardingCarousel
          slides={slides}
          activeIndex={activeIndex}
          onIndexChange={setActiveIndex}
          requestedIndex={requestedIndex}
          onRequestHandled={() => setRequestedIndex(null)}
        />

        <OnboardingPanel
          currentSlide={currentSlide}
          slidesLength={slides.length}
          activeIndex={activeIndex}
          onNext={handleNext}
          onSkip={goToSignUp}
          onChooseRole={goToSignUpWithRole}
        />
      </div>

      {/* dots desktop */}
      <div className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 gap-2">
        {slides.map((rien, i) => (
          <button
            key={i}
            onClick={() => requestGoToSlide(i)}
            className={`h-2.5 w-2.5 rounded-full ${
              i === activeIndex ? "btn-primary" : "bg-white"
            }`}
            aria-label={`Aller au slide ${i + 1}`}
          />
        ))}
      </div>
    </main>
  )
}
