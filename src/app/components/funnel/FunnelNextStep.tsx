import Link from "next/link";

type FunnelAction = {
  href: string;
  label: string;
  primary?: boolean;
};

type Props = {
  eyebrow?: string;
  title: string;
  description: string;
  actions: FunnelAction[];
};

export default function FunnelNextStep({
  eyebrow = "قدم بعدی فیکس‌بازی",
  title,
  description,
  actions,
}: Props) {
  if (actions.length === 0) return null;

  return (
    <section
      className="rounded-3xl border border-cyan-400/25 bg-gradient-to-b from-cyan-500/10 to-transparent p-6 sm:p-8"
      aria-labelledby="funnel-next-title"
    >
      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-cyan-300">
        {eyebrow}
      </p>
      <h2 id="funnel-next-title" className="text-2xl font-black text-white">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
        {description}
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        {actions.map((action) => (
          <Link
            key={action.href}
            href={action.href}
            className={
              action.primary
                ? "inline-flex items-center justify-center rounded-2xl bg-cyan-500 px-6 py-3.5 text-sm font-bold text-black transition hover:bg-cyan-400"
                : "inline-flex items-center justify-center rounded-2xl border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-bold text-white transition hover:border-cyan-400/40"
            }
          >
            {action.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
