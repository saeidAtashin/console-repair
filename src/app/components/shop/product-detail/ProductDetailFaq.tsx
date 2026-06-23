import type { ProductFaq } from "@/lib/shop";

type Props = {
  faqs: ProductFaq[];
};

export default function ProductDetailFaq({ faqs }: Props) {
  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <details
          key={index}
          className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-6"
        >
          <summary className="cursor-pointer font-bold text-white marker:content-none">
            {faq.question}
          </summary>
          <p className="mt-4 leading-8 text-zinc-400">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
}
