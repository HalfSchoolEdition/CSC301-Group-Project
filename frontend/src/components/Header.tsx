'use client';

import { usePathname, useRouter } from 'next/navigation';
import { Profile, Logout } from '../types/Authentication';
import { useState, useEffect } from 'react';
import type { User } from '../types/Authentication';
import ThemeToggle from './ThemeToggle';

type HeaderProps = {
    backHref?: string;
    backLabel?: string;
};

export default function Header({ backHref = '/', backLabel = '← Back' }: HeaderProps) {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchUser() {
            const currUser = await Profile();
            setUser(currUser);
            setLoading(false);
        }
        fetchUser();
    }, []);

    const goToHomePage = () => {
        router.push(backHref);
    };

    const handleLogout = async () => {
        await Logout();
        setUser(null);
    };

    if (loading) {
        return (
            <header className="relative z-20 flex items-center justify-between border-b border-cyan-300/20 bg-[radial-gradient(circle_at_25%_35%,#1d4ed8_0%,#0b3a91_45%,#001a45_100%)] p-6 text-white shadow-lg shadow-blue-950/40 backdrop-blur-xl">
                <span className="text-white/90">Loading...</span>
                <ThemeToggle />
            </header>
        );
    }

    return (
        <header className="relative z-20 flex items-center justify-between border-b border-cyan-300/20 bg-[radial-gradient(circle_at_25%_35%,#1d4ed8_0%,#0b3a91_45%,#001a45_100%)] p-6 shadow-lg shadow-blue-950/40 backdrop-blur-xl">
            <div className="flex items-center gap-4">
                {pathname !== '/' && (
                    <button
                        onClick={goToHomePage}
                        className="rounded-md px-2 py-1 font-medium text-white/85 transition-all hover:bg-white/10 hover:text-cyan-200"
                    >
                        {backLabel}
                    </button>
                )}

                <h1 className="font-display pb-0.5 text-xl leading-[1.3] text-white sm:text-2xl">
                    UTM CampusApp
                </h1>
            </div>

            <div className="flex items-center gap-3">
                <ThemeToggle />
                {user == null ? (
                    <button
                        onClick={() => router.push('/signin')}
                        className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-white shadow-sm backdrop-blur transition-all hover:border-white/35 hover:bg-white/15 active:scale-[0.98]"
                    >
                        Sign In
                    </button>
                ) : (
                    <button
                        onClick={handleLogout}
                        className="rounded-lg border border-white/25 bg-white/10 px-4 py-2 text-white shadow-sm backdrop-blur transition-all hover:border-white/35 hover:bg-white/15 active:scale-[0.98]"
                    >
                        Sign Out
                    </button>
                )}
            </div>
        </header>
    );
}
