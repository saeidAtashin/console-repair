import type { ProductSpec } from "@/lib/shop";

type Props = {
  specifications: ProductSpec[];
  compatibility?: string[];
};

export default function ProductDetailSpecs({ specifications, compatibility }: Props) {
  return (
    <div className="space-y-8">
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <tbody>
            {specifications.map((spec, index) => (
              <tr
                key={spec.label}
                className={index % 2 === 0 ? "bg-zinc-900/40" : "bg-zinc-900/20"}
              >
                <th className="w-2/5 px-5 py-4 text-start font-medium text-zinc-400">
                  {spec.label}
                </th>
                <td className="px-5 py-4 text-zinc-200">{spec.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {compatibility && compatibility.length > 0 ? (
        <details className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
          <summary className="cursor-pointer font-bold text-white marker:content-none">
            سازگاری و پلتفرم‌های پشتیبانی‌شده
          </summary>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            {compatibility.map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400" />
                {item}
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      <details className="group rounded-2xl border border-white/10 bg-zinc-900/40 p-6">
        <summary className="cursor-pointer font-bold text-white marker:content-none">
          نکات فنی تکمیلی
        </summary>
        <div className="mt-4 space-y-3 text-sm leading-7 text-zinc-400">
          <p>
            مشخصات فوق بر اساس اطلاعات رسمی سازنده و بررسی تیم فنی فروشگاه تهیه شده است.
            در صورت نیاز به جزئیات بیشتر، با پشتیبانی تماس بگیرید.
          </p>
          <p>
            برای کنسول‌های دست‌دوم، ممکن است برخی مقادیر (مانند ظرفیت باقی‌مانده SSD یا
            ساعت کارکرد) بسته به واحد موجود در انبار متفاوت باشد.
          </p>
        </div>
      </details>
    </div>
  );
}
