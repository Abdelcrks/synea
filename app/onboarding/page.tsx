"use client"


import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState, useRef, useMemo } from "react"
import ParticlesBackground from "../components/ParticlesBackground"




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
      imageSrc: "/onboarding/onboarding-hero-1.svg",
    },
    {
      id: 2, 
      badge: "Une communauté humaine",
      title: "Tu n'es plus seul, des héros comme toi, comprennent vraiment",
      description: "Échange avec des pairs, partage ton histoire, trouve un soutien humain et bienveillant.",
      imageSrc: "/onboarding/onboarding-hero-2.svg",
    },
    {
      id: 3, 
      badge: "Choix du profil",
      title: "Choisis ton rôle sur SYNEA.",
      description: "Héros (je travèrse l'épreuve) ou Pair-Héros (j'ai déjà traversé, j'accompagne). Tu pourras toujours évoluer ensuite.",
      imageSrc: "/onboarding/onboarding-hero-test.svg",
    },
  ]

  useEffect (() => {
    const element = scrollerRef.current // div qui scroll 
    if(!element) return // si la div n'est pas encore montée on stop
    
    const onScroll = () => { // fonction appeler automatiquement à chaque scroll
      const index = Math.round(element.scrollLeft/ element.clientWidth) // calcul numero de slide 
      //ex : 0/400 = slide 0 400/400 = slide 1 800/400 = slide 2  round arrondit
      setActiveIndex(index) // celle qui est active mtn = index
    }
    element.addEventListener("scroll", onScroll, {passive:true}) // à chaque fois l'user scroll cette div call onScroll et passive true = navigateur sait qu'on ne fera pas preventdefault

    return () => {
      element.removeEventListener("scroll", onScroll) // qd le component disparait on enleve l'event
    }
    }, [])

    const goToSlide = (indexSlide:any) => {
      const element = scrollerRef.current
      if(!element) return

      const left = indexSlide * element.clientWidth // 0 * 400 = slide 1 1*400 = slide 2, 2*400 = slide 3 num  de slide === position scroll

      element.scrollTo({left, behavior: "smooth"}) // scroll horizontal fluide 
    }

    const goToChoicesRoles = () => {
      router.push("/onboarding/roles")
    }
    return(
        <main className="h-screen w-screen relative bg-linear-to-b from-neutral-950 via-neutral-900 to-neutral-950">
          <div className="absolute inset-0 z-0 hidden lg:block ">
              <ParticlesBackground/>
          </div>
          <button className="absolute right-4 top-4 px-3 py-1 rounded-full z-30 sm:text-xs md:text-xs lg:text-xl text-white hover:bg-black/30 cursor-pointer"
          onClick={goToChoicesRoles}
          >
            Passer
          </button>
          <div ref={scrollerRef} className="flex h-full w-full overflow-x-auto snap-x snap-mandatory scroll-smooth no-scrollbar">
              {slides.map((slide, i) => (
                <section key={slide.id} className="h-screen w-screen shrink-0 snap-center relative overflow-hidden">

                  <div className="relative h-full w-full lg:grid lg:grid-cols-2">
                    <div className="relative h-full w-full">
                      <Image src={slide.imageSrc} alt="image-onboarding" fill className="object-cover"></Image>
                      <div className="absolute inset-0 bg-black/45 lg:hidden"></div>
                      <div className="absolute inset-0 hidden lg:block bg-black/35" />
                      </div>

                    <div className="absolute inset-0 px-6 pt-16 text-white/85 lg:hidden">
                        <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">{slide.badge}</span>
                        <h1 className="max-w-md mt-4 text-2xl font-semibold leading-tight">{slide.title}</h1>
                        <p className="max-w-md mt-4 text-sm leading-relaxed text-white/85">{slide.description}</p>

                        { i === slides.length -1 &&(
                          <button className="mt-6 px-6 py-3 bg-white text-sm font-semibold text-slate-900 rounded-full hover:bg-white/80"
                          onClick={goToChoicesRoles}>
                            Choisir mon rôle
                          </button>
                        )}
                    </div>
                    <div className="relative hidden h-full w-full items-center justify-center px-12 lg:flex">
                    <div className="w-full max-w-xl rounded-3xl bg-black/40 p-10 backdrop-blur ring-1 ring-white/10">
                    <span className="inline-flex rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
                            {slide.badge}
                          </span>
                          <h1 className="mt-4 whitespace-pre-line text-4xl font-semibold leading-tight text-white">
                            {slide.title}
                          </h1>
                          <p className="mt-4 text-base leading-relaxed text-white/85">
                            {slide.description}
                          </p>

                          {i === slides.length - 1 && (
                            <button
                              onClick={goToChoicesRoles}
                              className="mt-8 w-fit rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900 cursor-pointer">
                              Choisir mon rôle
                            </button>
                          )}
                        </div>
                    </div>
                  </div>
                </section>
              ))}
          </div>
          <div className="absolute bottom-10  -translate-x-1/2 z-20 flex gap-2 left-1/2">
          {slides.map((rien, i) => (
            <button
            key={i}
            onClick={() => {goToSlide(i)}}
            className={`h-2.5 w-2.5 rounded-full 
              ${i === activeIndex ? "bg-white" : "bg-white/30 "}
              `}
            />
          ))}
          </div>
        </main>
    )
}










