import { useNavigate } from "react-router-dom";
import { useCheckout } from "../../hooks/useCheckout";
import { CheckoutHeaderSection } from "../../sections/checkout/CheckoutHeaderSection";
import { CheckoutLoading, CheckoutError, CheckoutProcessingOverlay } from "../../sections/checkout/CheckoutStates";
import { VehicleInfoSection } from "../../sections/checkout/VehicleInfoSection";
import { CustomerInfoSection } from "../../sections/checkout/CustomerInfoSection";
import { PaymentMethodSection } from "../../sections/checkout/PaymentMethodSection";
import { CheckoutSummarySection } from "../../sections/checkout/CheckoutSummarySection";

export const CheckoutPage = () => {
  const navigate = useNavigate();
  const checkout = useCheckout();

  if (checkout.loadingVehicle) return <CheckoutLoading />;

  if (checkout.vehicleError || !checkout.vehicle) {
    return (
      <CheckoutError
        message={checkout.vehicleError || "Chiếc xe bạn đang tìm không tồn tại hoặc đã được bán."}
        onBack={() => navigate("/vehicles")}
      />
    );
  }

  return (
    <>
      {checkout.isProcessing && (
        <CheckoutProcessingOverlay message={checkout.processingMessage} />
      )}

      <div className="min-h-screen bg-zinc-950 text-white select-none">
        <CheckoutHeaderSection />

        <main className="max-w-7xl mx-auto px-6 sm:px-10 py-10 sm:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-7 space-y-8">
              <VehicleInfoSection vehicle={checkout.vehicle} />
              <CustomerInfoSection
                form={checkout.form}
                errors={checkout.errors}
                onChange={checkout.handleInputChange}
              />
              <PaymentMethodSection
                value={checkout.paymentMethod}
                onChange={checkout.setPaymentMethod}
              />
            </div>

            <div className="lg:col-span-5">
              <CheckoutSummarySection
                vehicle={checkout.vehicle}
                paymentMethod={checkout.paymentMethod}
                isProcessing={checkout.isProcessing}
                onVNPay={checkout.handleVNPayCheckout}
                onBankTransfer={checkout.handleBankTransfer}
                onBack={() => navigate(-1)}
              />
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

export default CheckoutPage;
