import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

// Lấy ID hợp đồng từ nhiều dạng response API
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

// Lấy URL thanh toán VNPay
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

// 15 điều khoản và chính sách
const terms = [
  {
    title: "Thông tin và đặc điểm xe",
    content:
      "Khách hàng xác nhận đã tìm hiểu thông tin về thương hiệu, dòng xe, phiên bản, năm sản xuất và các thông số kỹ thuật được cung cấp trên hệ thống.",
  },
  {
    title: "Tình trạng phương tiện",
    content:
      "Tình trạng xe, trang bị, màu sắc ngoại thất và nội thất được xác nhận theo thông tin chính thức trong hồ sơ xe và hợp đồng.",
  },
  {
    title: "Giá bán phương tiện",
    content:
      "Giá bán được áp dụng theo báo giá và hợp đồng được hai bên xác nhận tại thời điểm giao dịch.",
  },
  {
    title: "Thông tin đặt cọc",
    content:
      "Khách hàng xác nhận thông tin đặt cọc và các nghĩa vụ thanh toán theo nội dung được quy định trong hợp đồng.",
  },
  {
    title: "Thông tin khách hàng",
    content:
      "Khách hàng cam kết cung cấp thông tin cá nhân, số điện thoại, email và giấy tờ cần thiết một cách chính xác.",
  },
  {
    title: "Kiểm tra xe trước khi nhận",
    content:
      "Khách hàng có trách nhiệm kiểm tra phương tiện, phụ kiện và các hạng mục bàn giao trước khi xác nhận nhận xe.",
  },
  {
    title: "Hồ sơ và giấy tờ xe",
    content:
      "Các giấy tờ liên quan đến xe được cung cấp và bàn giao theo quy định pháp luật cũng như thỏa thuận trong hợp đồng.",
  },
  {
    title: "Thời gian giao xe",
    content:
      "Thời gian giao xe dự kiến được thông báo và xác nhận bởi bên bán. Thời gian thực tế có thể phụ thuộc vào tình trạng xe và thủ tục liên quan.",
  },
  {
    title: "Địa điểm nhận xe",
    content:
      "Khách hàng xác nhận địa chỉ nhận xe đã cung cấp. Mọi thay đổi về địa chỉ cần được thông báo và thống nhất trước khi giao xe.",
  },
  {
    title: "Chi phí phát sinh",
    content:
      "Các khoản phí đăng ký, đăng kiểm, vận chuyển, bảo hiểm và chi phí khác được thực hiện theo báo giá và thỏa thuận cụ thể.",
  },
  {
    title: "Chính sách bảo hành",
    content:
      "Chính sách bảo hành được áp dụng theo điều kiện, thời hạn và phạm vi bảo hành chính thức của nhà sản xuất hoặc bên bán.",
  },
  {
    title: "Bảo dưỡng và sử dụng xe",
    content:
      "Khách hàng có trách nhiệm sử dụng, bảo dưỡng phương tiện theo hướng dẫn của nhà sản xuất để đảm bảo an toàn và quyền lợi bảo hành.",
  },
  {
    title: "Thay đổi hoặc hủy đơn hàng",
    content:
      "Việc thay đổi thông tin hoặc hủy đơn hàng được xử lý theo điều kiện và thỏa thuận được ghi nhận trong hợp đồng.",
  },
  {
    title: "Chính sách hoàn tiền",
    content:
      "Việc hoàn trả các khoản thanh toán, nếu có, được thực hiện theo điều khoản hợp đồng và chính sách áp dụng đã được hai bên xác nhận.",
  },
  {
    title: "Xác nhận và hiệu lực thỏa thuận",
    content:
      "Khách hàng xác nhận đã đọc, hiểu các nội dung trên. Quyền và nghĩa vụ cụ thể của hai bên được xác định theo hợp đồng chính thức và quy định pháp luật hiện hành.",
  },
];

