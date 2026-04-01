import Link from 'next/link';
import { CalendarDays, Car, Dumbbell, Map, Utensils, PackageOpen } from 'lucide-react';
import Header from '../components/Header';

const apps = [
    {
        name: 'Food Availability',
        description: 'See which cafeterias are open and typical wait times.',
        href: '/food',
        icon: Utensils,
        titleGradient:
            'group-hover:bg-gradient-to-r group-hover:from-amber-500 group-hover:to-orange-500',
        accent:
            'bg-slate-200/80 text-slate-700 ring-slate-300/80 dark:bg-white/10 dark:text-zinc-200 dark:ring-white/15 group-hover:bg-gradient-to-br group-hover:from-amber-400 group-hover:to-orange-500 group-hover:text-white group-hover:ring-transparent',
    },
    {
        name: 'Gym Availability',
        description: 'Check gym occupancy and plan your workout.',
        href: '/gym',
        icon: Dumbbell,
        titleGradient:
            'group-hover:bg-gradient-to-r group-hover:from-emerald-500 group-hover:to-lime-500',
        accent:
            'bg-slate-200/80 text-slate-700 ring-slate-300/80 dark:bg-white/10 dark:text-zinc-200 dark:ring-white/15 group-hover:bg-gradient-to-br group-hover:from-emerald-400 group-hover:to-cyan-500 group-hover:text-white group-hover:ring-transparent',
    },
    {
        name: 'Parking Availability',
        description: 'Find lots with space before you arrive.',
        href: '/parking',
        icon: Car,
        titleGradient:
            'group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-sky-500',
        accent:
            'bg-slate-200/80 text-slate-700 ring-slate-300/80 dark:bg-white/10 dark:text-zinc-200 dark:ring-white/15 group-hover:bg-gradient-to-br group-hover:from-sky-400 group-hover:to-indigo-500 group-hover:text-white group-hover:ring-transparent',
    },
    {
        name: 'Event Calendar',
        description: 'View upcoming club events on campus.',
        href: '/events',
        icon: CalendarDays,
        titleGradient:
            'group-hover:bg-gradient-to-r group-hover:from-violet-500 group-hover:to-fuchsia-500',
        accent:
            'bg-slate-200/80 text-slate-700 ring-slate-300/80 dark:bg-white/10 dark:text-zinc-200 dark:ring-white/15 group-hover:bg-gradient-to-br group-hover:from-violet-400 group-hover:to-fuchsia-500 group-hover:text-white group-hover:ring-transparent',
    },
    {
        name: 'Interactive Map',
        description: 'Explore key campus buildings and jump to services inside them.',
        href: '/map',
        icon: Map,
        titleGradient:
            'group-hover:bg-gradient-to-r group-hover:from-rose-500 group-hover:to-red-500',
        accent:
            'bg-slate-200/80 text-slate-700 ring-slate-300/80 dark:bg-white/10 dark:text-zinc-200 dark:ring-white/15 group-hover:bg-gradient-to-br group-hover:from-rose-400 group-hover:to-orange-500 group-hover:text-white group-hover:ring-transparent',
    },
    {
        name: 'Lost And Found',
        description: 'See what others have lost/found on campus',
        href: '/lostandfound',
        icon: PackageOpen,
        titleGradient:
            'group-hover:bg-gradient-to-r group-hover:from-cyan-500 group-hover:to-blue-500',
        accent:
            'bg-slate-200/80 text-slate-700 ring-slate-300/80 dark:bg-white/10 dark:text-zinc-200 dark:ring-white/15 group-hover:bg-gradient-to-br group-hover:from-cyan-400 group-hover:to-blue-500 group-hover:text-white group-hover:ring-transparent',
    },
] as const;

