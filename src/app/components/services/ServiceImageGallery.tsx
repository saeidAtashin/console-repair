import Image from "next/image";

type Props = {
  images: string[];
  title: string;
};

export default function ServiceImageGallery({ images, title }: Props) {
  if (images.length === 0) return null;

  return (
    <section className="container mx-auto px-6 py-16">
      <div className="mb-8">
        <h2 className="text-2xl font-black md:text-3xl">گالری تصاویر</h2>
        <p className="mt-3 max-w-2xl text-zinc-400">
          نمونه‌هایی از کار و جزئیات مربوط به {title}
        </p>
      </div>
      <ul className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-4">
        {images.map((src) => (
          <li
            key={src}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-white/10 bg-zinc-900"
          >
            <Image
              src={src}
              alt=""
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition duration-500 hover:scale-105"
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
