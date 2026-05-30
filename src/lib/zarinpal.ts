import { getSiteUrl } from "@/lib/seo/site";

const SANDBOX_BASE = "https://sandbox.zarinpal.com/pg/v4/payment";
const PRODUCTION_BASE = "https://payment.zarinpal.com/pg/v4/payment";

function getBaseUrl(): string {
  return process.env.ZARINPAL_SANDBOX === "false"
    ? PRODUCTION_BASE
    : SANDBOX_BASE;
}

function getGatewayUrl(): string {
  return process.env.ZARINPAL_SANDBOX === "false"
    ? "https://www.zarinpal.com/pg/StartPay"
    : "https://sandbox.zarinpal.com/pg/StartPay";
}

function getMerchantId(): string {
  const id = process.env.ZARINPAL_MERCHANT_ID;
  if (!id) throw new Error("ZARINPAL_MERCHANT_ID is not configured");
  return id;
}

type ZarinpalResponse = {
  data?: {
    code: number;
    message: string;
    authority?: string;
    fee_type?: string;
    fee?: number;
    ref_id?: number;
    card_pan?: string;
  };
  errors?: { code: number; message: string }[];
};

export async function requestZarinpalPayment(input: {
  amount: number;
  description: string;
  orderNumber: string;
  mobile?: string;
}): Promise<{ authority: string; paymentUrl: string }> {
  const callbackUrl = `${getSiteUrl()}/api/payment/zarinpal/verify?order=${encodeURIComponent(input.orderNumber)}`;

  const res = await fetch(`${getBaseUrl()}/request.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: getMerchantId(),
      amount: input.amount,
      description: input.description,
      callback_url: callbackUrl,
      metadata: {
        mobile: input.mobile,
        order_id: input.orderNumber,
      },
    }),
  });

  const data = (await res.json()) as ZarinpalResponse;

  if (data.data?.code !== 100 || !data.data.authority) {
    const msg =
      data.errors?.[0]?.message ??
      data.data?.message ??
      "Zarinpal request failed";
    throw new Error(msg);
  }

  return {
    authority: data.data.authority,
    paymentUrl: `${getGatewayUrl()}/${data.data.authority}`,
  };
}

export async function verifyZarinpalPayment(input: {
  authority: string;
  amount: number;
}): Promise<{ refId: string; cardPan?: string }> {
  const res = await fetch(`${getBaseUrl()}/verify.json`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      merchant_id: getMerchantId(),
      amount: input.amount,
      authority: input.authority,
    }),
  });

  const data = (await res.json()) as ZarinpalResponse;

  if (data.data?.code !== 100 && data.data?.code !== 101) {
    const msg =
      data.errors?.[0]?.message ??
      data.data?.message ??
      "Zarinpal verify failed";
    throw new Error(msg);
  }

  return {
    refId: String(data.data?.ref_id ?? ""),
    cardPan: data.data?.card_pan,
  };
}