export default function Home() {
    return (
        <div className="relative min-h-screen overflow-hidden bg-slate-100 text-slate-900 dark:bg-[#0b0c10] dark:text-zinc-100">
            <div className="pointer-events-none absolute -left-20 -top-16 h-80 w-80 rounded-full bg-white/70 blur-3xl dark:bg-white/10" />
            <div className="pointer-events-none absolute right-0 top-24 h-96 w-96 rounded-full bg-slate-300/35 blur-3xl dark:bg-zinc-600/15" />
            <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-slate-200/40 blur-3xl dark:bg-zinc-500/10" />
            <Header />

            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-white focus:px-4 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-gray-900 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 dark:focus:bg-zinc-900 dark:focus:text-zinc-100 dark:focus:ring-offset-zinc-950"
            >
                Skip to main content
            </a>

            <main id="main-content" className="relative z-10 px-4 pb-20 pt-10 sm:px-6 lg:px-8">
                <header className="mx-auto max-w-2xl text-center">
                    <p className="text-sm font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-400">
                        Campus dashboard
                    </p>
                    <h1 className="font-display mt-3 pb-1 text-balance text-3xl leading-[1.28] tracking-tight text-slate-900 transition-colors hover:bg-gradient-to-r hover:from-fuchsia-500 hover:via-cyan-500 hover:to-indigo-500 hover:bg-clip-text hover:text-transparent dark:text-zinc-100 sm:text-4xl">
                        Everything you need on campus
                    </h1>
                    <p className="mt-4 text-pretty text-lg leading-relaxed text-slate-700 sm:text-xl dark:text-zinc-400">
                        Real-time food, gym, parking, events, and campus navigation in
                        one place. Choose a service below to get started.
                    </p>
                </header>

                <section
                    className="mx-auto mt-14 max-w-5xl"
                    aria-labelledby="services-heading"
                >
                    <h2
                        id="services-heading"
                        className="font-display mb-6 pb-0.5 text-center text-base leading-[1.25] text-slate-800 dark:text-zinc-100"
                    >
                        Choose a service
                    </h2>
                    <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 lg:gap-6">
                        {apps.map((app) => {
                            const Icon = app.icon;
                            return (
                                <li key={app.name} className="min-w-0">
                                    <Link
                                        href={app.href}
                                        className="group flex h-full min-h-[13rem] flex-col rounded-3xl border border-slate-200/90 bg-white/65 p-6 shadow-[0_14px_40px_rgba(15,23,42,0.10)] outline-none backdrop-blur-xl transition-[transform,border-color,box-shadow,background] duration-200 hover:-translate-y-0.5 hover:border-cyan-300/55 hover:bg-white/75 hover:shadow-[0_20px_50px_rgba(14,116,144,0.18)] active:scale-[0.99] motion-reduce:transition-none motion-reduce:hover:transform-none dark:border-white/10 dark:bg-zinc-900/50 dark:hover:border-cyan-400/35 dark:hover:bg-zinc-900/65 dark:hover:shadow-[0_20px_50px_rgba(20,184,166,0.15)] focus-visible:border-transparent focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-cyan-400 dark:focus-visible:ring-offset-zinc-950"
                                    >
                                        <span
                                            className={`inline-flex size-11 shrink-0 items-center justify-center rounded-xl ring-1 shadow-sm ${app.accent}`}
                                            aria-hidden
                                        >
                                            <Icon className="size-5" strokeWidth={2} />
                                        </span>
                                        <span className="mt-4 flex flex-1 flex-col gap-3 pb-1.5">
                                            <span className={`font-display pt-0.5 pb-1 text-base leading-[1.45] text-slate-900 transition-all group-hover:bg-clip-text group-hover:text-transparent dark:text-zinc-100 ${app.titleGradient}`}>
                                                {app.name}
                                            </span>
                                            <span className="text-sm leading-relaxed text-slate-600 dark:text-zinc-400">
                                                {app.description}
                                            </span>
                                        </span>
                                        <span className="mt-4 flex items-center text-sm font-semibold text-slate-600 transition-colors group-hover:text-cyan-700 dark:text-zinc-400 dark:group-hover:text-cyan-300">
                                            Open
                                            <span
                                                className="ml-1 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                                                aria-hidden
                                            >
                                                →
                                            </span>
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </section>
            </main>
        </div>
    );
}
