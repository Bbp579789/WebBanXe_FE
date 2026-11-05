
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  LayoutDashboard,
  Eye,
  FileText,
  CheckCircle2,
  Truck,
  Clock,
  XCircle,
} from 'lucide-react';

import type {
  AdminOrder,
  AdminOrderStatus,
} from '../../types/adminOrder.types';

import { ORDER_STATUS_CONFIG } from '../../data/adminOrdersData';
import { contractService } from '../../services/api/admin/adminContractService';
import type { Contract } from '../../types/adminContract.types';
import { OrderDetailDrawer } from '../../sections/admin/orders/OrderDetailDrawer';

// ============================================================
// HELPERS
// ============================================================

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);
};

// Trả về YYYY-MM-DD để phục vụ lọc ngày.
const formatDate = (value?: string) => {
  if (!value) return '';

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

const displayDate = (value?: string) => {
  const date = formatDate(value);

  if (!date) return 'Chưa cập nhật';

  const [year, month, day] = date.split('-');

  return `${day}/${month}/${year}`;
};

// ============================================================
// XỬ LÝ RESPONSE API
// ============================================================

// Hỗ trợ các dạng response:
// 1. [...]
/*
   2. { data: [...] }
   3. { data: { data: [...] } }
   4. { contracts: [...] }
   5. { items: [...] }
*/
const extractContracts = (response: unknown): Contract[] => {
  if (Array.isArray(response)) {
    return response as Contract[];
  }

  if (!response || typeof response !== 'object') {
    return [];
  }

  const result = response as Record<string, unknown>;

  if (Array.isArray(result.contracts)) {
    return result.contracts as Contract[];
  }

  if (Array.isArray(result.items)) {
    return result.items as Contract[];
  }

  if (result.data !== undefined) {
    return extractContracts(result.data);
  }

  return [];
};

// ============================================================
// PARSE CUSTOMER INFO
// ============================================================

const parseCustomerInfo = (description?: string) => {
  const result = {
    name: '',
    phone: '',
    email: '',
  };

  if (!description) return result;

  const nameMatch = description.match(
    /Khách hàng:\s*(.*?)(?=\s*\|\s*SĐT:|\s*\|\s*Email:|$)/i
  );

  const phoneMatch = description.match(
    /SĐT:\s*(.*?)(?=\s*\|\s*Email:|\s*\||$)/i
  );

  const emailMatch = description.match(
    /Email:\s*(.*?)(?=\s*\||$)/i
  );

  result.name = nameMatch?.[1]?.trim() || '';
  result.phone = phoneMatch?.[1]?.trim() || '';
  result.email = emailMatch?.[1]?.trim() || '';

  return result;
};

// ============================================================
// MAP BACKEND STATUS TO UI STATUS
// ============================================================

const mapContractStatus = (
  contract: Contract
): {
  status: Exclude<AdminOrderStatus, 'all'>;
  timelineStep: 1 | 2 | 3 | 4;
} => {
  if (
    contract.contract_status === 'cancelled' ||
    contract.delivery_state === 'cancelled'
  ) {
    return {
      status: 'cancelled',
      timelineStep: 1,
    };
  }

  if (
    contract.contract_status === 'completed' ||
    contract.delivery_state === 'delivered'
  ) {
    return {
      status: 'completed',
      timelineStep: 4,
    };
  }

  if (
    contract.delivery_state === 'shipping' ||
    contract.contract_status === 'active'
  ) {
    return {
      status: 'delivering',
      timelineStep: 3,
    };
  }

  return {
    status: 'deposited',
    timelineStep: 2,
  };
};

// ============================================================
// MAP CONTRACT TO ADMIN ORDER
// ============================================================

const mapContractToAdminOrder = (
  contract: Contract
): AdminOrder => {
  const vehicle = contract.contractDetails?.[0];

  const customer = parseCustomerInfo(contract.description);

  const statusInfo = mapContractStatus(contract);

  const totalAmount = Number(contract.total_amount) || 0;
  const depositAmount = Number(contract.deposit) || 0;

  const vehicleName = vehicle
    ? [
        vehicle.brand,
        vehicle.model,
        vehicle.variant,
      ]
        .filter(Boolean)
        .join(' ')
    : 'Chưa cập nhật';

  return {
    // ID thật từ Backend
    id: String(contract.id),

    status: statusInfo.status,
    timelineStep: statusInfo.timelineStep,

    createdDate: displayDate(contract.created_at),

    customerName:
      customer.name || `Khách hàng #${contract.user_id}`,

    customerPhone: customer.phone,
    customerEmail: customer.email,
    customerIdCard: '',

    deliveryAddress:
      contract.shipping_address || 'Chưa cập nhật',

    carModel: vehicleName,
    carColor: vehicle?.exterior_color || 'Chưa cập nhật',

    // Backend hiện chưa trả VIN và engine_no trong contractDetails.
    vin: '',
    engineNo: '',

    manufactureYear: vehicle?.year
      ? String(vehicle.year)
      : '',

    salesAdvisor: 'Chưa cập nhật',

    contractValue: totalAmount,

    registrationFee: 0,
    insuranceFee: 0,
    discount: 0,

    totalValue: totalAmount,

    // Đây là số tiền đặt cọc ghi trong hợp đồng,
    // không phải xác nhận giao dịch VNPay thành công.
    paidAmount: depositAmount,

    remainingAmount: Math.max(
      0,
      totalAmount - depositAmount
    ),
  };
};

// ============================================================
// ADMIN ORDERS PAGE
// ============================================================

export const AdminOrdersPage: React.FC = () => {
  const navigate = useNavigate();

  // ----------------------------------------------------------
  // MOUNT ANIMATION
  // ----------------------------------------------------------

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsMounted(true);
    }, 100);

    return () => window.clearTimeout(timer);
  }, []);

  // ----------------------------------------------------------
  // DATA
  // ----------------------------------------------------------

  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  // ----------------------------------------------------------
  // FILTERS
  // ----------------------------------------------------------

  const [activeStatusTab, setActiveStatusTab] =
    useState<AdminOrderStatus>('all');

  const [searchQuery, setSearchQuery] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  // ----------------------------------------------------------
  // DETAIL DRAWER
  // ----------------------------------------------------------

  const [selectedOrder, setSelectedOrder] =
    useState<AdminOrder | null>(null);

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);

  // ==========================================================
  // FETCH CONTRACTS
  // ==========================================================

  const fetchOrders = useCallback(async () => {
    try {
      setIsLoading(true);
      setApiError('');

      const response = await contractService.getAllContracts();

      console.log('========== CONTRACT API RESPONSE ==========');
      console.log(response);

      const contracts = extractContracts(response);

      console.log('========== CONTRACT LIST ==========');
      console.table(
        contracts.map((contract) => ({
          id: contract.id,
          user_id: contract.user_id,
          total_amount: contract.total_amount,
          deposit: contract.deposit,
          contract_status: contract.contract_status,
          delivery_state: contract.delivery_state,
        }))
      );

      // Loại bỏ hợp đồng không có ID.
      const validContracts = contracts.filter(
        (contract) =>
          contract &&
          contract.id !== null &&
          contract.id !== undefined &&
          String(contract.id).trim() !== ''
      );

      // Loại bỏ ID trùng để tránh React duplicate key.
      const uniqueContracts = Array.from(
        new Map(
          validContracts.map((contract) => [
            String(contract.id),
            contract,
          ])
        ).values()
      );

      const mappedOrders = uniqueContracts.map(
        mapContractToAdminOrder
      );

      console.log('========== ADMIN ORDERS MAPPED ==========');
      console.table(
        mappedOrders.map((order) => ({
          id: order.id,
          customer: order.customerName,
          phone: order.customerPhone,
          vehicle: order.carModel,
          contractValue: order.contractValue,
          deposit: order.paidAmount,
          status: order.status,
        }))
      );

      setOrders(mappedOrders);

      // Cập nhật dữ liệu drawer nếu đang mở.
      setSelectedOrder((current) => {
        if (!current) return null;

        return (
          mappedOrders.find(
            (order) => order.id === current.id
          ) || null
        );
      });

      if (contracts.length > 0 && validContracts.length === 0) {
        console.warn(
          'API có dữ liệu nhưng không tìm thấy contract.id hợp lệ.'
        );
      }
    } catch (error: any) {
      console.error('Fetch contracts error:', error);

      setApiError(
        error?.response?.data?.message ||
          error?.message ||
          'Không thể tải danh sách hợp đồng.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ==========================================================
  // COUNTS
  // ==========================================================

  const counts = useMemo(() => {
    return {
      all: orders.length,

      completed: orders.filter(
        (order) => order.status === 'completed'
      ).length,

      delivering: orders.filter(
        (order) => order.status === 'delivering'
      ).length,

      deposited: orders.filter(
        (order) => order.status === 'deposited'
      ).length,

      cancelled: orders.filter(
        (order) => order.status === 'cancelled'
      ).length,
    };
  }, [orders]);

  // ==========================================================
  // FILTER ORDERS
  // ==========================================================

  const filteredOrders = useMemo(() => {
    return orders.filter((item) => {
      // Filter status
      if (
        activeStatusTab !== 'all' &&
        item.status !== activeStatusTab
      ) {
        return false;
      }

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();

        const matchId = (item.id || '')
          .toLowerCase()
          .includes(query);

        const matchCustomer = (item.customerName || '')
          .toLowerCase()
          .includes(query);

        const matchPhone = (item.customerPhone || '')
          .toLowerCase()
          .includes(query);

        const matchEmail = (item.customerEmail || '')
          .toLowerCase()
          .includes(query);

        const matchCar = (item.carModel || '')
          .toLowerCase()
          .includes(query);

        const matchAdvisor = (item.salesAdvisor || '')
          .toLowerCase()
          .includes(query);

        if (
          !matchId &&
          !matchCustomer &&
          !matchPhone &&
          !matchEmail &&
          !matchCar &&
          !matchAdvisor
        ) {
          return false;
        }
      }

      // createdDate có dạng dd/mm/yyyy nên dùng ngày ISO riêng
      // để so sánh chính xác.
      const order = orders.find(
        (current) => current.id === item.id
      );

      if (order) {
        // Không cần xử lý thêm ở đây.
      }

      return true;
    }).filter((item) => {
      // Lọc ngày bằng ngày tạo hợp đồng thực tế.
      // Tìm hợp đồng tương ứng từ danh sách đã map.
      const originalContractDate = item.createdDate;

      if (!originalContractDate || originalContractDate === 'Chưa cập nhật') {
        return !fromDate && !toDate;
      }

      const [day, month, year] = originalContractDate.split('/');
      const itemDate = `${year}-${month}-${day}`;

      if (fromDate && itemDate < fromDate) {
        return false;
      }

      if (toDate && itemDate > toDate) {
        return false;
      }

      return true;
    });
  }, [
    orders,
    activeStatusTab,
    searchQuery,
    fromDate,
    toDate,
  ]);

  const totalOrders = filteredOrders.length;

const totalPages = Math.max(
  1,
  Math.ceil(totalOrders / pageSize)
);

const paginatedOrders = useMemo(() => {
  const startIndex = (currentPage - 1) * pageSize;

  return filteredOrders.slice(
    startIndex,
    startIndex + pageSize
  );
}, [filteredOrders, currentPage, pageSize]);

const startItem =
  totalOrders === 0 ? 0 : (currentPage - 1) * pageSize + 1;

const endItem = Math.min(
  currentPage * pageSize,
  totalOrders
);

useEffect(() => {
  setCurrentPage(1);
}, [searchQuery, activeStatusTab, fromDate, toDate, pageSize]);

  // ==========================================================
  // TOTAL VALUE
  // ==========================================================

  const totalDisplayValue = useMemo(() => {
    return orders.reduce(
      (sum, item) => sum + (Number(item.contractValue) || 0),
      0
    );
  }, [orders]);

  // ==========================================================
  // HANDLERS
  // ==========================================================

  const handleResetFilter = () => {
    setActiveStatusTab('all');
    setSearchQuery('');
    setFromDate('');
    setToDate('');
  };

  const handleOpenDetail = (order: AdminOrder) => {
    setSelectedOrder(order);
    setIsDrawerOpen(true);
  };

  // Chỉ cập nhật UI, chưa gọi API cập nhật trạng thái Backend.
  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: Exclude<AdminOrderStatus, 'all'>,
    timelineStep: 1 | 2 | 3 | 4
  ) => {
    setOrders((previous) =>
      previous.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: newStatus,
              timelineStep,
            }
          : order
      )
    );

    setSelectedOrder((previous) =>
      previous && previous.id === orderId
        ? {
            ...previous,
            status: newStatus,
            timelineStep,
          }
        : previous
    );
  };

  // ==========================================================
  // STAT CARDS
  // ==========================================================

  const orderStatCards = [
    {
      status: 'all' as AdminOrderStatus,
      title: 'Tất cả hợp đồng',
      value: counts.all,
      unit: 'hợp đồng',
      sub: `${(totalDisplayValue / 1e9).toFixed(1)} tỷ VND`,
      subColor: 'text-[#8a6e3d] bg-amber-50/70',
      icon: FileText,
      iconColor: 'bg-zinc-200/60 text-zinc-700',
    },
    {
      status: 'completed' as AdminOrderStatus,
      title: 'Đã hoàn thành',
      value: counts.completed,
      unit: 'hợp đồng',
      sub: 'Đã giao & hoàn thành',
      subColor: 'text-emerald-700 bg-emerald-50',
      icon: CheckCircle2,
      iconColor: 'bg-emerald-100/70 text-emerald-600',
    },
    {
      status: 'delivering' as AdminOrderStatus,
      title: 'Đang giao xe',
      value: counts.delivering,
      unit: 'hợp đồng',
      sub: 'Đang vận chuyển giao',
      subColor: 'text-purple-700 bg-purple-50',
      icon: Truck,
      iconColor: 'bg-purple-100/70 text-purple-600',
    },
    {
      status: 'deposited' as AdminOrderStatus,
      title: 'Đặt cọc / chờ xử lý',
      value: counts.deposited,
      unit: 'hợp đồng',
      sub: 'Theo trạng thái hợp đồng',
      subColor: 'text-amber-800 bg-amber-50',
      icon: Clock,
      iconColor: 'bg-amber-100/70 text-amber-600',
    },
    {
      status: 'cancelled' as AdminOrderStatus,
      title: 'Hợp đồng hủy',
      value: counts.cancelled,
      unit: 'hợp đồng',
      sub: 'Hợp đồng đã hủy',
      subColor: 'text-rose-700 bg-rose-50',
      icon: XCircle,
      iconColor: 'bg-rose-100/70 text-rose-600',
    },
  ];

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="flex-1 flex flex-col h-full bg-zinc-50 overflow-hidden select-none font-sans">

      {/* ====================================================== */}
      {/* HEADER */}
      {/* ====================================================== */}

      <div
        className={`shrink-0 bg-white border-b border-zinc-200/80 px-8 pt-5 pb-4 space-y-4 shadow-2xs transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
          isMounted
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-4'
        }`}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm mã hợp đồng, khách hàng, SĐT..."
              className="w-full h-9 pl-9 pr-3.5 rounded-full bg-zinc-100/80 border border-zinc-200/60 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-[#b8955a] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={fetchOrders}
              disabled={isLoading}
              className="h-9 px-4 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <RotateCcw
                className={`size-3.5 ${
                  isLoading ? 'animate-spin' : ''
                }`}
              />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="h-9 px-4 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white hover:text-[#b8955a] text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
            >
              <LayoutDashboard className="size-3.5" />
              <span>Về Dashboard</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div className="flex items-end justify-between pt-1">
          <div>
            <p className="text-[11px] tracking-wider text-[#b8955a] uppercase font-bold">
              Hệ thống điều hành / Quản lý đơn hàng
            </p>

            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight mt-1">
              Quản Lý Hợp Đồng & Đơn Hàng Xe
            </h1>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 px-4 py-2 rounded-2xl flex items-center gap-2.5 shadow-2xs">
            <span className="text-xs text-zinc-500 font-medium">
              Tổng giá trị:
            </span>

            <span className="text-base font-bold text-[#b8955a] tabular-nums">
              {formatCurrency(totalDisplayValue)}
            </span>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-5 gap-3.5 pt-1">
          {orderStatCards.map((card, idx) => {
            const isSelected = activeStatusTab === card.status;

            return (
              <button
                key={card.status}
                type="button"
                onClick={() => setActiveStatusTab(card.status)}
                className={`rounded-2xl p-4 flex items-center justify-between text-left transition-all duration-300 transform hover:-translate-y-0.5 cursor-pointer ${
                  isSelected
                    ? 'bg-white border-2 border-[#b8955a] shadow-sm ring-2 ring-[#b8955a]/20'
                    : 'bg-zinc-50/70 border border-zinc-200/80 hover:bg-white hover:border-zinc-300 shadow-2xs'
                } ${
                  isMounted
                    ? 'opacity-100 translate-y-0 scale-100'
                    : 'opacity-0 translate-y-4 scale-98'
                }`}
                style={{
                  transitionDelay: `${idx * 60}ms`,
                }}
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs font-medium text-zinc-500 truncate">
                    {card.title}
                  </p>

                  <div className="flex items-baseline gap-1.5 mt-1">
                    <span className="text-xl font-bold text-zinc-900 tabular-nums">
                      {card.value}
                    </span>

                    <span className="text-xs text-zinc-500">
                      {card.unit}
                    </span>
                  </div>

                  <span
                    className={`inline-block mt-1 text-[11px] font-semibold px-2 py-0.5 rounded-md truncate max-w-full ${card.subColor}`}
                  >
                    {card.sub}
                  </span>
                </div>

                <div
                  className={`size-10 shrink-0 rounded-xl flex items-center justify-center ${card.iconColor}`}
                >
                  <card.icon className="size-5" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="relative flex-1 min-w-[280px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm hợp đồng, khách hàng, số điện thoại, xe..."
              className="w-full h-10 pl-9 pr-4 rounded-xl bg-white border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10 transition-all shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-600 shadow-2xs">
              <span className="text-zinc-400 text-xs whitespace-nowrap">
                Từ ngày:
              </span>

              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="text-xs text-zinc-800 focus:outline-none font-medium bg-transparent cursor-pointer tabular-nums"
              />
            </div>

            <div className="flex items-center gap-1.5 h-10 px-3.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-600 shadow-2xs">
              <span className="text-zinc-400 text-xs whitespace-nowrap">
                Đến ngày:
              </span>

              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="text-xs text-zinc-800 focus:outline-none font-medium bg-transparent cursor-pointer tabular-nums"
              />
            </div>

            <button
              type="button"
              onClick={handleResetFilter}
              className="h-10 px-3.5 bg-white hover:bg-zinc-100 border border-zinc-200 rounded-xl text-xs font-semibold text-zinc-700 flex items-center gap-1.5 transition-all cursor-pointer shadow-2xs active:scale-95"
              title="Khôi phục bộ lọc mặc định"
            >
              <RotateCcw className="size-3.5 text-zinc-500" />
              <span>Thiết lập lại</span>
            </button>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* TABLE */}
      {/* ====================================================== */}

      <div className="flex-1 overflow-y-auto pl-8 pr-[22px] py-5">
        <div
          className={`bg-white rounded-3xl border border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] transform ${
            isMounted
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 translate-y-8 scale-98'
          }`}
        >
          <div className="w-full overflow-x-hidden">
            <table className="w-full text-left border-collapse table-fixed">
              <colgroup>
                <col className="w-[9%]" />
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[18%]" />
                <col className="w-[13%]" />
                <col className="w-[13%]" />
                <col className="w-[9%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
              </colgroup>

              <thead className="sticky top-0 bg-zinc-50/95 backdrop-blur-xs z-10 border-b border-zinc-200/80">
                <tr className="text-[11px] uppercase tracking-wider text-zinc-500">
                  <th className="py-3.5 pl-4 pr-1.5 font-bold whitespace-nowrap">
                    Mã Hợp Đồng
                  </th>

                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap">
                    Ngày Lập
                  </th>

                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap">
                    Khách Hàng
                  </th>

                  <th className="py-3.5 pl-3.5 pr-1.5 font-bold">
                    Mẫu Xe Đặt
                  </th>

                  <th className="py-3.5 pl-3.5 pr-1.5 font-bold whitespace-nowrap">
                    Giá Trị HĐ
                  </th>

                  <th className="py-3.5 pl-3.5 pr-1.5 font-bold whitespace-nowrap">
                    Tiền Đặt Cọc
                  </th>

                  {/* <th className="py-3.5 pl-3.5 pr-1.5 font-bold whitespace-nowrap">
                    Phụ Trách
                  </th> */}

                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap text-center">
                    Trạng Thái
                  </th>

                  <th className="py-3.5 px-1.5 font-bold whitespace-nowrap text-center">
                    Thao Tác
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100 text-xs">
                {isLoading ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <div className="size-8 border-4 border-zinc-200 border-t-[#b8955a] rounded-full animate-spin" />

                        <p className="text-sm font-medium text-zinc-500">
                          Đang tải danh sách hợp đồng...
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : apiError ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <XCircle className="size-8 text-red-400" />

                        <p className="text-sm font-medium text-red-600">
                          {apiError}
                        </p>

                        <button
                          type="button"
                          onClick={fetchOrders}
                          className="px-4 py-2 rounded-lg bg-zinc-950 text-white text-xs font-semibold hover:bg-zinc-800 transition-all"
                        >
                          Thử lại
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-16 text-center">
                      <div className="flex flex-col items-center justify-center gap-2">
                        <FileText className="size-8 text-zinc-300" />

                        <p className="text-sm font-medium text-zinc-600">
                          Không tìm thấy hợp đồng nào phù hợp
                        </p>

                        <p className="text-xs text-zinc-400">
                          Hãy thử thay đổi từ khóa tìm kiếm hoặc khoảng ngày
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  paginatedOrders.map((order, idx) => {
                    const statusConfig =
                      ORDER_STATUS_CONFIG[order.status];

                    return (
                      <tr
                        key={order.id}
                        className={`hover:bg-zinc-50/80 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] transform group ${
                          isMounted
                            ? 'opacity-100 translate-x-0'
                            : 'opacity-0 -translate-x-6'
                        }`}
                        style={{
                          transitionDelay: `${150 + idx * 40}ms`,
                        }}
                      >
                        {/* Mã hợp đồng */}
                        <td className="py-3.5 pl-4 pr-1.5 whitespace-nowrap">
                          <span className="font-semibold text-zinc-900 group-hover:text-[#b8955a] transition-colors font-mono text-[11px] tracking-tight">
                            #{order.id}
                          </span>
                        </td>

                        {/* Ngày lập */}
                        <td className="py-3.5 px-1.5 font-medium text-zinc-600 whitespace-nowrap tabular-nums text-xs">
                          {order.createdDate}
                        </td>

                        {/* Khách hàng */}
                        <td className="py-3.5 px-1.5 min-w-0">
                          <p className="font-bold text-zinc-900 leading-snug truncate whitespace-nowrap">
                            {order.customerName || 'Chưa cập nhật'}
                          </p>

                          <p className="text-[11px] text-zinc-400 tabular-nums mt-0.5 truncate">
                            {order.customerPhone || 'Chưa cập nhật'}
                          </p>
                        </td>

                        {/* Xe */}
                        <td className="py-3.5 pl-3.5 pr-1.5 min-w-0">
                          <p className="font-bold text-zinc-900 leading-snug truncate">
                            {order.carModel || 'Chưa cập nhật'}
                          </p>

                          <p className="text-[11px] text-zinc-500 mt-0.5 truncate">
                            {order.carColor || 'Chưa cập nhật'}
                          </p>
                        </td>

                        {/* Giá trị hợp đồng */}
                        <td className="py-3.5 pl-3.5 pr-1.5 whitespace-nowrap">
                          <span className="font-bold text-zinc-900 tabular-nums text-xs">
                            {formatCurrency(order.contractValue)}
                          </span>
                        </td>

                        {/* Tiền đặt cọc */}
                        <td className="py-3.5 pl-3.5 pr-1.5 whitespace-nowrap">
                          <span className="font-bold text-zinc-900 tabular-nums text-xs">
                            {formatCurrency(order.paidAmount)}
                          </span>
                        </td>

                        {/* Phụ trách */}
                        {/* <td className="py-3.5 pl-3.5 pr-1.5 font-medium text-zinc-700 whitespace-nowrap truncate text-xs">
                          {(order.salesAdvisor || 'Chưa cập nhật')
                            .split('(')[0]
                            .trim()}
                        </td> */}

                        {/* Trạng thái */}
                        <td className="py-3.5 px-1.5 whitespace-nowrap text-center">
                          <div className="flex items-center justify-center">
                            <div
                              className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                                statusConfig?.badgeBg || 'bg-zinc-50'
                              } ${
                                statusConfig?.badgeText || 'text-zinc-700'
                              }`}
                            >
                              <span
                                className={`size-1.5 rounded-full ${
                                  statusConfig?.dotColor || 'bg-zinc-400'
                                }`}
                              />

                              <span>
                                {statusConfig?.label || order.status}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Thao tác */}
                        <td className="py-3.5 px-1.5 text-center whitespace-nowrap">
                          <div className="flex items-center justify-center">
                            <button
                              type="button"
                              onClick={() => handleOpenDetail(order)}
                              className="size-7.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                              title="Xem chi tiết hợp đồng"
                            >
                              <Eye className="size-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
            
<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-100">
  <div className="flex items-center gap-3 text-sm text-gray-500">
    <span>
      Hiển thị{" "}
      <strong className="text-gray-900">{startItem}-{endItem}</strong>
      {" "}trong{" "}
      <strong className="text-gray-900">{totalOrders}</strong>
      {" "}hợp đồng
    </span>

    <select
      value={pageSize}
      onChange={(e) => {
        setPageSize(Number(e.target.value));
        setCurrentPage(1);
      }}
      className="border border-gray-200 rounded-lg px-2 py-1.5 outline-none"
    >
      <option value={5}>5 / trang</option>
      <option value={10}>10 / trang</option>
      <option value={20}>20 / trang</option>
      <option value={50}>50 / trang</option>
    </select>
  </div>

  <div className="flex items-center gap-2">
    <button
      type="button"
      disabled={currentPage === 1}
      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
      className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Trước
    </button>

    {Array.from({ length: totalPages }, (_, index) => index + 1)
      .filter((page) => {
        return (
          page === 1 ||
          page === totalPages ||
          Math.abs(page - currentPage) <= 1
        );
      })
      .map((page, index, pages) => (
        <React.Fragment key={page}>
          {index > 0 && pages[index - 1] !== page - 1 && (
            <span className="px-1 text-gray-400">...</span>
          )}

          <button
            type="button"
            onClick={() => setCurrentPage(page)}
            className={`min-w-9 h-9 rounded-lg text-sm font-medium ${
              currentPage === page
                ? "bg-gray-900 text-white"
                : "border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        </React.Fragment>
      ))}

    <button
      type="button"
      disabled={currentPage >= totalPages}
      onClick={() =>
        setCurrentPage((prev) => Math.min(totalPages, prev + 1))
      }
      className="px-3 py-2 border rounded-lg text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
    >
      Sau
    </button>
  </div>
</div>

          </div>

          {/* Footer */}
          <div className="p-4 border-t border-zinc-100 bg-zinc-50/50 flex items-center justify-between text-xs text-zinc-500">
            <span>
              Hiển thị{' '}
              <strong className="text-zinc-800">
                {filteredOrders.length}
              </strong>{' '}
              / {orders.length} hợp đồng
            </span>

            <span className="text-xs text-zinc-400">
              Mercedes-Benz Dealership Management System
            </span>
          </div>
        </div>
      </div>

      {/* ====================================================== */}
      {/* DETAIL DRAWER */}
      {/* ====================================================== */}

      <OrderDetailDrawer
        order={selectedOrder}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onUpdateStatus={handleUpdateOrderStatus}
      />
    </div>
  );
};

export default AdminOrdersPage;
