"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Slide = {
    id: number;
    title: string;
    description: string;
};

export default function OnboardingPanel({
    currentSlide,
    slidesLength,
    activeIndex,
    onNext,
    onSkip,
}: {
    currentSlide: Slide;
    slidesLength: number;
    activeIndex: number;
    onNext: () => void;
    onSkip: () => void;
}) {
    const router = useRouter()
    const [role, setRole] = useState<"hero" | "peer_hero" | null>(null)
    const isChoiceValid = role !== null
    const isLastSlide = activeIndex === slidesLength - 1

    const handleSubmitRole = (event: React.FormEvent) => {
        event.preventDefault()
        if (!role)
            return
        router.push(`/auth/sign-up/${role}`)
    }

    return (
        <div className="flex-1 px-6 pb-8 lg:relative">
            {/* Header desktop */}
            <div className="hidden lg:flex items-center justify-between">
                <Image
                    src="/onboarding/logo-synea.svg"
                    alt="SYNEA"
                    width={60}
                    height={60}
                    priority
                    className="select-none"
                />
                <button
                    type="button"
                    onClick={onSkip}
                    className="text-sm font-semibold text-black/70 hover:text-black bg-[#9F86C0]
                     focus:outline-none focus:ring-2 focus:ring-white/30 rounded-full px-3 py-2"
                    aria-label="Passer l'onboarding"
                >
                    Passer
                </button>
            </div>

            {/* Desktop content */}
            <div className="hidden lg:flex h-full items-center justify-center">
                <div className="w-full max-w-xl rounded-3xl p-10 backdrop-blur ring-1 ring-white/10">
                    <h1 className="mt-4 whitespace-pre-line text-4xl font-semibold leading-tight text-[#483C5C]">
                        {currentSlide.title}
                    </h1>

                    <p className="mt-4 text-base leading-relaxed text-[#6D647A]">
                        {currentSlide.description}
                    </p>

                    {isLastSlide ? (
                        <form onSubmit={handleSubmitRole} className="mt-8 space-y-4">
                            <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="hero"
                                    checked={role === "hero"}
                                    onChange={() => setRole("hero")}
                                />
                                <span className="font-medium text-[#483C5C]">Je suis un héros</span>
                            </label>

                            <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer">
                                <input
                                    type="radio"
                                    name="role"
                                    value="peer_hero"
                                    checked={role === "peer_hero"}
                                    onChange={() => setRole("peer_hero")}
                                />
                                <span className="font-medium text-[#483C5C]">Je suis un pair-héros</span>
                            </label>

                            <button
                                type="submit"
                                disabled={!isChoiceValid}
                                className={`w-full rounded-full px-6 py-3 text-sm font-semibold text-white
        ${isChoiceValid ? "bg-[#9F86C0]" : "bg-black/20 cursor-not-allowed"}`}
                            >
                                Suivant
                            </button>
                        </form>
                    ) : (
                        <button
                            onClick={onNext}
                            className="mt-8 w-full rounded-full bg-[#9F86C0] px-6 py-3 text-sm font-semibold text-white cursor-pointer"
                        >
                            Continuer
                        </button>
                    )}

                </div>
            </div>

            {/* Mobile content */}
            <div key={currentSlide.id} className="lg:hidden transition-all duration-300 ease-out">
            <h1 className="mt-2 text-2xl font-semibold text-center leading-tight text-[#483C5C]">
                {currentSlide.title}
            </h1>

            <p className="mt-3 text-sm leading-relaxed text-center text-[#6D647A]">
                {currentSlide.description}
            </p>

            {isLastSlide ? (
                <form onSubmit={handleSubmitRole} className="mt-6 space-y-3">
                <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer">
                    <input
                    type="radio"
                    name="role"
                    value="hero"
                    checked={role === "hero"}
                    onChange={() => setRole("hero")}
                    />
                    <span className="font-medium text-[#483C5C]">Je suis un héros</span>
                </label>

                <label className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-3 cursor-pointer">
                    <input
                    type="radio"
                    name="role"
                    value="peer_hero"
                    checked={role === "peer_hero"}
                    onChange={() => setRole("peer_hero")}
                    />
                    <span className="font-medium text-[#483C5C]">Je suis un pair-héros</span>
                </label>

                <button
                    type="submit"
                    disabled={!isChoiceValid}
                    className={`w-full rounded-full px-6 py-4 text-sm font-semibold text-white
                    ${isChoiceValid ? "bg-[#9F86C0]" : "bg-black/20 cursor-not-allowed"}`}
                >
                    Suivant
                </button>
                </form>
            ) : (
                <div className="mt-4">
                <button
                    className="w-full rounded-full bg-[#9F86C0] px-6 py-4 text-sm font-semibold text-white hover:opacity-95"
                    onClick={onNext}
                >
                    Continuer
                </button>
                </div>
            )}
            </div>
        </div>
    );
}

