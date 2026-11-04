export const formatCurrency = (value: number | string): string => {
  const amount = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(amount)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
};

export const getContractId = (response: any): number => {
  const rawId =
    response?.data?.id ??
    response?.data?.contract_id ??
    response?.id ??
    response?.contract_id;

  const id = Number(rawId);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error("Không lấy được mã hợp đồng từ backend.");
  }
  return id;
};

export const getPaymentUrl = (response: any): string => {
  const data = response?.data ?? response;
  const url =
    typeof data === "string"
      ? data
      : data?.paymentUrl ?? data?.payment_url ?? data?.url;

  if (typeof url !== "string" || !url.trim()) {
    throw new Error("Không nhận được URL thanh toán VNPAY.");
  }
  return url;
};
