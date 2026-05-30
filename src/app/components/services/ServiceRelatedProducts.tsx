"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ChevronLeft } from "lucide-react";

import "./rdr-common-issues.css";

type Product = {
  slug: string;
  title: string;
};

type ServiceRelatedProductsProps = {
  products: Product[];
};

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.14, delayChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 28, filter: "blur(6px)" },
  show: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: [0.16, 1, 0.3, 1] as const },
  },
};

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <motion.div variants={itemVariants}>
      <Link
        href={`/products/${product.slug}`}
        className="group relative block overflow-hidden rounded-sm border border-orange-500/10 bg-[linear-gradient(135deg,rgba(28,22,18,0.96),rgba(12,10,9,0.98))] p-6 shadow-[inset_0_1px_0_rgba(232,220,196,0.04),0_12px_40px_rgba(0,0,0,0.45)] transition-[border-color,box-shadow,transform] duration-700 hover:-translate-y-0.5 hover:border-orange-500/35"
      >
        <div className="relative z-10 flex items-start gap-5">
          <span className="font-mono text-[10px] tracking-[0.18em] text-orange-500/45">
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold leading-8 text-[#e8dcc4] group-hover:text-orange-200">
              {product.title}
            </h3>
            <span className="mt-4 inline-flex items-center gap-2 text-xs uppercase tracking-[0.22em] text-orange-500/80 group-hover:text-orange-400">
              مشاهده قیمت
              <ChevronLeft className="h-3.5 w-3.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

export default function ServiceRelatedProducts({
  products,
}: ServiceRelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="relative overflow-hidden border-y border-orange-500/10 bg-[#0a0908]">
      <div className="container relative mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-14 max-w-3xl"
        >
          <h2 className="text-3xl font-black text-[#f0e6d6] md:text-4xl">
            محصولات مرتبط
          </h2>
          <p className="mt-4 text-base leading-8 text-[#a89880]">
            محصولات این دسته با قیمت روز بازار
          </p>
        </motion.div>

        <motion.div
          variants={listVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid gap-4 md:grid-cols-2"
        >
          {products.map((product, index) => (
            <ProductCard key={product.slug} product={product} index={index} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
