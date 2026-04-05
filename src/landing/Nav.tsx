import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import makaImg from '../../images/maka_512.png';

export function Nav() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 60);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        setMenuOpen(false);
    }, [location.pathname, location.search, location.hash]);

    useEffect(() => {
        if (!menuOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                setMenuOpen(false);
            }
        };

        window.addEventListener('keydown', onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [menuOpen]);

    useEffect(() => {
        const mediaQuery = window.matchMedia('(min-width: 821px)');
        const onMediaChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                setMenuOpen(false);
            }
        };

        mediaQuery.addEventListener('change', onMediaChange);

        return () => {
            mediaQuery.removeEventListener('change', onMediaChange);
        };
    }, []);

    return (
        <>
            <nav className={`nav${scrolled ? ' scrolled' : ''}${menuOpen ? ' is-menu-open' : ''}`}>
                <Link to="/" className="nav-logo" onClick={() => setMenuOpen(false)}>
                    <img src={makaImg} alt="Drank" />
                    <span>
                        drank<span style={{ color: 'var(--accent)' }}>.</span>wtf
                    </span>
                </Link>
                <div className="nav-controls">
                    <div className="nav-right">
                        <Link
                            to="/provably-fair"
                            className="nav-link"
                            onClick={() => setMenuOpen(false)}
                        >
                            Provably Fair
                        </Link>
                        {/* TODO: Replace with real Discord invite URL */}
                        <div className="btn-pill-wrapper">
                            <a
                                href="https://discord.gg/sipping"
                                className="btn-pill btn-pill-primary"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Get Started
                            </a>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="nav-menu-button"
                        aria-expanded={menuOpen}
                        aria-controls="nav-mobile-menu"
                        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
                        onClick={() => setMenuOpen((current) => !current)}
                    >
                        {menuOpen ? <X size={18} /> : <Menu size={18} />}
                    </button>
                </div>
            </nav>
            <div
                className={`nav-overlay${menuOpen ? ' is-open' : ''}`}
                aria-hidden={!menuOpen}
                onClick={() => setMenuOpen(false)}
            >
                <div className="nav-panel-shell" onClick={(event) => event.stopPropagation()}>
                    <div id="nav-mobile-menu" className={`nav-panel${menuOpen ? ' is-open' : ''}`}>
                        <Link
                            to="/provably-fair"
                            className="nav-panel-link"
                            onClick={() => setMenuOpen(false)}
                        >
                            <span>Provably Fair</span>
                            <span className="nav-panel-arrow">↗</span>
                        </Link>
                        <a
                            href="https://discord.gg/sipping"
                            className="btn-pill btn-pill-primary nav-panel-cta"
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setMenuOpen(false)}
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