// "use client";

// import Image from "next/image";
// import { useEffect, useMemo, useRef, useState } from "react";
// import { useRouter } from "next/navigation";

// type Slide = {
//   id: number;
//   badge: string;
//   title: string;
//   description: string;
//   imageSrc: string;
// };

// export default function Onboarding() {
//   const router = useRouter();
//   const scrollerRef = useRef<HTMLDivElement | null>(null); // scroller ref contiendra plus tard une div pour l'instant vide = null
//   const [activeIndex, setActiveIndex] = useState(0);

//   const slides: Slide[] = useMemo(
//     () => [
//       {
//         id: 1,
//         badge: "Bienvenue sur SYNEA",
//         title:
//           "Parfois, le chemin est difficile.\nMais personne ne devrait avancer seul.",
//         description:
//           "SYNEA est un espace d’entraide entre personnes qui ont traversé l’épreuve et celles qui peuvent comprendre.",
//         imageSrc: "/onboarding/onboarding-hero-1.svg",
//       },
//       {
//         id: 2,
//         badge: "Une communauté humaine",
//         title: "Tu n’es plus seul.\nDes personnes comprennent vraiment.",
//         description:
//           "Échange avec des pairs, partage ton histoire, trouve un soutien humain et bienveillant.",
//         imageSrc: "/onboarding/onboarding-hero-2.svg",
//       },
//       {
//         id: 3,
//         badge: "Choix du profil",
//         title: "Choisis ton rôle sur SYNEA.",
//         description:
//           "Héros (je traverse l’épreuve) ou Pair-héros (j’accompagne). Tu pourras toujours évoluer ensuite.",
//         imageSrc: "/onboarding/onboarding-hero-test.svg",
//       },
//     ],
//     []
//   );

//   /* =========================
//      Scroll → activeIndex
//   ========================== */
//   useEffect(() => {
//     const el = scrollerRef.current;
//     if (!el) return;

//     const onScroll = () => {
//       const index = Math.round(el.scrollLeft / el.clientWidth);
//       setActiveIndex(index);
//     };

//     el.addEventListener("scroll", onScroll, { passive: true });
//     return () => el.removeEventListener("scroll", onScroll);
//   }, []);

//   const goTo = (index: number) => {
//     const el = scrollerRef.current;
//     if (!el) return;
//     el.scrollTo({
//       left: index * el.clientWidth,
//       behavior: "smooth",
//     });
//   };

//   const goNext = () => {
//     if (activeIndex < slides.length - 1) {
//       goTo(activeIndex + 1);
//     }
//   };

//   const finish = () => {
//     router.push("/onboarding/step-3");
//   };

