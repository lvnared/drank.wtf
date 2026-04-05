import { Link } from 'react-router-dom';

export function ProvablyFairCTA() {
    return (
        <section className="pf-cta reveal">
            <h2 className="noselect">Every flip, verifiable.</h2>
            <p>
                Drank uses the drand distributed randomness beacon — a decentralized, publicly
                verifiable source of randomness. Combined with a unique game nonce, every outcome is
                deterministic and impossible to manipulate.
            </p>
            <Link to="/provably-fair" className="btn-pill btn-pill-primary">
                Verify a Flip
            </Link>
        </section>
    );
}
