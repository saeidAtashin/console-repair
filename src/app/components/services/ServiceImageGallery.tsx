"use client";

import { useState } from "react";
import Image from "next/image";

import ImageLightbox from "@/app/components/ui/ImageLightbox";

type Props = {
  images: string[];
  title: string;
  heading?: string;
  subtitle?: string;
};

export default function ServiceImageGallery({
  images,
  title,
  heading = "گالری تصاویر",
  subtitle,
}: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  if (images.length === 0) return null;

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-black md:text-3xl">{heading}</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          {subtitle ?? `نمونه‌هایی از کار و جزئیات مربوط به ${title}`}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {images.map((src, index) => (
          <li key={src}>
            <button
              type="button"
              onClick={() => setLightboxIndex(index)}
              aria-label={`بزرگ‌نمایی ${title} — تصویر ${index + 1}`}
              className="relative aspect-[4/3] w-full cursor-zoom-in overflow-hidden rounded-2xl border border-white/10 bg-zinc-900 p-0 text-start transition hover:border-white/20"
            >
              <Image
                src={src}
                alt={`${title} — تصویر ${index + 1}`}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition duration-500 hover:scale-105"
              />
            </button>
          </li>
        ))}
      </ul>

      {lightboxIndex != null ? (
        <ImageLightbox
          images={images}
          alt={title}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      ) : null}
    </section>
  );
}
