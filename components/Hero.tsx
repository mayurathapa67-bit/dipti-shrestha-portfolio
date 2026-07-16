"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Icon } from "./Icon";
import type { HeroContent } from "@/lib/types";

export function Hero({ hero }: { hero: HeroContent }) {
  const stats = Array.isArray(hero.stats) ? hero.stats : [];

  return (
    <section className="relative overflow-hidden border-b border-line">
      <div className="pointer-events-none absolute -right-40 -top-40 h-[36rem] w-[36rem] rounded-full bg-teal/5 blur-3xl" />
      <div className="container-editorial grid items-center gap-12 py-20 md:grid-cols-2 md:py-28">
        <div>
          <motion.span
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="tag tag-teal"
          >
            {hero.role}
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl"
          >
            Clarity Through
            <br />
            <span className="text-teal">Technical Excellence</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.12 }}
            className="mt-6 max-w-md text-lg leading-7 text-ink-soft"
          >
            {hero.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.18 }}
            className="mt-9 flex flex-wrap gap-3"
          >
            <Link href="/portfolio" className="btn btn-primary">
              {hero.cta_primary}
              <Icon name="arrow" />
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              {hero.cta_secondary}
            </Link>
          </motion.div>

          {stats.length > 0 && (
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.28 }}
              className="mt-12 grid max-w-md grid-cols-3 gap-6 border-t border-line pt-8"
            >
              {stats.map((stat) => (
                <div key={stat.label}>
                  <dt className="font-display text-3xl font-semibold text-ink md:text-4xl">
                    {stat.value}
                  </dt>
                  <dd className="mt-1 text-xs leading-5 text-ink-soft">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </motion.dl>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="relative"
        >
          {hero.image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={hero.image}
              alt={hero.title}
              className="aspect-[4/5] w-full rounded-2xl object-cover shadow-soft"
            />
          ) : (
            <div className="aspect-[4/5] w-full rounded-2xl bg-gradient-to-br from-ink to-teal-dark" />
          )}
          <div className="absolute -bottom-5 -left-5 hidden rounded-xl border border-line bg-paper px-5 py-4 shadow-soft sm:block">
            <p className="font-mono text-xs text-ink-soft">Currently</p>
            <p className="font-display text-lg font-semibold">
              Open for projects
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
