
import React, { useState } from "react";
import { useCart } from "../../hooks/useCart";
import {
  QrCode,
  Banknote,
  ShieldCheck,
  Loader2,
  AlertCircle,
  CreditCard,
} from "lucide-react";

import { createContract } from "../../services/api/user/contractUserService";
import { createVNPayUrl } from "../../services/api/user/paymentUserService";

interface Props {
  shippingAddress: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  purchaseType?: "cash" | "transaction";
  description?: string;
  onProcessingChange?: (processing: boolean, message: string) => void;
}

type PaymentMethod = "vnpay" | "cash" | null;

const extractContractId = (value: unknown): number | null => {
  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const id = data.id ?? data.contract_id ?? data.contractId;

  if (typeof id === "number" && Number.isInteger(id) && id > 0) {
    return id;
  }

  if (typeof id === "string" && /^\d+$/.test(id)) {
    const parsed = Number(id);
    if (parsed > 0) return parsed;
  }

  return (
    extractContractId(data.data) ??
    extractContractId(data.contract)
  );
};

const extractPaymentUrl = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }

  if (!value || typeof value !== "object") return null;

  const data = value as Record<string, unknown>;
  const url = data.paymentUrl ?? data.payment_url ?? data.url;

  if (typeof url === "string" && url.trim()) {
    return url.trim();
  }

  return extractPaymentUrl(data.data);
};

