import { Icon } from "./Icon";
import type { Service } from "@/lib/types";

export function ServicesGrid({ services }: { services: Service[] }) {
  const items = Array.isArray(services) ? services : [];

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((service) => (
        <div
          key={service.title}
          className="card flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-teal/40"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal/10 text-teal-dark">
            <Icon name={service.icon} width={22} height={22} />
          </div>
          <h3 className="mt-5 font-display text-xl font-semibold">
            {service.title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-ink-soft">
            {service.description}
          </p>

          {Array.isArray(service.features) && service.features.length > 0 && (
            <ul className="mt-4 space-y-2">
              {service.features.map((f) => (
                <li
                  key={f}
                  className="flex items-start gap-2 text-sm text-ink-soft"
                >
                  <Icon
                    name="check"
                    className="mt-0.5 shrink-0 text-teal"
                    width={16}
                    height={16}
                  />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="mt-auto flex items-center justify-between pt-6">
            <span className="font-mono text-sm font-semibold text-teal-dark">
              {service.price}
            </span>
            <span className="text-xs text-ink-soft">Fixed scope</span>
          </div>
        </div>
      ))}
    </div>
  );
}