//   return (
//     <main className="relative h-screen w-screen overflow-hidden bg-black">
//       {/* ======= TOP BAR ======= */}
//       <div className="absolute top-4 left-4 right-4 z-30 flex justify-between">
//         <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">
//           {activeIndex + 1} / {slides.length}
//         </span>

//         <button
//           onClick={finish}
//           className="rounded-full bg-black/30 px-3 py-1 text-xs text-white backdrop-blur"
//         >
//           Passer
//         </button>
//       </div>

//       {/* ======= SLIDES ======= */}
//       <div
//         ref={scrollerRef}
//         className="no-scrollbar flex h-full w-full snap-x snap-mandatory overflow-x-auto scroll-smooth"
//       >
//         {slides.map((slide, idx) => (
//           <section
//             key={slide.id}
//             className="relative h-screen w-screen shrink-0 snap-center"
//           >
//             {/* ================= MOBILE + DESKTOP WRAPPER ================= */}
//             <div className="relative h-full w-full lg:grid lg:grid-cols-2">
//               {/* ========= IMAGE ========= */}
//               <div className="relative h-full w-full">
//                 <Image
//                   src={slide.imageSrc}
//                   alt={`Onboarding SYNEA ${slide.id}`}
//                   fill
//                   priority={idx === 0}
//                   className="object-cover"
//                 />

//                 {/* Overlay mobile */}
//                 <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/30 to-black/30 lg:hidden" />

//                 {/* Overlay desktop */}
//                 <div className="absolute inset-0 hidden lg:block bg-linear-to-r from-black/10 via-transparent to-black/25" />
//               </div>

//               {/* ========= MOBILE TEXT (OVERLAY) ========= */}
//               <div className="absolute inset-0 z-10 flex flex-col px-6 pt-16 lg:hidden">
//                 <span className="w-fit rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">
//                   {slide.badge}
//                 </span>

//                 <h1 className="mt-4 max-w-md whitespace-pre-line text-3xl font-semibold leading-tight text-white">
//                   {slide.title}
//                 </h1>

//                 <p className="mt-4 max-w-md text-sm leading-relaxed text-white/85">
//                   {slide.description}
//                 </p>

//                 {idx === slides.length - 1 && (
//                   <button
//                     onClick={finish}
//                     className="mt-6 w-fit rounded-full bg-white px-6 py-3 font-semibold text-slate-900"
//                   >
//                     Choisir mon rôle
//                   </button>
//                 )}
//               </div>

//               {/* ========= DESKTOP TEXT ========= */}
//               <div className="relative z-10 hidden h-full items-center justify-center px-12 lg:flex">
//                 <div className="rounded-3xl bg-white/5 p-10 backdrop-blur ring-1 ring-white/10">
//                   <span className="rounded-full bg-white/15 px-3 py-1 text-xs text-white backdrop-blur">
//                     {slide.badge}
//                   </span>

//                   <h1 className="mt-4 max-w-xl whitespace-pre-line text-4xl font-semibold text-white">
//                     {slide.title}
//                   </h1>

//                   <p className="mt-4 max-w-xl text-base text-white/85">
//                     {slide.description}
//                   </p>

//                   <div className="mt-8 flex gap-3">
//                     {idx < slides.length - 1 ? (
//                       <button
//                         onClick={goNext}
//                         className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900"
//                       >
//                         Continuer
//                       </button>
//                     ) : (
//                       <button
//                         onClick={finish}
//                         className="rounded-full bg-white px-6 py-3 font-semibold text-slate-900"
//                       >
//                         Choisir mon rôle
//                       </button>
//                     )}

//                     <button
//                       onClick={finish}
//                       className="rounded-full bg-white/10 px-5 py-3 text-white ring-1 ring-white/20"
//                     >
//                       Passer
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         ))}
//       </div>

//       {/* ======= DOTS ======= */}
//       <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 gap-2">
//         {slides.map((_, i) => (
//           <button
//             key={i}
//             onClick={() => goTo(i)}
//             className={`h-2.5 w-2.5 rounded-full ${
//               i === activeIndex ? "bg-white" : "bg-white/40"
//             }`}
//           />
//         ))}
//       </div>
//     </main>
//   );
// }
