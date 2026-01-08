"use client"


import Image from "next/image"
import { useRouter } from "next/navigation"
import {useState, useRef} from "react"




export default function Onboarding () {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const router = useRouter()
  const slides = [ 
    {
      id: 1, 
      badge: "Bienvenue sur SYNEA",
      title: "Parfois, le chemin est difficile. Mais personne ne devrait avancer seul.",
      description: "SYNEA est un espace d'entraide entre personnes qui ont traversé l'épreuve et celles qui peuvent vraiment comprendre",
      imageSrc: "/onboarding/onboarding-v-1.png",
    },
    {
      id: 2, 
      badge: "Une communauté humaine",
      title: "Tu n'es plus seul, des héros comme toi, comprennent vraiment",
      description: "Échange avec des pairs, partage ton histoire, trouve un soutien humain et bienveillant.",
      imageSrc: "/onboarding/onboarding-v-2.png",
    },
    {
      id: 3, 
      badge: "Choix du profil",
      title: "Choisis ton rôle sur SYNEA.",
      description: "Héros (je travèrse l'épreuve) ou Pair-Héros (j'ai déjà traversé, j'accompagne). Tu pourras toujours évoluer ensuite.",
      imageSrc: "/onboarding/onboarding-v-3.png",
    },
  ]

    const handleScroll = () => {
      const element = scrollerRef.current
      if(!element) return

      requestAnimationFrame(() => {
        const width = element.offsetWidth
        const index = Math.round(element.scrollLeft/ width)
        setActiveIndex(index)
      })
    }

    const goToSlide = (indexSlide:any) => {
      const element = scrollerRef.current
      if(!element) return

      const left = indexSlide * element.offsetWidth // 0 * 400 = slide 1 1*400 = slide 2, 2*400 = slide 3 num  de slide === position scroll

      element.scrollTo({left, behavior: "smooth"}) // scroll horizontal fluide 
    }

    const goToChoicesRoles = () => {
      router.push("/onboarding/roles")
    }

    const currentSlide = slides[activeIndex] ?? slides[0]

    return (
      <main className="h-screen w-screen relative flex flex-col bg-linear-to-b from-white to-[#e2d3e6]"> {/*Cadre de la page */}
      <header className="w-full px-4 pt-2 flex items-center justify-between lg:hidden">
        <div className="flex items-center gap-2">
          <Image
            src="/onboarding/logo-synea.svg"
            alt="SYNEA"
            width={50}
            height={50}
            priority
            className="select-none"
          />
        </div>

        <button
          type="button"
          onClick={goToChoicesRoles}
          className="text-sm font-semibold text-black/70 hover:text-black focus:outline-none focus:ring-2 focus:ring-black/20 rounded-full px-3"
          aria-label="Passer l'onboarding"
        >
          Passer
        </button>
      </header>
        {/* wrapper mobile et lg ordi*/}
        <div className="relative z-10 flex-1 w-full flex flex-col lg:grid lg:grid-cols-2 lg:min-h-0">
          {/* conteneur image*/}
          <div className="w-full lg:h-full lg:min-h-0 flex flex-col">

            
            {/* marge + radius mobile seulement */}
            <div className="w-full px-4 pt-2 lg:px-0 lg:pt-0 flex-1 lg:min-h-0">

              <div
                ref={scrollerRef}
                onScroll={handleScroll}
                className="flex w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar
                        h-[55vh] lg:h-full lg:min-h-0 rounded-2xl lg:rounded-none"
              >
                {slides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className="relative w-full h-full shrink-0 snap-center"
                  >
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
            {/* dots version mobilee */}
            <div className="lg:hidden flex justify-center gap-2 pt-4">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToSlide(i)}
                  aria-label={`Aller au slide ${i + 1}`}
                  className={`h-2.5 w-2.5 rounded-full ${
                    i === activeIndex ? "bg-black/80" : "bg-black/20"
                  }`}
                />
              ))}
            </div>
          </div>
          {/* ===== texte fixe / cta fixe*/}
          <div className="flex-1 px-6 pb-8 lg:px-12 lg:relative">

          {/* ===== HEADER DESKTOP (à droite de l’image) ===== */}
          <div className="hidden lg:flex items-center justify-between pt-6">
            <Image
              src="/onboarding/logo-synea.svg"
              alt="SYNEA"
              width={44}
              height={44}
              priority
              className="select-none"
            />
            <button
              type="button"
              onClick={goToChoicesRoles}
              className="text-sm font-semibold text-white/80 hover:text-white
                        focus:outline-none focus:ring-2 focus:ring-white/30
                        rounded-full px-3 py-2"
              aria-label="Passer l'onboarding"
            >
              Passer
            </button>
          </div>

          {/* ===== CONTENU DESKTOP (carte centrée) ===== */}
          <div className="hidden lg:flex h-full items-center justify-center">
            <div className="w-full max-w-xl rounded-3xl bg-black/40 p-10 backdrop-blur ring-1 ring-white/10">
              <h1 className="mt-4 whitespace-pre-line text-4xl font-semibold leading-tight text-white">
                {currentSlide.title}
              </h1>

              <p className="mt-4 text-base leading-relaxed text-white/85">
                {currentSlide.description}
              </p>

              <button
                onClick={
                  activeIndex === slides.length - 1
                    ? goToChoicesRoles
                    : () => goToSlide(activeIndex + 1)
                }
                className="mt-8 w-full rounded-full bg-white px-6 py-3
                          text-sm font-semibold text-slate-900 cursor-pointer"
              >
                {activeIndex === slides.length - 1 ? "Choisir mon rôle" : "Continuer"}
              </button>
            </div>
          </div>

        {/* ===== CONTENU MOBILE (inchangé) ===== */}
        <div key={currentSlide.id} className="lg:hidden transition-all duration-300 ease-out">
          <h1 className="mt-2 text-2xl font-semibold text-center leading-tight text-black">
            {currentSlide.title}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-center text-black/80">
            {currentSlide.description}
          </p>

          <div className="mt-3">
            <button
              className="w-full rounded-full bg-white px-6 py-4 text-sm font-semibold text-black hover:bg-white/90"
              onClick={
                activeIndex === slides.length - 1
                  ? goToChoicesRoles
                  : () => goToSlide(activeIndex + 1)
              }
            >
              {activeIndex === slides.length - 1 ? "Choisir mon rôle" : "Continuer"}
            </button>
          </div>
        </div>
        </div>
        </div>
        {/* dots version ordi */}
        <div className="hidden lg:flex absolute bottom-10 left-1/2 -translate-x-1/2 z-20 gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goToSlide(i)}
              className={`h-2.5 w-2.5 rounded-full ${
                i === activeIndex ? "bg-white" : "bg-white/30"
              }`}
              aria-label={`Aller au slide ${i + 1}`}
            />
          ))}
        </div>
      </main>
    )
}