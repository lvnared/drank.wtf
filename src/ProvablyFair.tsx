import { useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from './landing/Footer';
import makaImg from '../images/maka_512.png';
import dyeImg from '../images/dye_512.png';

interface VerifyResult {
    randomness: string;
    hash: string;
    first8: string;
    uint32: number;
    outcome: 'Drank' | 'Dye';
}

async function computeOutcome(randomness: string, gameNonce: string) {
    const enc = new TextEncoder();
    const keyData = enc.encode(randomness);
    const messageData = enc.encode(gameNonce);

    const key = await crypto.subtle.importKey(
        'raw',
        keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign'],
    );
    const hashBuffer = await crypto.subtle.sign('HMAC', key, messageData);

    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');

    // ✅ Match Node.js: use full hash as BigInt, mod 2
    const n = BigInt(`0x${hashHex}`) % 2n;
    const outcome = n === 0n ? 'Drank' : 'Dye';

    return { randomness, hashHex, outcome };
}

const VERIFICATION_CODE = `async function verifyFlip(roundId: number, gameNonce: string) {
  // 1. Fetch randomness from drand beacon
  const res = await fetch(\`https://drand.cloudflare.com/public/\${roundId}\`);
  const { randomness } = await res.json();

  // Convert inputs to Uint8Array
  const enc = new TextEncoder();

  const keyData = enc.encode(randomness);   // HMAC key
  const messageData = enc.encode(gameNonce); // message

  const key = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const hashBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    messageData
  );

  // 3. Convert to hex and extract first 8 chars
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  const first8 = hashHex.slice(0, 8);

  // 4. Parse as uint32 and determine outcome
  const uint32 = parseInt(first8, 16);
  const outcome = uint32 % 2 === 0 ? 'Drank' : 'Dye';

  return { randomness, hashHex, first8, uint32, outcome };
}`;

export default function ProvablyFair() {
    const [roundId, setRoundId] = useState('');
    const [nonce, setNonce] = useState('');
    const [result, setResult] = useState<VerifyResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleVerify = useCallback(async () => {
        const rid = parseInt(roundId, 10);
        if (isNaN(rid) || rid <= 0) {
            setError('Please enter a valid round ID.');
            return;
        }
        if (!nonce.trim()) {
            setError('Please enter a game nonce.');
            return;
        }

        setLoading(true);
        setError(null);
        setResult(null);

        try {
            const res = await fetch(
                `https://drand.cloudflare.com/52db9ba70e0cc0f6eaf7803dd07447a1f5477735fd3f661792ba94600c84e971/public/${rid}`,
            );
            if (!res.ok) {
                throw new Error(`drand returned ${res.status}. Check the round ID.`);
            }
            const data: { randomness: string } = await res.json();
            const outcome = await computeOutcome(data.randomness, nonce.trim());
            setResult(outcome);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    }, [roundId, nonce]);

    const handleCopy = useCallback(async () => {
        await navigator.clipboard.writeText(VERIFICATION_CODE);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }, []);

    return (
        <>
            <div className="pf-page">
                <Link to="/" className="pf-back">
                    ← Back
                </Link>
                <h1>Provably Fair</h1>

                <div className="pf-explanation">
                    <p>
                        Each coinflip uses the{' '}
                        <a href="https://drand.love" target="_blank" rel="noopener noreferrer">
                            drand
                        </a>{' '}
                        public randomness beacon. We combine the drand round&apos;s randomness with
                        your unique game nonce to produce a deterministic, unbiasable outcome.
                    </p>
                </div>

                <div className="pf-code-block">
                    <pre>
                        <span className="hl-key">outcome</span> <span className="hl-op">=</span>{' '}
                        SHA256(drand_randomness + &quot;:&quot; + game_nonce)
                        {'\n'}
                        {'          '}→ take first 8 hex chars as uint32
                        {'\n'}
                        {'          '}→ <span className="hl-key">Drank</span> if even,{' '}
                        <span className="hl-key">Dye</span> if odd
                    </pre>
                </div>

                <div className="verifier">
                    <h2>Verify a Flip</h2>
                    <div className="verifier-form">
                        <div className="verifier-field">
                            <label htmlFor="round-id">drand Round ID</label>
                            <input
                                id="round-id"
                                type="number"
                                min="1"
                                placeholder="e.g. 3176788"
                                value={roundId}
                                onChange={(e) => setRoundId(e.target.value)}
                            />
                        </div>
                        <div className="verifier-field">
                            <label htmlFor="game-nonce">Game Nonce</label>
                            <input
                                id="game-nonce"
                                type="text"
                                placeholder="e.g. abc123-flip-456"
                                value={nonce}
                                onChange={(e) => setNonce(e.target.value)}
                            />
                        </div>
                        <div style={{ alignSelf: 'flex-end' }}>
                            <button
                                className="btn-pill btn-pill-primary"
                                onClick={handleVerify}
                                disabled={loading}
                            >
                                {loading ? 'Verifying…' : 'Verify'}
                            </button>
                        </div>
                    </div>

                    {error && <div className="verifier-error">{error}</div>}
                    {loading && (
                        <div className="verifier-loading">Fetching randomness from drand…</div>
                    )}

                    {result && (
                        <div className="verifier-result">
                            <div className="verifier-result-row">
                                <span className="verifier-label">Randomness</span>
                                <span className="verifier-value">{result.randomness}</span>
                            </div>
                            <div className="verifier-result-row">
                                <span className="verifier-label">SHA-256 Hash</span>
                                <span className="verifier-value">{result.hash}</span>
                            </div>
                            <div className="verifier-result-row">
                                <span className="verifier-label">First 8 Hex</span>
                                <span className="verifier-value">{result.first8}</span>
                            </div>
                            <div className="verifier-result-row">
                                <span className="verifier-label">As uint32</span>
                                <span className="verifier-value">{result.uint32}</span>
                            </div>
                            <div className="verifier-result-row">
                                <span className="verifier-label">Outcome</span>
                                <span
                                    className={`verifier-outcome ${result.outcome === 'Drank' ? 'verifier-outcome-drank' : 'verifier-outcome-dye'}`}
                                >
                                    <img
                                        src={result.outcome === 'Drank' ? makaImg : dyeImg}
                                        alt=""
                                    />
                                    {result.outcome}
                                </span>
                            </div>
                        </div>
                    )}
                </div>

                <div className="copy-block">
                    <div className="copy-block-header">
                        <span className="copy-block-title">Verification Code (TypeScript)</span>
                        <button className="copy-btn" onClick={handleCopy}>
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    </div>
                    <pre>{VERIFICATION_CODE}</pre>
                </div>
            </div>
            <Footer />
        </>
    );
}
