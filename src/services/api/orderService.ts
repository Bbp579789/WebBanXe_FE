
export interface VehicleDTO {
  id: number;
  vin: string;
  engine_no: string;
  brand: string;
  model: string;
  year: number;
  exterior_color: string;
  interior_color: string;
  price: number;
  image?: string;
  name?: string;
}

export interface ContractDetailDTO {
  id: number;
  contract_id: number;
  vehicle_id: number;
  quantity: number;
  unit_price: number;
  vehicle: VehicleDTO;
}

export interface PaymentTransactionDTO {
  id: number;
  receipt_code: string;
  round: number;
  amount: number;
  method: string;
  status: string;
  paid_at: string;
}

export interface ContractDTO {
  id: number;
  user_id: number;
  shipping_address: string;
  purchase_type: string;
  total_amount: number;
  contract_status:
    | 'DEPOSIT'
    | 'TRANSIT'
    | 'DELIVERED'
    | 'CANCELLED';
  delivery_state: string;
  signed_at: string;
  delivery_date: string;
  created_at: string;
  details: ContractDetailDTO[];
  transactions: PaymentTransactionDTO[];
}

export interface Order {
  id: string;
  date: string;
  value: string;
  depositPaid?: string;
  finalInvoiced?: string;
  status: 'deposit' | 'transit' | 'delivered' | 'cancelled';
  vehicle: {
    name: string;
    image: string;
    vin: string;
    spec: string;
    qty: number;
  };
  deliveryInfo: {
    text: string;
    actionType: 'text-link' | 'button' | 'none';
    actionText?: string;
  };
}

const ORDER_PREFIX = 'valoir_orders_';

const getCurrentUser = (): string | null => {
  if (typeof localStorage === 'undefined') return null;

  const userName = localStorage.getItem('userName');
  return userName?.trim() || null;
};

const getOrderKey = (): string | null => {
  const userName = getCurrentUser();
  return userName ? `${ORDER_PREFIX}${userName}` : null;
};

const formatCurrency = (amount: number): string =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

const readContracts = (key: string): ContractDTO[] => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];

    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed as ContractDTO[] : [];
  } catch (error) {
    console.error('Không thể đọc danh sách đơn hàng:', error);
    return [];
  }
};

