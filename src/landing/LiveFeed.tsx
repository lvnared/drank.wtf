import makaImg from '../../images/maka_512.png';
import dyeImg from '../../images/dye_512.png';
import creditImg from '../../images/credit_small_shine_512.webp';

interface Flip {
    id: string;
    winner: 'Drank' | 'Dye';
    amount: number;
    timestamp: number;
}

// TODO: Fetch from GET /api/flips/recent when endpoint is available
const PLACEHOLDER_FLIPS: Flip[] = [
    { id: '1', winner: 'Drank', amount: 0.25, timestamp: Date.now() - 15_000 },
    { id: '2', winner: 'Dye', amount: 0.1, timestamp: Date.now() - 45_000 },
    { id: '3', winner: 'Drank', amount: 1.5, timestamp: Date.now() - 90_000 },
    { id: '4', winner: 'Dye', amount: 0.05, timestamp: Date.now() - 120_000 },
    { id: '5', winner: 'Drank', amount: 0.75, timestamp: Date.now() - 180_000 },
    { id: '6', winner: 'Dye', amount: 2.0, timestamp: Date.now() - 240_000 },
    { id: '7', winner: 'Drank', amount: 0.3, timestamp: Date.now() - 300_000 },
    { id: '8', winner: 'Dye', amount: 0.12, timestamp: Date.now() - 360_000 },
    { id: '9', winner: 'Drank', amount: 5.0, timestamp: Date.now() - 420_000 },
    { id: '10', winner: 'Dye', amount: 0.08, timestamp: Date.now() - 480_000 },
    { id: '11', winner: 'Drank', amount: 0.5, timestamp: Date.now() - 540_000 },
    { id: '12', winner: 'Dye', amount: 1.2, timestamp: Date.now() - 600_000 },
    { id: '13', winner: 'Drank', amount: 0.15, timestamp: Date.now() - 660_000 },
    { id: '14', winner: 'Dye', amount: 0.42, timestamp: Date.now() - 720_000 },
];

const MASKED_USERS = [
    'xK***9f',
    'Dr***42',
    'sk***8e',
    'Lm***3a',
    'zR***7b',
    'nQ***5d',
    'Yp***1c',
    'wJ***6g',
    'Hv***0k',
    'cT***4m',
    'eB***2j',
    'uN***8h',
    'gF***3n',
    'aW***6p',
];

function timeAgo(ts: number): string {
    const diff = Math.floor((Date.now() - ts) / 1000);
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    return `${Math.floor(diff / 3600)}h ago`;
}

export function LiveFeed() {
    const flips = PLACEHOLDER_FLIPS;
    const doubled = [...flips, ...flips];

    return (
        <section className="live-feed reveal">
            <h2 className="section-title">Live Flips</h2>
            <p className="section-subtitle">Real outcomes, real time.</p>
            <div className="feed-container">
                <div className="feed-scroll">
                    <div className="feed-track">
                        {doubled.map((flip, i) => (
                            <div className="feed-row" key={`${flip.id}-${i}`}>
                                <div
                                    className={`feed-chip ${flip.winner === 'Drank' ? 'feed-chip-drank' : 'feed-chip-dye'}`}
                                >
                                    <img src={flip.winner === 'Drank' ? makaImg : dyeImg} alt="" />
                                    {flip.winner}
                                </div>
                                <span className="feed-user">
                                    {MASKED_USERS[i % MASKED_USERS.length]}
                                </span>
                                <span className="feed-amount">
                                    <img
                                        src={creditImg}
                                        style={{
                                            width: '1em',
                                            height: '1em',
                                            objectFit: 'contain',
                                        }}
                                        alt="C"
                                        className="credits"
                                    />
                                    {flip.amount.toFixed(2)}
                                </span>
                                <span className="feed-time">{timeAgo(flip.timestamp)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
