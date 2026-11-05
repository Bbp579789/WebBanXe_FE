
import { useEffect, useState } from "react";
import type {
  AdminOrder,
  AdminOrderStatus,
} from "../../types/adminOrder.types";

type OrderStatus = Exclude<AdminOrderStatus, "all">;
type TimelineStep = 1 | 2 | 3 | 4;

interface UseOrderDetailProps {
  order: AdminOrder | null;
  onUpdateStatus: (
    orderId: string,
    newStatus: OrderStatus,
    timelineStep: TimelineStep
  ) => void;
}

const getTimelineStep = (status: OrderStatus): TimelineStep => {
  switch (status) {
    case "cancelled":
      return 1;
    case "deposited":
      return 2;
    case "delivering":
      return 3;
    case "completed":
      return 4;
    default:
      return 1;
  }
};

export const useOrderDetail = ({
  order,
  onUpdateStatus,
}: UseOrderDetailProps) => {
  const [selectedStatus, setSelectedStatus] =
    useState<OrderStatus>("deposited");

  const [selectedTimelineStep, setSelectedTimelineStep] =
    useState<TimelineStep>(2);

  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!order) return;

    setSelectedStatus(order.status);
    setSelectedTimelineStep(order.timelineStep);
    setShowToast(false);
  }, [order]);

  useEffect(() => {
    if (!showToast) return;

    const timer = window.setTimeout(() => {
      setShowToast(false);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [showToast]);

  const handleStatusChange = (status: OrderStatus) => {
    setSelectedStatus(status);
    setSelectedTimelineStep(getTimelineStep(status));
  };

  const handleTimelineChange = (step: TimelineStep) => {
    setSelectedTimelineStep(step);
  };

  const handleSaveStatus = () => {
    if (!order) return;

    onUpdateStatus(
      order.id,
      selectedStatus,
      selectedTimelineStep
    );

    setShowToast(true);
  };

  return {
    selectedStatus,
    selectedTimelineStep,
    showToast,
    handleStatusChange,
    handleTimelineChange,
    handleSaveStatus,
  };
};
