import type { ClientLogo } from "@/lib/types";

export function ClientLogos({ clients }: { clients: ClientLogo[] }) {
  const items = Array.isArray(clients) ? clients : [];
  if (items.length === 0) return null;

  const doubled = [...items, ...items];

  return (
    <div className="relative overflow-hidden py-2">
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-paper to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-paper to-transparent" />
      <div className="animate-marquee flex w-max items-center gap-14">
        {doubled.map((client, i) => (
          <div
            key={`${client.name}-${i}`}
            className="flex shrink-0 items-center gap-2 text-ink-soft/70"
          >
            <span className="font-display text-xl font-semibold tracking-tight">
              {client.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
