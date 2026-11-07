
import {
  useCallback,
  useEffect,
  useState,
  type ChangeEvent,
} from "react";
import { useParams } from "react-router-dom";

import { getVehicleById } from "../services/api/user/vehicleService";
import { createContract } from "../services/api/user/contractUserService";
import { createVNPayUrl } from "../services/api/user/paymentUserService";

import type { Vehicle } from "../types";
import type {
  CustomerForm,
  FormErrors,
  PaymentMethod,
} from "../types/checkout";

import {
  getContractId,
  getPaymentUrl,
} from "../utils/checkout";

const initialForm: CustomerForm = {
  customer_name: "",
  phone: "",
  email: "",
  note: "",
};

export const useCheckout = () => {
  const { vehicle_id } = useParams<{ vehicle_id: string }>();

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [loadingVehicle, setLoadingVehicle] = useState(true);
  const [vehicleError, setVehicleError] = useState<string | null>(null);

  const [form, setForm] = useState<CustomerForm>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});

  const [paymentMethod, setPaymentMethod] =
    useState<PaymentMethod>("vnpay");

  const [isProcessing, setIsProcessing] = useState(false);
  const [processingMessage, setProcessingMessage] = useState("");

  // =========================================
  // 1. Lấy thông tin xe
  // =========================================
  useEffect(() => {
    let isMounted = true;

    const fetchVehicle = async () => {
      if (!vehicle_id || !/^\d+$/.test(vehicle_id)) {
        setVehicleError("Mã xe trong đường dẫn không hợp lệ.");
        setLoadingVehicle(false);
        return;
      }

      try {
        setLoadingVehicle(true);
        setVehicleError(null);

        const result = await getVehicleById(Number(vehicle_id));

        if (isMounted) {
          setVehicle(result);
        }
      } catch (error) {
        console.error("Lỗi tải thông tin xe:", error);

        if (isMounted) {
          setVehicleError(
            "Không thể tải thông tin xe. Vui lòng thử lại."
          );
        }
      } finally {
        if (isMounted) {
          setLoadingVehicle(false);
        }
      }
    };

    fetchVehicle();

    return () => {
      isMounted = false;
    };
  }, [vehicle_id]);

  // =========================================
  // 2. Lấy thông tin khách hàng từ localStorage
  // =========================================
  useEffect(() => {
    setForm((current) => ({
      ...current,
      customer_name:
        localStorage.getItem("userName") || current.customer_name,
      email:
        localStorage.getItem("userEmail") || current.email,
      phone:
        localStorage.getItem("userPhone") || current.phone,
    }));
  }, []);

  // =========================================
  // 3. Validate form
  // =========================================
  const validateForm = useCallback(() => {
    const nextErrors: FormErrors = {};

    if (!form.customer_name.trim()) {
      nextErrors.customer_name = "Vui lòng nhập họ và tên.";
    }

    const phone = form.phone.replace(/\s/g, "");

    if (!phone) {
      nextErrors.phone = "Vui lòng nhập số điện thoại.";
    } else if (!/^(0|\+84)\d{9,10}$/.test(phone)) {
      nextErrors.phone = "Số điện thoại không hợp lệ.";
    }

    const email = form.email.trim();

    if (!email) {
      nextErrors.email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Email không hợp lệ.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }, [form]);

  // =========================================
  // 4. Xử lý thay đổi input
  // =========================================
  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((current) => ({
        ...current,
        [name]: undefined,
      }));
    }
  };

  // =========================================
  // 5. Thanh toán bằng VNPay
  // =========================================
  const handleVNPayCheckout = async () => {
    if (isProcessing) return;

    if (!validateForm()) return;

    if (!vehicle || !vehicle_id) {
      alert("Không tìm thấy thông tin xe.");
      return;
    }

    setIsProcessing(true);

    try {
      // BƯỚC 1: Tạo hợp đồng
      setProcessingMessage("Đang tạo hợp đồng đặt cọc...");

      const contractResponse = await createContract({
        vehicle_ids: [Number(vehicle_id)],
        shipping_address:
          form.note.trim() || "Nhận xe tại đại lý",
        purchase_type: "cash",
        description: `Đặt cọc ${vehicle.year} ${vehicle.brand} ${vehicle.model}`,
      });

      // BƯỚC 2: Lấy contractId
      const contractId = getContractId(contractResponse);

      if (!contractId || contractId <= 0) {
        throw new Error(
          "Tạo hợp đồng thành công nhưng không lấy được mã hợp đồng."
        );
      }

      // BƯỚC 3: Tạo URL thanh toán VNPay
      setProcessingMessage("Đang kết nối cổng thanh toán VNPay...");

      const paymentResponse = await createVNPayUrl(contractId);

      // BƯỚC 4: Lấy payment URL
      const paymentUrl = getPaymentUrl(paymentResponse);

      if (!paymentUrl) {
        throw new Error("Không nhận được URL thanh toán VNPay.");
      }

      // Kiểm tra URL hợp lệ
      let parsedUrl: URL;

      try {
        parsedUrl = new URL(paymentUrl);
      } catch {
        throw new Error("URL thanh toán VNPay không hợp lệ.");
      }

      if (parsedUrl.protocol !== "https:") {
        throw new Error("URL thanh toán không an toàn.");
      }

      // BƯỚC 5: Chuyển hướng sang VNPay
      setProcessingMessage("Đang chuyển hướng đến VNPay...");

      window.location.assign(parsedUrl.toString());
    } catch (error) {
      console.error("Lỗi thanh toán VNPay:", error);

      alert(
        error instanceof Error
          ? error.message
          : "Đã xảy ra lỗi trong quá trình thanh toán."
      );

      setIsProcessing(false);
      setProcessingMessage("");
    }
  };

  // =========================================
  // 6. Thanh toán chuyển khoản trực tiếp
  // =========================================
  const handleBankTransfer = () => {
    if (isProcessing) return;

    if (!validateForm()) return;

    alert(
      "Vui lòng liên hệ đại lý Mercedes-Benz gần nhất để hoàn tất thủ tục chuyển khoản trực tiếp.\n\nHotline: 1900 xxxx"
    );
  };

  // =========================================
  // 7. Return
  // =========================================
  return {
    vehicle,
    vehicle_id,

    loadingVehicle,
    vehicleError,

    form,
    errors,

    paymentMethod,
    setPaymentMethod,

    isProcessing,
    processingMessage,

    handleInputChange,
    handleVNPayCheckout,
    handleBankTransfer,
  };
};
