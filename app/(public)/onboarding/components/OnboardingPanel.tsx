"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

type Slide = {
    id: number;
    title: string;
    description: string;
}

type Role = "hero" | "peer_hero"

export default function OnboardingPanel({
    currentSlide,
    slidesLength,
    activeIndex,
    onNext,
    onSkip,
    onChooseRole,
}: {
    currentSlide: Slide;
    slidesLength: number;
    activeIndex: number;
    onNext: () => void;
    onSkip: () => void,
    onChooseRole: (role: Role) => void,
}) {
    const [role, setRole] = useState<"hero" | "peer_hero" | null>(null)
    const isChoiceValid = role !== null
    const isLastSlide = activeIndex === slidesLength - 1

    const handleSubmitRole = (event: React.FormEvent) => {
        event.preventDefault()
        if (!role)
            return
        onChooseRole(role)
    }

    return (
        <div className="flex-1 px-6 pb-8 lg:relative flex flex-col">
            {/* Headder desktop */}
            <div className="hidden lg:flex items-center justify-between">
                <Image
                    src="/onboarding/logo-synea.svg"
                    alt="SYNEA"
                    width={90}
                    height={90}
                    priority
                    className="select-none"
                />
                <button
                    type="button"
                    onClick={onSkip}
                    // className="text-sm font-sans cursor-pointer text-white  bg-(--primary) hover:bg-(--primary-hover)
                    // rounded-full px-3 py-2"
                    className="btn--primary px-3 py-2 rounded-full cursor-pointer font-semibold"
                    aria-label="Passer l'onboarding"
                >
                    Passer
                </button>
            </div>

            {/* Desktop  */}
            <div className="hidden lg:flex h-full items-center justify-center">
                <div className="w-full max-w-xl rounded-3xl p-10 backdrop-blur ring-1 ring-white/10">
                    <h1 className="mt-4 font-serif whitespace-pre-line text-4xl leading-tight text-(--text-main)">
                        {currentSlide.title}
                    </h1>

                    <p className="mt-4  font-sans leading-relaxed text-(--text-main)">
                        {currentSlide.description}
                    </p>

                    {isLastSlide ? (
                        <form onSubmit={handleSubmitRole} className="mt-8 space-y-4">
                            <label className="flex gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer border border-(--primary) shadow-xs hover:shadow-lg hover:bg-(--primary) hover:text-white">
                                <input
                                    type="radio"
                                    name="role"
                                    id="name"
                                    value="hero"
                                    checked={role === "hero"}
                                    onChange={() => setRole("hero")}
                                />
                                <span className="font-medium font-sans ">Je suis un héros</span>
                            </label>

                            <label className="flex gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer border border-(--primary) shadow-xs hover:shadow-lg hover:bg-(--primary) hover:text-white">
                                <input
                                    type="radio"
                                    name="role"
                                    value="peer_hero"
                                    checked={role === "peer_hero"}
                                    onChange={() => setRole("peer_hero")}
                                />
                                <span className="font-medium">Je suis un pair-héros</span>
                            </label> 


                            <button
                                type="submit"
                                disabled={!isChoiceValid}
                                className={`btn--primary px-6 py-3  cursor-pointer w-full font-sans  rounded-full font-semibold  
                                ${isChoiceValid ? "btn-primary" : "bg-black/20 cursor-not-allowed"}`}
                            >
                                Suivant
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={onNext}
                            className="mt-8 w-full   font-sans rounded-full bg-(--primary) hover:bg-(--primary-hover) px-6 py-3 text-sm font-semibold text-white cursor-pointer"
                        >
                            Continuer
                        </button>
                    )}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-(--text-main)">
                            Déjà un compte ?{" "}
                            <Link
                            href="/auth/sign-in"
                            className="font-semibold text-(--primary) hover:underline"
                            >
                            Se connecter
                            </Link>
                        </p>
                    </div>
                </div>
            </div>

            {/* Mob */}
            <div key={currentSlide.id} className="lg:hidden transition-all duration-300 ease-out">
            <h1 className="mt-2 text-2xl font-semibold text-center leading-tight text-(--text-main)">
                {currentSlide.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-center text-(--text-main) ">
                {currentSlide.description}
            </p>

            {isLastSlide ? (
                <form onSubmit={handleSubmitRole} className="mt-6 space-y-3">
                <label className="flex gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer border border-(--primary) shadow-xs hover:shadow-lg hover:bg-(--primary) hover:text-white">
                    <input
                    type="radio"
                    name="role"
                    value="hero"
                    checked={role === "hero"}
                    onChange={() => setRole("hero")}
                    />
                    <span className="font-medium text-(--text-main)">Je suis un héros</span>
                </label>

                <label className="flex gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer border border-(--primary) shadow-xs hover:shadow-lg hover:bg-(--primary) hover:text-white">
                    <input
                    type="radio"
                    name="role"
                    value="peer_hero"
                    checked={role === "peer_hero"}
                    onChange={() => setRole("peer_hero")}
                    />
                    <span className="font-medium text-(--text-main)">Je suis un pair-héros</span>
                </label>

                <button
                    type="submit"
                    disabled={!isChoiceValid}
                    className={`btn--primary px-6 py-3  cursor-pointer w-full font-sans  rounded-full font-semibold 
                    ${isChoiceValid ? "btn-primary" : "bg-black/20 cursor-not-allowed"}`}
                >
                    Suivant
                </button>
                </form>
            ) : (
                <div className="mt-4">
                <button
                    className="mt-8 w-full   font-sans rounded-full bg-(--primary) hover:bg-(--primary-hover) px-6 py-3 text-sm font-semibold text-white cursor-pointer"
                    onClick={onNext}
                >
                    Continuer
                </button>
                </div>
            )}
            <div className="mt-auto pt-6 text-center">
                <p className="text-sm ">
                    Déjà un compte ?{" "}
                    <Link
                    href="/auth/sign-in"
                    className="font-semibold text-[#9F86C0] hover:underline"
                    >
                    Se connecter
                    </Link>
                </p>
            </div>
            </div>
        </div>
    );
}