export const PaymentDepositSection: React.FC<Props> = ({
  shippingAddress,
  customerName,
  customerEmail,
  customerPhone,
  purchaseType = "cash",
  description = "Đặt cọc mua xe",
  onProcessingChange,
}) => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [method, setMethod] = useState<PaymentMethod>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Trạng thái popup
  const [showTerms, setShowTerms] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [createdContractId, setCreatedContractId] = useState<number | null>(
    null
  );

  // Tạo dữ liệu hợp đồng dùng chung
  const getContractPayload = (vehicleIds: number[]) => ({
    vehicle_ids: vehicleIds,
    shipping_address: shippingAddress.trim(),
    purchase_type: method === "cash" ? "cash" : purchaseType,
    description: [
      description,
      customerName.trim() ? `Khách hàng: ${customerName.trim()}` : "",
      customerPhone.trim() ? `SĐT: ${customerPhone.trim()}` : "",
      customerEmail.trim() ? `Email: ${customerEmail.trim()}` : "",
    ]
      .filter(Boolean)
      .join(" | "),
  });

  // Kiểm tra thông tin đơn hàng
  const validateOrder = (): number[] | null => {
    if (!cartItems?.length) {
      setError("Giỏ hàng của bạn đang trống.");
      return null;
    }

    if (!shippingAddress.trim()) {
      setError("Vui lòng nhập địa chỉ nhận xe.");
      return null;
    }

    const vehicleIds = cartItems.map((item) => Number(item.vehicle_id));

    if (vehicleIds.some((id) => !Number.isInteger(id) || id <= 0)) {
      setError("ID xe trong giỏ hàng không hợp lệ.");
      return null;
    }

    return [...new Set(vehicleIds)];
  };

  // XỬ LÝ KHI KHÁCH HÀNG ĐỒNG Ý ĐIỀU KHOẢN TIỀN MẶT
  const handleCashAgreement = async () => {
    if (loading) return;

    setError("");

    const vehicleIds = validateOrder();
    if (!vehicleIds) return;

    try {
      setLoading(true);

      onProcessingChange?.(
        true,
        "Đang tạo hợp đồng thanh toán tiền mặt..."
      );

      // Chỉ gọi API tạo hợp đồng sau khi khách hàng đồng ý
      const contractResponse = await createContract(
        getContractPayload(vehicleIds)
      );

      console.log("CREATE CASH CONTRACT RESPONSE:", contractResponse);

      const contractId = extractContractId(contractResponse);

      if (!contractId) {
        throw new Error(
          "Không lấy được ID hợp đồng từ phản hồi API."
        );
      }

      setCreatedContractId(contractId);

      // Đóng popup điều khoản
      setShowTerms(false);

      // Hiện popup thành công
      setShowSuccess(true);

      onProcessingChange?.(false, "");
    } catch (err: unknown) {
      console.error("Cash contract error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Không thể tạo hợp đồng. Vui lòng thử lại."
      );

      onProcessingChange?.(false, "");
    } finally {
      setLoading(false);
    }
  };

  // XỬ LÝ NÚT XÁC NHẬN THANH TOÁN
  const handlePayment = async () => {
    if (loading) return;

    setError("");

    if (!method) {
      setError("Vui lòng chọn phương thức thanh toán.");
      return;
    }

    // TIỀN MẶT: chỉ mở popup, chưa tạo hợp đồng
    if (method === "cash") {
      const vehicleIds = validateOrder();

      if (!vehicleIds) return;

      setCreatedContractId(null);
      setShowSuccess(false);
      setShowTerms(true);

      return;
    }

    // VNPAY
    const vehicleIds = validateOrder();

    if (!vehicleIds) return;

    try {
      setLoading(true);

      onProcessingChange?.(true, "Đang tạo hợp đồng...");

      // Bước 1: Tạo hợp đồng
      const contractResponse = await createContract(
        getContractPayload(vehicleIds)
      );

      console.log("CREATE VNPAY CONTRACT RESPONSE:", contractResponse);

      const contractId = extractContractId(contractResponse);

      if (!contractId) {
        throw new Error(
          "Không lấy được ID hợp đồng từ phản hồi API."
        );
      }

      // Bước 2: Tạo URL thanh toán VNPay
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

      // Kiểm tra URL trước khi chuyển hướng
      const parsedUrl = new URL(paymentUrl);

      if (
        parsedUrl.protocol !== "https:" &&
        parsedUrl.protocol !== "http:"
      ) {
        throw new Error("URL thanh toán không hợp lệ.");
      }

      const returnUrl = parsedUrl.searchParams.get("vnp_ReturnUrl");

      console.log("========== VNPAY DEBUG ==========");
      console.log(
        "Payment URL:",
        parsedUrl.origin + parsedUrl.pathname
      );
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
      <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded bg-zinc-100 px-2 py-1 font-sans text-[10px] font-bold text-zinc-800">
            MỤC 01 / 02
          </span>

          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#b8955a]">
            Khóa số VIN
          </span>
        </div>

        <h2 className="mb-1 font-sans text-xl font-bold text-zinc-950">
          1. Xác Nhận Hồ Sơ Đặt Cọc
        </h2>

        <p className="mb-5 font-sans text-xs text-zinc-500">
          Kiểm tra thông tin trước khi tiến hành thanh toán.
        </p>

        <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 font-sans text-xs text-emerald-800">
          <ShieldCheck className="size-5 shrink-0" />

          <span>
            Thông tin xe và hồ sơ đặt cọc sẽ được gửi đến hệ thống
            để tạo hợp đồng.
          </span>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex justify-between border-b border-zinc-100 pb-3 font-sans text-sm">
            <span className="text-zinc-500">
              Số xe trong giỏ hàng
            </span>

            <span className="font-semibold text-zinc-900">
              {cartItems.length} xe
            </span>
          </div>

          <div className="flex justify-between border-b border-zinc-100 pb-3 font-sans text-sm">
            <span className="text-zinc-500">Người đứng tên</span>

            <span className="max-w-[60%] text-right font-semibold text-zinc-900">
              {customerName || "Chưa cập nhật"}
            </span>
          </div>

          <div className="flex justify-between font-sans text-sm">
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
      <section className="rounded-3xl border border-zinc-200/90 bg-white p-6 shadow-sm sm:p-8">
        <div className="mb-6 flex items-center gap-3">
          <span className="rounded bg-zinc-100 px-2 py-1 font-sans text-[10px] font-bold text-zinc-800">
            MỤC 02 / 02
          </span>

          <span className="font-sans text-[11px] font-bold uppercase tracking-widest text-[#b8955a]">
            Ký quỹ bảo lãnh
          </span>
        </div>

        <h2 className="mb-6 font-sans text-xl font-bold text-zinc-950">
          2. Phương Thức Thanh Toán Ký Quỹ
        </h2>

        <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* VNPAY */}
          <button
            type="button"
            onClick={() => {
              setMethod("vnpay");
              setError("");
            }}
            aria-pressed={method === "vnpay"}
            className={`rounded-2xl border-2 p-4 text-left font-sans transition ${method === "vnpay"
                ? "border-zinc-900 bg-white shadow-sm"
                : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
              }`}
          >
            <QrCode
              className={`mb-2 size-6 ${method === "vnpay"
                  ? "text-zinc-900"
                  : "text-zinc-400"
                }`}
            />

            <h3
              className={`font-sans text-sm font-bold ${method === "vnpay"
                  ? "text-zinc-900"
                  : "text-zinc-600"
                }`}
            >
              Chuyển khoản VNPay
            </h3>

            <p className="mt-1 font-sans text-[10px] text-zinc-500">
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
            className={`rounded-2xl border-2 p-4 text-left font-sans transition ${method === "cash"
                ? "border-zinc-900 bg-white shadow-sm"
                : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
              }`}
          >
            <Banknote
              className={`mb-2 size-6 ${method === "cash"
                  ? "text-zinc-900"
                  : "text-zinc-400"
                }`}
            />

            <h3
              className={`font-sans text-sm font-bold ${method === "cash"
                  ? "text-zinc-900"
                  : "text-zinc-600"
                }`}
            >
              Thanh toán tiền mặt
            </h3>

            <p className="mt-1 font-sans text-[10px] text-zinc-500">
              Tại Showroom Atelier
            </p>
          </button>
        </div>

        {/* CHI TIẾT PHƯƠNG THỨC */}
        <div className="flex min-h-[180px] items-center justify-center rounded-2xl border border-zinc-200/80 bg-zinc-50 p-6 font-sans">
          {!method && (
            <p className="text-center font-sans text-sm text-zinc-400">
              Vui lòng chọn một trong hai phương thức thanh toán.
            </p>
          )}

          {method === "vnpay" && (
            <div className="w-full text-center">
              <QrCode className="mx-auto mb-3 size-10 text-zinc-900" />

              <h3 className="font-sans text-sm font-bold text-zinc-900">
                Đã chọn Chuyển khoản VNPay
              </h3>

              <p className="mb-4 mt-2 font-sans text-xs leading-relaxed text-zinc-500">
                Hệ thống sẽ tạo hợp đồng, sau đó chuyển Quý khách
                đến cổng thanh toán VNPay.
              </p>

              <div className="mx-auto flex max-w-sm items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-left font-sans text-xs text-emerald-800">
                <ShieldCheck className="size-4 shrink-0" />
                Thanh toán được xử lý qua cổng VNPay.
              </div>
            </div>
          )}

          {method === "cash" && (
            <div className="w-full py-4 text-center">
              <Banknote className="mx-auto mb-3 size-10 text-zinc-300" />

              <h3 className="font-sans text-base font-bold text-zinc-900">
                Thanh toán trực tiếp bằng tiền mặt
              </h3>

              <p className="mx-auto mb-4 mt-2 max-w-sm font-sans text-xs leading-relaxed text-zinc-500">
                Quý khách vui lòng đến Atelier Lounge để thực hiện
                thủ tục đặt cọc bằng tiền mặt và ký hợp đồng.
              </p>
            </div>
          )}
        </div>

        {/* HIỂN THỊ LỖI */}
        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl bg-red-50 p-3 font-sans text-sm text-red-700">
            <AlertCircle className="mt-0.5 size-4 shrink-0" />

            <span>{error}</span>
          </div>
        )}

        {/* NÚT XÁC NHẬN */}
        <button
          type="button"
          onClick={handlePayment}
          disabled={
            loading ||
            cartItems.length === 0 ||
            method === null
          }
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

              {method === "cash"
                ? "Xác Nhận Đặt Xe"
                : "Xác Nhận Và Thanh Toán VNPay"}
            </>
          )}
        </button>
      </section>

      {/* ================================================== */}
      {/* POPUP 1: ĐIỀU KHOẢN VÀ CHÍNH SÁCH */}
      {/* ================================================== */}

      {showTerms && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/65 p-4 backdrop-blur-md"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
        >
          <div className="flex max-h-[90vh] w-full max-w-2xl animate-in zoom-in-95 flex-col overflow-hidden rounded-3xl border border-[#b8955a]/20 bg-white shadow-[0_25px_100px_rgba(0,0,0,0.3)] duration-300">
            {/* HEADER */}
            <div className="shrink-0 border-b border-zinc-100 bg-gradient-to-r from-white via-[#faf9f6] to-white px-6 py-6 sm:px-8">
              <div className="mb-3 font-sans text-[10px] font-semibold uppercase leading-relaxed tracking-[0.18em] text-[#a9854c] sm:text-[11px]">
                MERCEDES-BENZ AUTHORIZED
              </div>

              <h2
                id="terms-title"
                className="font-sans text-2xl font-semibold leading-[1.4] text-zinc-950 sm:text-3xl"
              >
                Điều khoản & Chính sách
              </h2>

              <p className="mt-2 font-sans text-xs leading-6 text-zinc-500">
                Vui lòng đọc kỹ 15 điều khoản trước khi xác nhận đặt xe.
              </p>
            </div>

            {/* NỘI DUNG */}
            <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-6 py-5 sm:px-8">
              {terms.map((term, index) => (
                <div
                  key={index}
                  className="flex gap-4 border-b border-zinc-100 pb-4 last:border-0"
                >
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#f5f1e9] font-sans text-xs font-bold tabular-nums text-[#a9854c]">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="min-w-0">
                    <h3 className="font-sans text-sm font-semibold leading-6 text-zinc-900">
                      {term.title}
                    </h3>

                    <p className="mt-1 font-sans text-xs leading-6 text-zinc-500">
                      {term.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* FOOTER */}
            <div className="shrink-0 border-t border-zinc-100 bg-[#fcfbf9] px-6 py-5 sm:px-8">
              <p className="mb-4 font-sans text-xs leading-6 text-zinc-500">
                Bằng việc nhấn nút bên dưới, Quý khách xác nhận đã đọc,
                hiểu và đồng ý với các điều khoản đặt xe được trình bày.
              </p>

              <div className="flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => setShowTerms(false)}
                  className="flex-1 rounded-xl border border-zinc-200 bg-white px-5 py-3.5 font-sans text-sm font-semibold text-zinc-600 transition-all duration-300 hover:border-zinc-400 hover:bg-zinc-50 disabled:opacity-50"
                >
                  Không đồng ý
                </button>

                <button
                  type="button"
                  disabled={loading}
                  onClick={handleCashAgreement}
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#b8955a] px-5 py-3.5 font-sans text-sm font-semibold text-white shadow-lg shadow-[#b8955a]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#a17e45] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Đang tạo hợp đồng...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="size-4" />
                      Tôi đồng ý với các điều khoản
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================================================== */}
      {/* POPUP 2: TẠO HỢP ĐỒNG THÀNH CÔNG */}
      {/* ================================================== */}

      {showSuccess && (
        <div
          className="fixed inset-0 z-[110] flex animate-in items-center justify-center bg-black/70 p-4 backdrop-blur-md fade-in duration-300"
          role="dialog"
          aria-modal="true"
          aria-labelledby="success-title"
        >
          <div className="relative w-full max-w-md animate-in zoom-in-95 slide-in-from-bottom-4 overflow-hidden rounded-[28px] border border-[#c6a66b]/30 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.35)] duration-500">
            {/* TRANG TRÍ */}
            <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#f5efe3] via-[#faf8f3] to-transparent" />

            <div className="absolute left-0 top-0 h-1 w-full bg-gradient-to-r from-[#8d6b36] via-[#d7bd85] to-[#8d6b36]" />

            <div className="relative px-7 pb-8 pt-10 text-center sm:px-9">
              {/* ICON */}
              <div className="relative mx-auto mb-7 flex size-24 items-center justify-center">
                <div className="absolute inset-0 animate-ping rounded-full border border-[#c6a66b]/30 opacity-20" />

                <div className="absolute inset-2 rounded-full border border-[#c6a66b]/40" />

                <div className="flex size-[68px] items-center justify-center rounded-full bg-gradient-to-br from-[#d9c18f] via-[#b8955a] to-[#98743d] shadow-[0_8px_25px_rgba(184,149,90,0.35)]">
                  <ShieldCheck
                    className="size-9 text-white"
                    strokeWidth={1.7}
                  />
                </div>
              </div>

              {/* THƯƠNG HIỆU */}
              <p className="mb-3 font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#a9854c]">
                MERCEDES-BENZ · ATELIER
              </p>

              {/* TIÊU ĐỀ */}
              <h2
                id="success-title"
                className="font-sans text-2xl font-semibold leading-[1.4] text-zinc-950 sm:text-3xl"
              >
                Tạo hợp đồng thành công
              </h2>

              <p className="mx-auto mt-3 max-w-xs font-sans text-sm leading-7 text-zinc-500">
                Cảm ơn Quý khách đã tin tưởng lựa chọn dịch vụ của chúng tôi.
                Thông tin đặt xe đã được ghi nhận trên hệ thống.
              </p>

              {/* MÃ HỢP ĐỒNG */}
              <div className="mt-7 rounded-2xl border border-[#e8dfce] bg-gradient-to-br from-[#faf8f3] to-[#f5f0e6] px-5 py-5">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#a9854c]">
                  Mã hợp đồng
                </p>

                <p className="mt-2 font-sans text-3xl font-semibold tabular-nums tracking-wider text-zinc-950">
                  #{createdContractId}
                </p>

                <div className="mx-auto mt-3 h-px w-12 bg-[#c6a66b]" />

                <p className="mt-3 font-sans text-xs leading-6 text-zinc-500">
                  Vui lòng lưu lại mã hợp đồng để thuận tiện tra cứu.
                </p>
              </div>

              {/* TRẠNG THÁI */}
              <div className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-emerald-50 px-4 py-3">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>

                <span className="font-sans text-xs font-medium text-emerald-800">
                  Hợp đồng đã được ghi nhận
                </span>
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowSuccess(false);
                  navigate("/order");
                }}
                className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-950 px-6 py-4 font-sans text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b8955a]"
              >
                Hoàn tất
                <ShieldCheck className="size-4" />
              </button>


              <p className="mt-5 font-sans text-[10px] leading-5 tracking-wide text-zinc-400">
                MERCEDES-BENZ · ATELIER · EXCLUSIVE AUTOMOTIVE EXPERIENCE
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentDepositSection;