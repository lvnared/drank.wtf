import { Link } from 'react-router-dom';
import makaImg from '../../images/maka_512.png';

export function Footer() {
    return (
        <footer className="footer">
            <div className="footer-left">
                <img src={makaImg} alt="Drank" />
                <span>drank.wtf</span>
            </div>
            <div className="footer-links">
                {/* TODO: Replace with real Discord invite URL */}
                <a href="https://discord.gg/sipping" target="_blank" rel="noopener noreferrer">
                    Discord
                </a>
                <Link to="/provably-fair">Provably Fair</Link>
            </div>
            <div className="footer-copyright">
                © {new Date().getFullYear()} Drank. All rights reserved.
            </div>
        </footer>
    );
}
