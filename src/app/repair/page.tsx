import { redirect } from "next/navigation";

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RepairRedirectPage({ searchParams }: Props) {
  const params = await searchParams;
  const query = new URLSearchParams();

  const consoleParam = params.console;
  const consoleVal = Array.isArray(consoleParam)
    ? consoleParam[0]
    : consoleParam;

  if (consoleVal) {
    const map: Record<string, string> = {
      ps5: "cnc-wood-cutting",
      ps4: "cnc-wood-cutting",
      xbox: "cnc-milling",
    };
    const service = map[consoleVal] ?? "cnc-wood-cutting";
    query.set("service", service);
  }

  for (const key of ["issue", "description", "service", "product", "material"]) {
    const val = params[key];
    const str = Array.isArray(val) ? val[0] : val;
    if (str) query.set(key, str);
  }

  const qs = query.toString();
  redirect(qs ? `/order?${qs}` : "/order");
}
