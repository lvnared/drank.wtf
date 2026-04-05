import { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, type Location } from 'react-router-dom';
import { Nav } from './landing/Nav';
import LandingPage from './landing/LandingPage';
import ProvablyFair from './ProvablyFair';

const PAGE_TRANSITION_MS = 220;
const PAGE_LOADING_MS = 180;

function applyScrollLinkedAccent(_scrollY: number) {}

function ScrollEffects({ pathname }: { pathname: string }) {
    useEffect(() => {
        window.scrollTo(0, 0);
        applyScrollLinkedAccent(0);
    }, [pathname]);

    useEffect(() => {
        let frameId = 0;

        const requestAccentUpdate = () => {
            if (frameId !== 0) {
                return;
            }

            frameId = window.requestAnimationFrame(() => {
                frameId = 0;
                applyScrollLinkedAccent(window.scrollY);
            });
        };

        requestAccentUpdate();
        window.addEventListener('scroll', requestAccentUpdate, { passive: true });
        window.addEventListener('resize', requestAccentUpdate);

        return () => {
            if (frameId !== 0) {
                window.cancelAnimationFrame(frameId);
            }

            window.removeEventListener('scroll', requestAccentUpdate);
            window.removeEventListener('resize', requestAccentUpdate);
        };
    }, []);

    return null;
}

function getTransitionDuration() {
    if (typeof window === 'undefined') {
        return PAGE_TRANSITION_MS;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : PAGE_TRANSITION_MS;
}

function getLoadingDuration() {
    if (typeof window === 'undefined') {
        return PAGE_LOADING_MS;
    }

    return window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : PAGE_LOADING_MS;
}

function AnimatedRoutes() {
    const location = useLocation();
    const [renderedLocation, setRenderedLocation] = useState<Location>(location);
    const [transitionStage, setTransitionStage] = useState<'fade-in' | 'fade-out' | 'loading'>(
        'fade-in',
    );
    const isPageChange =
        location.pathname !== renderedLocation.pathname ||
        location.search !== renderedLocation.search;

    useEffect(() => {
        if (isPageChange && transitionStage === 'fade-in') {
            setTransitionStage('fade-out');
        }
    }, [isPageChange, transitionStage]);

    useEffect(() => {
        if (transitionStage !== 'fade-out') {
            return;
        }

        let frameId = 0;

        const timeoutId = window.setTimeout(() => {
            setTransitionStage('loading');
            frameId = window.requestAnimationFrame(() => {
                setRenderedLocation(location);
            });
        }, getTransitionDuration());

        return () => {
            window.clearTimeout(timeoutId);
            if (frameId !== 0) {
                window.cancelAnimationFrame(frameId);
            }
        };
    }, [location, transitionStage]);

    useEffect(() => {
        if (transitionStage !== 'loading' || !isPageChange) {
            return;
        }

        const frameId = window.requestAnimationFrame(() => {
            setRenderedLocation(location);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [isPageChange, location, transitionStage]);

    useEffect(() => {
        if (transitionStage !== 'loading' || isPageChange) {
            return;
        }

        const timeoutId = window.setTimeout(() => {
            setTransitionStage('fade-in');
        }, getLoadingDuration());

        return () => {
            window.clearTimeout(timeoutId);
        };
    }, [isPageChange, transitionStage]);

    const transitionClassName =
        transitionStage === 'fade-out'
            ? 'route-transition is-exiting'
            : transitionStage === 'loading'
              ? 'route-transition is-loading'
              : 'route-transition is-entering';

    return (
        <>
            <ScrollEffects pathname={renderedLocation.pathname} />
            <div className={transitionClassName}>
                <Routes location={renderedLocation}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/provably-fair" element={<ProvablyFair />} />
                </Routes>
            </div>
            <div
                className={`route-loading-indicator ${transitionStage === 'loading' ? 'is-visible' : ''}`}
                aria-hidden={transitionStage !== 'loading'}
            >
                <div className="route-loading-chip" role="status" aria-live="polite">
                    <span className="route-loading-spinner" />
                </div>
            </div>
        </>
    );
}

export function App() {
    return (
        <BrowserRouter>
            <Nav />
            <AnimatedRoutes />
        </BrowserRouter>
    );
}
