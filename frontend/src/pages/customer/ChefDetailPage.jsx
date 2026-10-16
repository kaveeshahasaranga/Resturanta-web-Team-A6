import {
  ArrowLeft,
  ArrowRight,
  Clock3,
  Flame,
  MapPin,
  Star,
} from 'lucide-react';
import { useEffect } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import chefs from '../../data/chefs.json';
import Footer from '../../components/layout/Footer.jsx';
import Navbar from '../../components/layout/Navbar.jsx';

function SectionHeading({ eyebrow, children, id }) {
  return (
    <div>
      <p className="mb-2 text-xs uppercase tracking-[0.25em] text-orange-400">{eyebrow}</p>
      <h2 id={id} className="font-serif text-3xl font-semibold sm:text-4xl">{children}</h2>
    </div>
  );
}

export default function ChefDetailPage() {
  const { chefId } = useParams();
  const chefIndex = chefId ? chefs.findIndex((item) => item.id === chefId) : 0;
  const chef = chefs[chefIndex];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [chefId]);

  if (!chef) {
    return <Navigate to="/chefs" replace />;
  }

  const previousChef = chefs[(chefIndex - 1 + chefs.length) % chefs.length];
  const nextChef = chefs[(chefIndex + 1) % chefs.length];
  const profileNumber = String(chefIndex + 1).padStart(2, '0');
  const profileCount = String(chefs.length).padStart(2, '0');

  return (
    <div className="flex min-h-screen flex-col bg-[#0d0c0b] text-[#f3eee8]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pb-16 pt-24 sm:px-6 lg:px-8">
        <nav aria-label="Breadcrumb" className="text-[11px] uppercase tracking-[0.16em] text-neutral-500">
          <Link to="/" className="transition-colors hover:text-orange-400">Home</Link>
          <span className="mx-2" aria-hidden="true">/</span>
          <a href="#hearth-masters" className="transition-colors hover:text-orange-400">Hearth Masters</a>
          <span className="mx-2" aria-hidden="true">/</span>
          <span className="text-amber-400">Chef {chef.name}</span>
        </nav>

        <section className="grid gap-10 py-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-14 lg:py-10">
          <div className="relative min-h-[480px] overflow-hidden rounded border border-white/10 sm:min-h-[620px]">
            <img
              src={chef.image}
              alt={`Chef ${chef.name} in the kitchen`}
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent" />
            <div className="absolute inset-x-5 bottom-5 flex flex-wrap items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
              <div>
                <p className="mb-1 text-[10px] uppercase tracking-[0.2em] text-orange-400">
                  {chef.role} · Since {chef.since}
                </p>
                <p className="font-serif text-lg font-semibold">{chef.venue}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 rounded border border-white/15 bg-black/70 px-3 py-2 text-xs">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-hidden="true" />
                {chef.rating} · {chef.tastings} tastings
              </span>
            </div>
          </div>

          <div className="self-center">
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-orange-400">
                <Flame className="h-4 w-4" aria-hidden="true" />
                Meet the Hearth Masters
              </p>
              <span className="shrink-0 text-xs tracking-[0.2em] text-neutral-500">
                {profileNumber} / {profileCount}
              </span>
            </div>

            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[1.02] sm:text-6xl">
              {chef.firstName}
              <br />
              <em className="text-orange-400">{chef.lastName}</em>
            </h1>
            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-amber-400">{chef.title}</p>

            {chef.biography.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-5 max-w-2xl text-[15px] leading-8 text-stone-300 first:mt-7"
              >
                {paragraph}
              </p>
            ))}

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <article className="rounded border border-white/10 bg-white/[0.035] p-5">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  <Flame className="h-4 w-4 text-orange-400" aria-hidden="true" />
                  Specialty
                </p>
                <h2 className="mt-2 font-serif text-xl">{chef.specialty}</h2>
                <p className="mt-1 text-xs text-neutral-400">{chef.specialtyDescription}</p>
              </article>
              <article className="rounded border border-white/10 bg-white/[0.035] p-5">
                <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.18em] text-neutral-400">
                  <Clock3 className="h-4 w-4 text-orange-400" aria-hidden="true" />
                  Experience
                </p>
                <h2 className="mt-2 font-serif text-xl">{chef.experience}</h2>
                <p className="mt-1 text-xs text-neutral-400">{chef.experienceDescription}</p>
              </article>
            </div>

            <div className="mt-7">
              <h2 className="mb-3 text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                Cuisine Expertise
              </h2>
              <ul className="flex flex-wrap gap-2">
                {chef.expertise.map((item, index) => (
                  <li
                    key={item}
                    className={`rounded border px-3.5 py-1.5 text-xs ${
                      index < 2
                        ? 'border-orange-500/50 bg-orange-500/10 text-orange-300'
                        : 'border-white/15 bg-white/[0.03] text-stone-300'
                    }`}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/contact"
                className="inline-flex min-h-11 items-center justify-center rounded bg-orange-600 px-5 text-xs font-semibold uppercase tracking-[0.12em] text-white transition-colors hover:bg-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2 focus:ring-offset-[#0d0c0b]"
              >
                Reserve a Hearth Table
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/menu"
                className="inline-flex min-h-11 items-center justify-center rounded border border-white/15 bg-white/[0.04] px-5 text-xs font-semibold uppercase tracking-[0.12em] text-stone-200 transition-colors hover:border-orange-400/60 hover:text-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                View Signature Menu
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
          </div>
        </section>

        <section aria-labelledby="signature-creations">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <SectionHeading eyebrow="From the Hearth" id="signature-creations">
              Signature Creations
            </SectionHeading>
            <Link
              to="/menu"
              className="text-xs uppercase tracking-[0.15em] text-amber-400 transition-colors hover:text-orange-300"
            >
              View Full Menu <ArrowRight className="ml-1 inline h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {chef.dishes.map((dish) => (
              <article key={dish.name} className="overflow-hidden rounded border border-white/10 bg-white/[0.035]">
                <img src={dish.image} alt={dish.imageAlt} className="h-52 w-full object-cover" />
                <div className="p-5">
                  <div className="flex items-center justify-between gap-3 text-[10px] tracking-[0.12em] text-orange-400">
                    <span>{dish.label}</span>
                    <span className="shrink-0 text-sm font-semibold tracking-normal text-stone-100">{dish.price}</span>
                  </div>
                  <h3 className="mt-3 font-serif text-xl font-semibold">{dish.name}</h3>
                  <p className="mt-1.5 text-xs leading-6 text-neutral-400">{dish.description}</p>
                </div>
              </article>
            ))}
          </div>
        </section>

        <blockquote className="my-16 rounded border border-white/10 border-l-2 border-l-orange-500 bg-gradient-to-r from-orange-500/[0.08] to-transparent px-6 py-9 sm:px-12">
          <p className="max-w-4xl font-serif text-2xl italic leading-relaxed sm:text-[27px]">
            “{chef.quote}”
          </p>
          <cite className="mt-5 block text-[10px] not-italic tracking-[0.2em] text-amber-400">
            — CHEF {chef.name.toUpperCase()}
          </cite>
        </blockquote>

        <section id="hearth-masters" aria-labelledby="hearth-masters-title">
          <div className="mb-6">
            <SectionHeading eyebrow="Browse" id="hearth-masters-title">
              The Hearth Masters
            </SectionHeading>
          </div>

          <div className="mb-7 grid gap-4 md:grid-cols-2">
            <Link
              to={`/chefs/${previousChef.id}`}
              aria-label={`View previous chef: ${previousChef.name}`}
              className="flex items-center gap-4 rounded border border-white/10 bg-white/[0.035] p-4 transition-colors hover:border-orange-500/50"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-white/15 text-amber-400">
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </span>
              <img src={previousChef.image} alt="" className="h-14 w-14 rounded-full border border-white/15 object-cover" />
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Previous Chef</p>
                <p className="font-serif text-lg">{previousChef.name}</p>
              </div>
            </Link>
            <Link
              to={`/chefs/${nextChef.id}`}
              aria-label={`View next chef: ${nextChef.name}`}
              className="flex items-center justify-end gap-4 rounded border border-white/10 bg-white/[0.035] p-4 text-right transition-colors hover:border-orange-500/50"
            >
              <div>
                <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-400">Next Chef</p>
                <p className="font-serif text-lg">{nextChef.name}</p>
              </div>
              <img src={nextChef.image} alt="" className="h-14 w-14 rounded-full border border-white/15 object-cover" />
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded border border-white/15 text-amber-400">
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {chefs.map((item) => (
              <Link
                key={item.id}
                to={`/chefs/${item.id}`}
                aria-current={item.id === chef.id ? 'page' : undefined}
                className={`overflow-hidden rounded border bg-white/[0.035] transition-colors hover:border-orange-500/70 ${
                  item.id === chef.id
                    ? 'border-orange-500 shadow-[0_0_0_1px_rgba(249,115,22,0.65)]'
                    : 'border-white/10'
                }`}
              >
                <img src={item.image} alt="" className="h-36 w-full object-cover sm:h-40" />
                <div className="p-3">
                  <h3 className="font-serif text-sm font-semibold">{item.name}</h3>
                  <p className="mt-1 text-[11px] text-neutral-400">{item.role}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <p className="mt-8 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <MapPin className="h-4 w-4 text-orange-400" aria-hidden="true" />
          {chef.venue}, Southern Province, Sri Lanka
        </p>
      </main>

      <Footer />
    </div>
  );
}