export const orderService = {
  getOrderKey,

  // Tạo đơn hàng sau khi thanh toán thành công.
  createOrder: (
    cartItems: any[],
    paymentMethod: string,
    totalAmount: number
  ): ContractDTO | null => {
    const key = getOrderKey();

    if (!key) {
      console.error(
        'Không tạo được đơn hàng: localStorage chưa có userName.'
      );
      return null;
    }

    if (!Array.isArray(cartItems) || cartItems.length === 0) {
      console.error('Không tạo được đơn hàng: giỏ hàng đang trống.');
      return null;
    }

    if (!Number.isFinite(totalAmount) || totalAmount < 0) {
      console.error('Tổng tiền đơn hàng không hợp lệ.');
      return null;
    }

    const now = new Date();
    const contractId = Date.now();

    const details: ContractDetailDTO[] = cartItems.map(
      (item, index) => {
        const vehicle = item?.vehicle || item?.car || item;

        return {
          id: contractId + index + 1,
          contract_id: contractId,
          vehicle_id: Number(vehicle?.id) || 1,
          quantity: Math.max(1, Number(item?.quantity) || 1),
          unit_price: Number(vehicle?.price) || 0,
          vehicle: {
            id: Number(vehicle?.id) || 1,
            vin: vehicle?.vin || '',
            engine_no: vehicle?.engine_no || '',
            brand: vehicle?.brand || 'Vehicle',
            model: vehicle?.model || '',
            year: Number(vehicle?.year) || 2024,
            exterior_color: vehicle?.exterior_color || '',
            interior_color: vehicle?.interior_color || '',
            price: Number(vehicle?.price) || 0,
            image: vehicle?.image || '',
            name:
              vehicle?.name ||
              `${vehicle?.year || 2024} ${vehicle?.brand || 'Vehicle'} ${vehicle?.model || ''}`.trim(),
          },
        };
      }
    );

    const newContract: ContractDTO = {
      id: contractId,
      user_id: 1,
      shipping_address: 'Atelier Lounge, TP.HCM',
      purchase_type: paymentMethod,
      total_amount: totalAmount,
      contract_status: 'DEPOSIT',
      delivery_state: 'PROCESSING',
      signed_at: now.toISOString(),
      delivery_date: new Date(
        now.getTime() + 14 * 24 * 60 * 60 * 1000
      ).toISOString(),
      created_at: now.toISOString(),
      details,
      transactions: [
        {
          id: contractId,
          receipt_code: `VN_DEP_${String(contractId).slice(-4)}`,
          round: 1,
          amount: totalAmount * 0.1,
          method: paymentMethod,
          status: 'SUCCESS',
          paid_at: now.toISOString(),
        },
      ],
    };

    try {
      const contracts = readContracts(key);
      contracts.unshift(newContract);

      localStorage.setItem(key, JSON.stringify(contracts));

      // Đọc lại để kiểm tra dữ liệu đã được ghi.
      const savedContracts = readContracts(key);
      const savedOrder = savedContracts.find(
        (contract) => contract.id === contractId
      );

      if (!savedOrder) {
        console.error('Không tìm thấy đơn hàng sau khi lưu.');
        return null;
      }

      console.log('Tạo đơn hàng thành công:', savedOrder);

      // Phát sự kiện để các component khác cập nhật danh sách.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(
          new CustomEvent('valoir:orders-updated')
        );
      }

      return savedOrder;
    } catch (error) {
      console.error('Lỗi khi lưu đơn hàng:', error);
      return null;
    }
  },

  // Lấy danh sách đơn hàng của user hiện tại.
  getOrdersForCurrentUser: async (): Promise<Order[]> => {
    const key = getOrderKey();

    if (!key) {
      console.warn(
        'Không thể tải đơn hàng vì chưa có userName.'
      );
      return [];
    }

    return readContracts(key).map(orderService.mapContractToUI);
  },

  // Lấy dữ liệu hợp đồng gốc nếu cần trang chi tiết.
  getContractsForCurrentUser: (): ContractDTO[] => {
    const key = getOrderKey();
    if (!key) return [];

    return readContracts(key);
  },

  // Chuyển hợp đồng thành dữ liệu giao diện.
  mapContractToUI: (contract: ContractDTO): Order => {
    const firstDetail = contract.details?.[0];
    const car = firstDetail?.vehicle;

    const depositTransaction = contract.transactions?.find(
      (transaction) => transaction.round === 1
    );

    const statusMap: Record<
      ContractDTO['contract_status'],
      Order['status']
    > = {
      DEPOSIT: 'deposit',
      TRANSIT: 'transit',
      DELIVERED: 'delivered',
      CANCELLED: 'cancelled',
    };

    const deliveryDate = contract.delivery_date
      ? new Date(contract.delivery_date)
      : null;

    const createdDate = contract.created_at
      ? new Date(contract.created_at)
      : new Date();

    const validDate = (date: Date | null): boolean =>
      date !== null && !Number.isNaN(date.getTime());

    return {
      id: `#VL-AUTO-${String(contract.id).slice(-4)}`,
      date: createdDate.toLocaleDateString('vi-VN'),
      value: formatCurrency(contract.total_amount),

      depositPaid: depositTransaction
        ? formatCurrency(depositTransaction.amount)
        : undefined,

      finalInvoiced:
        contract.contract_status === 'DELIVERED'
          ? formatCurrency(contract.total_amount)
          : undefined,

      status: statusMap[contract.contract_status] || 'deposit',

      vehicle: {
        name:
          car?.name ||
          `${car?.year || 2024} ${car?.brand || 'Vehicle'} ${car?.model || ''}`.trim(),

        image:
          car?.image ||
          'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?q=80&w=800&auto=format&fit=crop',

        vin: car?.vin || `VIN-${contract.id}`,

        spec: car?.exterior_color
          ? `${car.exterior_color}, ${car.interior_color || 'Interior N/A'}`
          : 'Full Option Package',

        qty: firstDetail?.quantity || 1,
      },

      deliveryInfo: {
        text:
          `Giao xe dự kiến: ${
            validDate(deliveryDate)
              ? deliveryDate!.toLocaleDateString('vi-VN')
              : 'Đang cập nhật'
          } • Tại: ${contract.shipping_address || 'Đang cập nhật'}`,

        actionType: 'text-link',
        actionText: 'THEO DÕI VẬN CHUYỂN →',
      },
    };
  },
};
