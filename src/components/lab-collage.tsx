import Image from "next/image";
import magnifier from "@/assets/photos/lab-magnifier.webp";
import microscope from "@/assets/photos/lab-microscope.webp";
import samples from "@/assets/photos/lab-samples.webp";

/**
 * Researchers at work, in three overlapping photos on the brand's
 * benzene-ring motif, with capsules, tablets, an ampoule and a syringe
 * floating around them (public/illustrations/pharma-floats.svg).
 */
export function LabCollage({ alt }: { alt: string }) {
  return (
    <div className="relative mx-auto aspect-[800/880] w-full max-w-md" dir="ltr">
      <div className="absolute inset-[6%] rounded-full bg-molecule-400/15 blur-3xl" aria-hidden="true" />
      <svg viewBox="0 0 800 880" className="absolute inset-0 size-full text-molecule-400" aria-hidden="true">
        {[
          [640, 640, 60, 0.35],
          [700, 760, 48, 0.25],
          [120, 820, 44, 0.3],
          [540, 40, 40, 0.25],
        ].map(([x, y, r, o]) => (
          <g key={`${x}-${y}`} fill="none" stroke="currentColor" opacity={o}>
            <polygon strokeWidth="3" points={Array.from({ length: 6 }, (_, k) => `${x + r * Math.cos(((60 * k + 30) * Math.PI) / 180)},${y + r * Math.sin(((60 * k + 30) * Math.PI) / 180)}`).join(" ")} />
            <circle cx={x} cy={y} r={r * 0.55} strokeWidth="2" />
          </g>
        ))}
      </svg>
      <div className="absolute left-[14%] top-[4%] w-[62%] overflow-hidden rounded-[2rem] shadow-2xl shadow-vault-900/25 ring-1 ring-black/5">
        <Image src={magnifier} alt={alt} sizes="(min-width: 1024px) 280px, 62vw" placeholder="blur" className="h-auto w-full" />
      </div>
      <div className="absolute bottom-[7%] right-[2%] w-[52%] overflow-hidden rounded-3xl border-[6px] border-white shadow-xl shadow-vault-900/25">
        <Image src={microscope} alt="" sizes="(min-width: 1024px) 240px, 52vw" placeholder="blur" className="h-auto w-full" />
      </div>
      <div className="absolute right-[3%] top-[17%] aspect-square w-[30%] overflow-hidden rounded-full border-[5px] border-white shadow-xl shadow-vault-900/25">
        <Image src={samples} alt="" sizes="(min-width: 1024px) 140px, 30vw" placeholder="blur" className="size-full object-cover object-[50%_62%]" />
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element -- animated SVG; next/image would not keep its CSS animation */}
      <img src="/illustrations/pharma-floats.svg" alt="" width={800} height={880} className="pointer-events-none absolute inset-0 size-full" />
    </div>
  );
}
