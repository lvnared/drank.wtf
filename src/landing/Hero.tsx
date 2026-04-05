import { useEffect, useState } from 'react';
import makaImg from '../../images/maka_to_dye.webp';

type HeroWord = {
    text: string;
    delay: number;
    className?: string;
};

const HERO_WORDS: readonly HeroWord[] = [
    { text: 'Flip.', delay: 1500 },
    { text: 'Win.', delay: 1500 },
    { text: 'Repeat.', delay: 4000, className: 'hero-word-accent' },
];

export function Hero() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [previousIndex, setPreviousIndex] = useState<number | null>(null);

    useEffect(() => {
        const currentWord = HERO_WORDS[activeIndex] ?? { text: 'Flip.', delay: 2000 };
        const timeoutId = window.setTimeout(() => {
            setPreviousIndex(activeIndex);
            setActiveIndex((activeIndex + 1) % HERO_WORDS.length);
        }, currentWord.delay);

        return () => window.clearTimeout(timeoutId);
    }, [activeIndex]);

    return (
        <section className="hero">
            <h1 className="hero-title" aria-label="Flip. Win. Repeat.">
                <span className="hero-word-window" aria-hidden="true">
                    {HERO_WORDS.map((word, index) => {
                        const stateClass =
                            index === activeIndex
                                ? 'is-active'
                                : index === previousIndex
                                  ? 'is-previous'
                                  : 'is-hidden';

                        return (
                            <span
                                key={word.text}
                                className={`hero-word ${stateClass}${word.className ? ` ${word.className}` : ''}`}
                            >
                                {word.text}
                            </span>
                        );
                    })}
                </span>
            </h1>
            <p>
                The <span style={{ color: 'var(--accent)' }}>leanest</span> crypto coinflip bot on
                Discord.
            </p>
            <div className="hero-ctas">
                {/* TODO: Replace with real Discord invite URL */}
                <a
                    href="https://discord.gg/sipping"
                    className="btn-pill btn-pill-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Get Started
                </a>
                <a href="#how-it-works" className="btn-pill btn-pill-ghost">
                    How It Works
                </a>
            </div>
        </section>
    );
}