export const PaymentDepositSection: React.FC<Props> = ({
  shippingAddress,
  customerName,
  customerEmail,
  customerPhone,
  purchaseType = "cash",
  description = "Đặt cọc mua xe",
  onProcessingChange,
}) => {
  const { cartItems } = useCart();

  const [method, setMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Tạo hợp đồng và chuyển hướng sang VNPay
  const handlePayment = async () => {
    if (loading) return;

    setError("");

    if (method !== "vnpay") {
      setError(
        "Vui lòng chọn thanh toán VNPay. Thanh toán tiền mặt hiện chưa được tích hợp."
      );
      return;
    }

    if (!cartItems?.length) {
      setError("Giỏ hàng của bạn đang trống.");
      return;
    }

    if (!shippingAddress.trim()) {
      setError("Vui lòng nhập địa chỉ nhận xe.");
      return;
    }

    const vehicleIds = cartItems.map((item) =>
      Number(item.vehicle_id)
    );

    if (
      vehicleIds.some(
        (id) => !Number.isInteger(id) || id <= 0
      )
    ) {
      setError("ID xe trong giỏ hàng không hợp lệ.");
      return;
    }

    const uniqueVehicleIds = [...new Set(vehicleIds)];

    try {
      setLoading(true);
      onProcessingChange?.(true, "Đang tạo hợp đồng...");

      const contractResponse = await createContract({
        vehicle_ids: uniqueVehicleIds,
        shipping_address: shippingAddress.trim(),
        purchase_type: purchaseType,
        description: [
          description,
          customerName.trim()
            ? `Khách hàng: ${customerName.trim()}`
            : "",
          customerPhone.trim()
            ? `SĐT: ${customerPhone.trim()}`
            : "",
          customerEmail.trim()
            ? `Email: ${customerEmail.trim()}`
            : "",
        ]
          .filter(Boolean)
          .join(" | "),
      });

      const contractId = extractContractId(contractResponse);

      if (!contractId) {
        throw new Error(
          "Không lấy được ID hợp đồng từ phản hồi API."
        );
      }

      onProcessingChange?.(
        true,
        "Đang tạo liên kết thanh toán VNPay..."
      );

      const paymentResponse = await createVNPayUrl(contractId);
      const paymentUrl = extractPaymentUrl(paymentResponse);

      if (!paymentUrl) {
        throw new Error(
          "Backend không trả về URL thanh toán VNPay."
        );
      }

      const parsedUrl = new URL(paymentUrl);

      if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
      ) {
        throw new Error("URL thanh toán không hợp lệ.");
      }

      // Kiểm tra URL Return của VNPay
      const returnUrl = parsedUrl.searchParams.get("vnp_ReturnUrl");

      console.log("========== VNPAY DEBUG ==========");
      console.log("Payment URL:", parsedUrl.origin + parsedUrl.pathname);
      console.log("VNPay Return URL:", returnUrl);
      console.log("=================================");

      onProcessingChange?.(
        true,
        "Đang chuyển hướng đến VNPay..."
      );

      window.location.assign(parsedUrl.toString());
    } catch (err: unknown) {
      console.error("Payment error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Có lỗi xảy ra khi tạo thanh toán."
      );

      setLoading(false);
      onProcessingChange?.(false, "");
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* MỤC 01: XÁC NHẬN HỒ SƠ */}
      <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded bg-zinc-100 px-2 py-1 text-[10px] font-bold font-sans text-zinc-800">
            MỤC 01 / 02
          </span>

          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#b8955a]">
            Khóa số VIN
          </span>
        </div>

        <h2 className="mb-1 text-xl font-sans font-bold text-zinc-950">
          1. Xác Nhận Hồ Sơ Đặt Cọc
        </h2>

        <p className="mb-5 text-xs font-sans text-zinc-500">
          Kiểm tra thông tin trước khi tiến hành thanh toán.
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-xs font-sans text-emerald-800">
          <ShieldCheck className="size-5 shrink-0" />

          <span>
            Thông tin xe và hồ sơ đặt cọc sẽ được gửi đến hệ thống
            để tạo hợp đồng.
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex justify-between border-b border-zinc-100 pb-3 text-sm font-sans">
            <span className="text-zinc-500">
              Số xe trong giỏ hàng
            </span>

            <span className="font-semibold text-zinc-900">
              {cartItems.length} xe
            </span>
          </div>

          <div className="flex justify-between border-b border-zinc-100 pb-3 text-sm font-sans">
            <span className="text-zinc-500">
              Người đứng tên
            </span>

            <span className="max-w-[60%] text-right font-semibold text-zinc-900">
              {customerName || "Chưa cập nhật"}
            </span>
          </div>

          <div className="flex justify-between text-sm font-sans">
            <span className="text-zinc-500">
              Phương thức nhận xe
            </span>

            <span className="max-w-[60%] text-right font-semibold text-zinc-900">
              {shippingAddress || "Chưa cập nhật"}
            </span>
          </div>
        </div>
      </section>

      {/* MỤC 02: PHƯƠNG THỨC THANH TOÁN */}
      <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-xs sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded bg-zinc-100 px-2 py-1 text-[10px] font-bold font-sans text-zinc-800">
            MỤC 02 / 02
          </span>

          <span className="text-[11px] font-sans font-bold uppercase tracking-widest text-[#b8955a]">
            Ký quỹ bảo lãnh
          </span>
        </div>

        <h2 className="mb-6 text-xl font-sans font-bold text-zinc-950">
          2. Phương Thức Thanh Toán Ký Quỹ
        </h2>

        {/* LỰA CHỌN PHƯƠNG THỨC */}
        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* VNPAY */}
          <button
            type="button"
            onClick={() => {
              setMethod("vnpay");
              setError("");
            }}
            aria-pressed={method === "vnpay"}
            className={`rounded-2xl border-2 p-4 text-left transition font-sans ${
              method === "vnpay"
                ? "border-zinc-900 bg-white shadow-sm"
                : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
            }`}
          >
            <QrCode
              className={`mb-2 size-6 ${
                method === "vnpay"
                  ? "text-zinc-900"
                  : "text-zinc-400"
              }`}
            />

            <h3
              className={`text-sm font-bold font-sans ${
                method === "vnpay"
                  ? "text-zinc-900"
                  : "text-zinc-600"
              }`}
            >
              Chuyển khoản VNPay
            </h3>

            <p className="mt-1 text-[10px] font-sans text-zinc-500">
              Thanh toán trực tuyến an toàn
            </p>
          </button>

          {/* TIỀN MẶT */}
          <button
            type="button"
            onClick={() => {
              setMethod("cash");
              setError("");
            }}
            aria-pressed={method === "cash"}
            className={`rounded-2xl border-2 p-4 text-left transition font-sans ${
              method === "cash"
                ? "border-zinc-900 bg-white shadow-sm"
                : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
            }`}
          >
            <Banknote
              className={`mb-2 size-6 ${
                method === "cash"
                  ? "text-zinc-900"
                  : "text-zinc-400"
              }`}
            />

            <h3
              className={`text-sm font-bold font-sans ${
                method === "cash"
                  ? "text-zinc-900"
                  : "text-zinc-600"
              }`}
            >
              Thanh toán tiền mặt
            </h3>

            <p className="mt-1 text-[10px] font-sans text-zinc-500">
              Tại Showroom Atelier
            </p>
          </button>
        </div>

        {/* CHI TIẾT PHƯƠNG THỨC */}
        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50 p-6 font-sans">
          {!method && (
            <p className="text-center text-sm font-sans text-zinc-400">
              Vui lòng chọn một trong hai phương thức thanh toán.
            </p>
          )}

          {method === "vnpay" && (
            <div className="w-full text-center">
              <QrCode className="mx-auto mb-3 size-10 text-zinc-900" />

              <h3 className="text-sm font-bold font-sans text-zinc-900">
                Đã chọn Chuyển khoản VNPay
              </h3>

              <p className="mb-4 mt-2 text-xs font-sans leading-relaxed text-zinc-500">
                Hệ thống sẽ tạo hợp đồng, sau đó chuyển Quý khách
                đến cổng thanh toán VNPay.
              </p>

              <div className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left text-xs font-sans text-emerald-800">
                <ShieldCheck className="size-4 shrink-0" />
                Thanh toán được xử lý qua cổng VNPay.
              </div>
            </div>
          )}

          {method === "cash" && (
            <div className="w-full py-4 text-center">
              <Banknote className="mx-auto mb-3 size-10 text-zinc-300" />

              <h3 className="text-base font-bold font-sans text-zinc-900">
                Thanh toán trực tiếp bằng tiền mặt
              </h3>

              <p className="mx-auto mb-4 mt-2 max-w-sm text-xs font-sans leading-relaxed text-zinc-500">
                Quý khách vui lòng đến Atelier Lounge để thực hiện
                thủ tục đặt cọc bằng tiền mặt và ký hợp đồng.
              </p>
            </div>
          )}
        </div>

        {/* LỖI */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 text-sm font-sans text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* NÚT THANH TOÁN */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={loading || cartItems.length === 0 || method !== "vnpay"}
          className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#b8955a] px-5 py-3.5 font-sans font-semibold text-white transition hover:bg-[#a17e45] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? (
            <>
              <Loader2 className="size-5 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            <>
              <CreditCard className="size-5" />
              Xác Nhận Và Thanh Toán VNPay
            </>
          )}
        </button>
      </section>
    </div>
  );
};

export default PaymentDepositSection;
