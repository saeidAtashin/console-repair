"use client";

type Props = {
  caseColor?: string;
  caseMaterial?: string;
  children?: React.ReactNode;
  className?: string;
};

export default function PhoneMockupPreview({
  caseColor = "#2a2a2e",
  caseMaterial = "matte",
  children,
  className = "",
}: Props) {
  const isClear = caseMaterial === "clear";
  const isGlass = caseMaterial === "glass";

  return (
    <div className={`relative ${className}`}>
      <div
        className="relative mx-auto w-[200px] rounded-[2rem] border-[3px] p-2 shadow-2xl sm:w-[220px]"
        style={{
          borderColor: isClear ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.15)",
          backgroundColor: isClear ? "rgba(255,255,255,0.08)" : caseColor,
          backdropFilter: isClear ? "blur(4px)" : undefined,
          boxShadow: isGlass
            ? "0 0 30px rgba(6,182,212,0.15), inset 0 1px 0 rgba(255,255,255,0.2)"
            : "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div className="absolute left-1/2 top-4 z-20 h-2 w-12 -translate-x-1/2 rounded-full bg-black/60" />
        <div
          className="relative overflow-hidden rounded-[1.5rem]"
          style={{
            aspectRatio: "1/2",
            background: "linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)",
          }}
        >
          <div className="absolute inset-x-3 top-8 bottom-4 overflow-hidden rounded-xl">
            {children ?? (
              <div className="flex h-full items-center justify-center text-xs text-zinc-600">
                ناحیه طراحی
              </div>
            )}
          </div>
        </div>
        <div className="absolute -right-1 top-24 h-16 w-1 rounded-full bg-zinc-700/80" />
        <div className="absolute -right-1 top-36 h-10 w-1 rounded-full bg-zinc-700/80" />
        <div className="absolute -left-1 top-28 h-14 w-1 rounded-full bg-zinc-700/80" />
      </div>
    </div>
  );
}
