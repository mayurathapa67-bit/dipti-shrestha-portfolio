"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icon } from "./Icon";
import type { Testimonial } from "@/lib/types";

export function TestimonialsCarousel({
  testimonials,
}: {
  testimonials: Testimonial[];
}) {
  const items = Array.isArray(testimonials) ? testimonials : [];
  const [index, setIndex] = useState(0);

  if (items.length === 0) return null;

  const go = (dir: number) => {
    setIndex((prev) => (prev + dir + items.length) % items.length);
  };

  const current = items[index];

  return (
    <div className="relative mx-auto max-w-3xl text-center">
      <Icon
        name="quote"
        className="mx-auto h-10 w-10 fill-teal/20 text-teal"
      />
      <AnimatePresence mode="wait">
        <motion.figure
          key={index}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -16 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="mt-6"
        >
          <blockquote className="font-display text-2xl font-medium leading-snug text-ink md:text-3xl">
            “{current.quote}”
          </blockquote>
          <figcaption className="mt-8 flex items-center justify-center gap-3">
            {current.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={current.avatar}
                alt={current.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal/10 font-semibold text-teal-dark">
                {current.name.charAt(0)}
              </div>
            )}
            <div className="text-left">
              <p className="font-semibold text-ink">{current.name}</p>
              <p className="text-sm text-ink-soft">
                {current.role}, {current.company}
              </p>
            </div>
          </figcaption>
        </motion.figure>
      </AnimatePresence>

      {items.length > 1 && (
        <div className="mt-8 flex items-center justify-center gap-3">
          <button
            type="button"
            aria-label="Previous testimonial"
            onClick={() => go(-1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-teal hover:text-teal-dark"
          >
            <Icon name="arrow" className="rotate-180" />
          </button>
          <div className="flex gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-teal" : "w-2 bg-line"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            aria-label="Next testimonial"
            onClick={() => go(1)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-line transition-colors hover:border-teal hover:text-teal-dark"
          >
            <Icon name="arrow" />
          </button>
        </div>
      )}
    </div>
  );
}
