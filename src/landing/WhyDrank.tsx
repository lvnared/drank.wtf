import { KeyRound, MessageSquare, ShieldCheck, Zap, type LucideIcon } from 'lucide-react';

type Feature = {
    icon: LucideIcon;
    title: string;
    desc: string;
};

const features: readonly Feature[] = [
    {
        icon: Zap,
        title: 'Instant Payouts',
        desc: 'Winnings hit your balance the moment the flip resolves. No waiting, no withdrawal queues.',
    },
    {
        icon: ShieldCheck,
        title: 'Provably Fair',
        desc: 'Every outcome is derived from the drand randomness beacon — cryptographically verifiable by anyone.',
    },
    {
        icon: KeyRound,
        title: 'Non-Custodial',
        desc: 'Your funds, your keys. We never hold your crypto longer than the flip takes.',
    },
    {
        icon: MessageSquare,
        title: 'Discord-Native',
        desc: 'No separate app, no browser tab. Play directly in your Discord server with slash commands.',
    },
];

export function WhyDrank() {
    return (
        <section className="why-drank">
            <h2 className="section-title reveal">Why Drank</h2>
            <p className="section-subtitle reveal reveal-delay-1">Built different.</p>
            <div className="features-grid">
                {features.map((f, i) => (
                    <div key={f.title} className={`feature-card reveal reveal-delay-${i + 1}`}>
                        <div className="feature-icon" aria-hidden="true">
                            <f.icon />
                        </div>
                        <h3>{f.title}</h3>
                        <p>{f.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
