
export const formatCurrency = (value: number): string => {
  if (isNaN(value)) return "0 ₫";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatPayDate = (raw: string): string => {
  if (!raw || raw.length < 14) return raw || "—";

  const year = raw.substring(0, 4);
  const month = raw.substring(4, 6);
  const day = raw.substring(6, 8);
  const hour = raw.substring(8, 10);
  const minute = raw.substring(10, 12);
  const second = raw.substring(12, 14);

  return `${hour}:${minute}:${second} — ${day}/${month}/${year}`;
};

export const decodeOrderInfo = (value: string): string => {
  try {
    return decodeURIComponent(value.replace(/\+/g, " "));
  } catch {
    return value;
  }
};

export const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    "07": "Trừ tiền thành công. Giao dịch bị nghi ngờ.",
    "09": "Thẻ/Tài khoản chưa đăng ký dịch vụ InternetBanking.",
    "10": "Xác thực thông tin thẻ/tài khoản không đúng quá 3 lần.",
    "11": "Đã hết hạn chờ thanh toán.",
    "12": "Thẻ/Tài khoản bị khóa.",
    "13": "Quý khách nhập sai mật khẩu xác thực (OTP).",
    "24": "Quý khách đã hủy giao dịch.",
    "51": "Tài khoản không đủ số dư.",
    "65": "Tài khoản đã vượt quá hạn mức giao dịch trong ngày.",
    "75": "Ngân hàng thanh toán đang bảo trì.",
    "79": "Nhập sai mật khẩu thanh toán quá số lần quy định.",
    "99": "Lỗi không xác định từ hệ thống.",
  };

  return messages[code] ||
    `Giao dịch không thành công (Mã lỗi: ${code}). Vui lòng thử lại hoặc liên hệ hỗ trợ.`;
};
