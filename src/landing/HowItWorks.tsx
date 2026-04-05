const steps = [
    {
        number: '01',
        title: 'Use the Bot',
        desc: 'Add Drank to your server or authorize it as an app and start with a simple slash command.',
    },
    {
        number: '02',
        title: 'Start a Coinflip',
        desc: 'Choose your wager amount and flip — Drank or Dye.',
    },
    {
        number: '03',
        title: 'Wait for a Match',
        desc: 'Another user accepts your flip. No edge, pure PvP.',
    },
    {
        number: '04',
        title: 'Provably Fair Result',
        desc: 'The outcome is determined by a drand beacon — verifiable and unbiasable.',
    },
];

export function HowItWorks() {
    return (
        <section className="how-it-works" id="how-it-works">
            <h2 className="section-title reveal">How It Works</h2>
            <p className="section-subtitle reveal reveal-delay-1">Four steps. No trust required.</p>
            <div className="steps-grid">
                {steps.map((step, i) => (
                    <div key={step.number} className={`step-card reveal reveal-delay-${i + 1}`}>
                        <div className="step-number">{step.number}</div>
                        <h3>{step.title}</h3>
                        <p>{step.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}
