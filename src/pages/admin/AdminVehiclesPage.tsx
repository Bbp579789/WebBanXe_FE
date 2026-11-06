import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  ArrowLeft,
  Car,
  Layers,
  FileSpreadsheet,
  Sliders,
  Plus,
  SquarePen,
  Eye,
  EyeOff,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  ImagePlus,
  Lock,
  Pencil,
  Check,
  Save,
} from 'lucide-react';
import type {
  AdminVehicle,
  VehicleSegment,
  VehicleSaleStatus,
  ProductCategory,
  ImportReceipt,
  PricingConfigItem,
} from '../../types/adminVehicle.types';
import {
  INITIAL_ADMIN_VEHICLES,
  INITIAL_PRODUCT_CATEGORIES,
  INITIAL_IMPORT_RECEIPTS,
  INITIAL_PRICING_CONFIGS,
} from '../../data/adminVehiclesData';

type ActiveTab = 'vehicles' | 'categories' | 'imports' | 'pricing';

const DEFAULT_CAR_IMAGE =
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop&q=80';

export const AdminVehiclesPage: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Hiệu ứng mở đầu mượt mà
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // State dữ liệu chính
  const [vehicles, setVehicles] = useState<AdminVehicle[]>(INITIAL_ADMIN_VEHICLES);
  const [categories, setCategories] = useState<ProductCategory[]>(INITIAL_PRODUCT_CATEGORIES);
  const [importReceipts, setImportReceipts] = useState<ImportReceipt[]>(INITIAL_IMPORT_RECEIPTS);
  const [pricingConfigs, setPricingConfigs] = useState<PricingConfigItem[]>(INITIAL_PRICING_CONFIGS);

  // State điều hướng Tab
  const [activeTab, setActiveTab] = useState<ActiveTab>('vehicles');

  // Bộ lọc Danh sách xe
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSegment, setSelectedSegment] = useState<'all' | VehicleSegment>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | VehicleSaleStatus>('all');

  // Checkbox chọn nhiều dòng
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  // Modal Thêm / Sửa / Xem chi tiết / Xóa Xe
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<AdminVehicle | null>(null);
  const [viewingVehicle, setViewingVehicle] = useState<AdminVehicle | null>(null);
  const [deletingVehicle, setDeletingVehicle] = useState<AdminVehicle | null>(null);

  // Form Thêm / Chỉnh sửa xe
  const [formSegment, setFormSegment] = useState<VehicleSegment>('Maybach');
  const [formModelCode, setFormModelCode] = useState('');
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('15990000000');
  const [formStock, setFormStock] = useState('1');
  const [formStatus, setFormStatus] = useState<VehicleSaleStatus>('selling');
  const [formImageUrl, setFormImageUrl] = useState(DEFAULT_CAR_IMAGE);
  const [formDescription, setFormDescription] = useState('');

  // State Form Thêm / Chỉnh sửa Phân khúc (Tab Loại sản phẩm)
  const [catCode, setCatCode] = useState('');
  const [catName, setCatName] = useState('');
  const [catDescription, setCatDescription] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);

  // State Bộ lọc & Modal Tab Phiếu nhập hàng
  const [importSearchQuery, setImportSearchQuery] = useState('');
  const [importFromDate, setImportFromDate] = useState('');
  const [importToDate, setImportToDate] = useState('');
  const [isCreateReceiptOpen, setIsCreateReceiptOpen] = useState(false);
  const [viewingReceipt, setViewingReceipt] = useState<ImportReceipt | null>(null);

  // Form tạo phiếu nhập mới (Nhiều dòng xe trong lô hàng)
  const [recCode, setRecCode] = useState('PN-2026-004');
  const [recDate, setRecDate] = useState('2026-09-15');
  const [recSupplier, setRecSupplier] = useState('Mercedes-Benz AG Sindelfingen (Đức)');
  const [recItems, setRecItems] = useState<
    Array<{ id: string; vehicleName: string; unitCost: string; quantity: string }>
  >([
    {
      id: 'item-1',
      vehicleName: 'Mercedes-Maybach S 680 4MATIC',
      unitCost: '13591500000',
      quantity: '2',
    },
  ]);

  // State cho Tab Cấu hình Giá bán (Thiết lập tỷ lệ lợi nhuận đồng loạt & Real-time)
  const [bulkSegment, setBulkSegment] = useState<'all' | VehicleSegment>('all');
  const [bulkMarginInput, setBulkMarginInput] = useState('');

  // Thông báo Toast
  const [toastMessage, setToastMessage] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3200);
  };

  // Định dạng tiền tệ chuẩn giống ảnh: 15.990.000.000 ₫
  const formatPriceVND = (val: number) => {
    return `${val.toLocaleString('vi-VN')} ₫`;
  };

  // Tổng tồn kho toàn hệ thống (hiển thị trên pill góc phải)
  const totalInventoryStock = useMemo(() => {
    const sellingStock = vehicles
      .filter((v) => v.status === 'selling')
      .reduce((acc, v) => acc + v.stock, 0);
    const sum = vehicles.reduce((acc, v) => acc + v.stock, 0);
    return sellingStock > 0 ? sellingStock : sum;
  }, [vehicles]);

  // Lọc danh sách xe theo từ khóa, phân khúc và trạng thái
  const filteredVehicles = useMemo(() => {
    return vehicles.filter((item) => {
      if (selectedSegment !== 'all' && item.segment !== selectedSegment) {
        return false;
      }
      if (selectedStatus !== 'all' && item.status !== selectedStatus) {
        return false;
      }
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = item.name.toLowerCase().includes(q);
        const matchCode = item.modelCode.toLowerCase().includes(q);
        const matchSegment = item.segment.toLowerCase().includes(q);
        const matchDesc = item.description.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchSegment && !matchDesc) {
          return false;
        }
      }
      return true;
    });
  }, [vehicles, selectedSegment, selectedStatus, searchQuery]);

  // Lọc danh sách Phiếu nhập hàng theo từ khóa và khoảng ngày
  const filteredImportReceipts = useMemo(() => {
    return importReceipts.filter((item) => {
      if (importSearchQuery.trim()) {
        const q = importSearchQuery.toLowerCase().trim();
        const matchCode = item.id.toLowerCase().includes(q);
        const matchSupplier = item.supplier.toLowerCase().includes(q);
        const matchCar = item.vehicleName.toLowerCase().includes(q);
        if (!matchCode && !matchSupplier && !matchCar) {
          return false;
        }
      }
      if (importFromDate && item.importDate < importFromDate) {
        return false;
      }
      if (importToDate && item.importDate > importToDate) {
        return false;
      }
      return true;
    });
  }, [importReceipts, importSearchQuery, importFromDate, importToDate]);

  // Chọn tất cả checkbox
  const isAllSelected =
    filteredVehicles.length > 0 &&
    filteredVehicles.every((v) => selectedIds.includes(v.id));

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredVehicles.map((v) => v.id));
    }
  };

  const handleToggleSelectRow = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Mở modal thêm xe mới
  const handleOpenAddModal = () => {
    setEditingVehicle(null);
    setFormSegment('Maybach');
    setFormModelCode('');
    setFormName('');
    setFormPrice('15990000000');
    setFormStock('1');
    setFormStatus('selling');
    setFormImageUrl(DEFAULT_CAR_IMAGE);
    setFormDescription('');
    setIsAddModalOpen(true);
  };

  // Mở modal sửa xe
  const handleOpenEditModal = (vehicle: AdminVehicle) => {
    setEditingVehicle(vehicle);
    setFormSegment(vehicle.segment);
    setFormModelCode(vehicle.modelCode);
    setFormName(vehicle.name);
    setFormPrice(String(vehicle.price));
    setFormStock(String(vehicle.stock));
    setFormStatus(vehicle.status);
    setFormImageUrl(vehicle.imageUrl);
    setFormDescription(vehicle.description);
    setIsAddModalOpen(true);
  };

  // Chọn file ảnh đại diện từ máy tính
  const handleSelectImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  // Lưu thông tin thêm mới hoặc cập nhật xe
  const handleSaveVehicle = (e: React.FormEvent) => {
    e.preventDefault();

    const finalName = formName.trim() || 'Mercedes-Maybach S 680 4MATIC';
    const finalModelCode = (formModelCode.trim() || 'WDD223').toUpperCase();
    const parsedPrice = Number(String(formPrice).replace(/\D/g, '')) || 15990000000;
    const parsedStock = Math.max(0, Number(formStock) || 1);
    const finalDesc =
      formDescription.trim() ||
      'Động cơ V12 Biturbo, dung tích 6.0L, công suất 612 mã lực, hộp số 9G-TRONIC...';

    if (editingVehicle) {
      const updated: AdminVehicle = {
        ...editingVehicle,
        name: finalName,
        modelCode: finalModelCode,
        segment: formSegment,
        price: parsedPrice,
        stock: parsedStock,
        status: formStatus,
        description: finalDesc,
        imageUrl: formImageUrl || editingVehicle.imageUrl,
      };
      setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
      triggerToast(`Đã cập nhật thông tin xe "${updated.name}" thành công!`);
    } else {
      const newVehicle: AdminVehicle = {
        id: `VEH-${Date.now()}`,
        name: finalName,
        modelCode: finalModelCode,
        segment: formSegment,
        price: parsedPrice,
        stock: parsedStock,
        status: formStatus,
        description: finalDesc,
        imageUrl: formImageUrl || DEFAULT_CAR_IMAGE,
        year: 2025,
        engine: 'V12 Biturbo 6.0L (612 HP)',
        exteriorColor: 'Obsidian Black',
        interiorColor: 'Exclusive Nappa Leather',
      };
      setVehicles((prev) => [newVehicle, ...prev]);
      triggerToast(`Đã thêm mẫu xe "${newVehicle.name}" vào Showroom!`);
    }

    setIsAddModalOpen(false);
    setEditingVehicle(null);
  };

  // Đổi nhanh trạng thái Đang bán / Tạm ẩn trực tiếp trên bảng
  const handleToggleVehicleStatus = (id: string) => {
    setVehicles((prev) =>
      prev.map((v) => {
        if (v.id === id) {
          const nextStatus: VehicleSaleStatus = v.status === 'selling' ? 'hidden' : 'selling';
          triggerToast(
            `Đã chuyển trạng thái "${v.name}" sang ${nextStatus === 'selling' ? 'Đang bán' : 'Tạm ẩn'}`
          );
          return { ...v, status: nextStatus };
        }
        return v;
      })
    );
  };

  // Xác nhận xóa xe
  const handleConfirmDelete = () => {
    if (!deletingVehicle) return;
    const targetName = deletingVehicle.name;
    setVehicles((prev) => prev.filter((v) => v.id !== deletingVehicle.id));
    setSelectedIds((prev) => prev.filter((id) => id !== deletingVehicle.id));
    setDeletingVehicle(null);
    triggerToast(`Đã xóa mẫu xe "${targetName}" khỏi danh mục!`);
  };

  // =====================================================================
  // XỬ LÝ THAO TÁC TRỰC TIẾP TRÊN TAB LOẠI SẢN PHẨM (PHÂN KHÚC)
  // =====================================================================
  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catCode.trim() || !catName.trim()) {
      triggerToast('Vui lòng nhập đầy đủ Mã phân khúc và Tên phân khúc!');
      return;
    }

    if (editingCategoryId) {
      setCategories((prev) =>
        prev.map((item) =>
          item.id === editingCategoryId
            ? {
                ...item,
                code: catCode.trim().toUpperCase(),
                name: catName.trim(),
                description:
                  catDescription.trim() ||
                  'Đặc tính sản phẩm và phân khúc khách hàng mục tiêu...',
              }
            : item
        )
      );
      triggerToast(`Đã cập nhật phân khúc "${catName.trim()}" thành công!`);
      setEditingCategoryId(null);
    } else {
      const newCategory: ProductCategory = {
        id: `CAT-${Date.now()}`,
        code: catCode.trim().toUpperCase(),
        name: catName.trim(),
        segment: 'Sedan',
        description:
          catDescription.trim() || 'Dòng xe thế hệ mới theo tiêu chuẩn Mercedes-Benz toàn cầu',
        vehicleCount: 0,
        totalStock: 0,
        status: 'active',
      };
      setCategories((prev) => [...prev, newCategory]);
      triggerToast(`Đã thêm phân khúc "${newCategory.name}" vào danh mục!`);
    }

    setCatCode('');
    setCatName('');
    setCatDescription('');
  };

  const handleEditCategoryRow = (cat: ProductCategory) => {
    setEditingCategoryId(cat.id);
    setCatCode(cat.code);
    setCatName(cat.name);
    setCatDescription(cat.description);
  };

  const handleToggleCategoryStatus = (id: string) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === id) {
          const nextStatus = cat.status === 'active' ? 'inactive' : 'active';
          triggerToast(
            `Đã chuyển trạng thái phân khúc "${cat.name}" sang ${
              nextStatus === 'active' ? 'Đang áp dụng' : 'Tạm ẩn'
            }`
          );
          return { ...cat, status: nextStatus };
        }
        return cat;
      })
    );
  };

  const handleDeleteCategoryRow = (cat: ProductCategory) => {
    setCategories((prev) => prev.filter((item) => item.id !== cat.id));
    if (editingCategoryId === cat.id) {
      setEditingCategoryId(null);
      setCatCode('');
      setCatName('');
      setCatDescription('');
    }
    triggerToast(`Đã xóa phân khúc "${cat.name}" khỏi hệ thống!`);
  };

  // =====================================================================
  // XỬ LÝ THAO TÁC TRỰC TIẾP TRÊN TAB PHIẾU NHẬP HÀNG
  // =====================================================================
  const handleOpenCreateReceipt = () => {
    const nextNum = String(importReceipts.length + 1).padStart(3, '0');
    setRecCode(`PN-2026-${nextNum}`);
    setRecDate('2026-09-15');
    setRecSupplier('Mercedes-Benz AG Sindelfingen (Đức)');
    setRecItems([
      {
        id: `item-${Date.now()}`,
        vehicleName: 'Mercedes-Maybach S 680 4MATIC',
        unitCost: '13591500000',
        quantity: '2',
      },
    ]);
    setIsCreateReceiptOpen(true);
  };

  // Thêm dòng xe mới trong lô hàng
  const handleAddReceiptRow = () => {
    setRecItems((prev) => [
      ...prev,
      {
        id: `item-${Date.now()}-${prev.length}`,
        vehicleName: vehicles[0]?.name || 'Mercedes-Maybach S 680 4MATIC',
        unitCost: '5000000000',
        quantity: '1',
      },
    ]);
  };

  // Cập nhật từng dòng xe trong lô hàng
  const handleUpdateReceiptRow = (
    rowId: string,
    field: 'vehicleName' | 'unitCost' | 'quantity',
    val: string
  ) => {
    setRecItems((prev) =>
      prev.map((row) => {
        if (row.id !== rowId) return row;
        if (field === 'vehicleName') {
          // Tự động gợi ý giá vốn theo mẫu xe được chọn nếu có
          const foundCar = vehicles.find((v) => v.name === val);
          const suggestedCost = foundCar
            ? String(Math.round(foundCar.price * 0.85))
            : row.unitCost;
          return { ...row, vehicleName: val, unitCost: suggestedCost };
        }
        return { ...row, [field]: val };
      })
    );
  };

  // Xóa 1 dòng xe khỏi lô hàng
  const handleRemoveReceiptRow = (rowId: string) => {
    if (recItems.length <= 1) {
      triggerToast('Phiếu nhập cần có ít nhất 1 dòng xe!');
      return;
    }
    setRecItems((prev) => prev.filter((row) => row.id !== rowId));
  };

  // Tính tổng số xe nhập & tổng giá trị lô hàng Real-time
  const receiptTotals = useMemo(() => {
    return recItems.reduce(
      (acc, row) => {
        const cost = Number(String(row.unitCost).replace(/\D/g, '')) || 0;
        const qty = Math.max(0, Number(row.quantity) || 0);
        acc.totalCars += qty;
        acc.totalValue += cost * qty;
        return acc;
      },
      { totalCars: 0, totalValue: 0 }
    );
  }, [recItems]);

  // Lưu phiếu nhập (Lưu bản nháp hoặc Hoàn thành & Khóa phiếu)
  const handleCreateReceiptSubmit = (targetStatus: 'draft' | 'completed') => {
    const totalCars = Math.max(1, receiptTotals.totalCars);
    const totalValue = receiptTotals.totalValue || 27183000000;
    const summaryNames = recItems.map((r) => r.vehicleName).join(', ');

    const newRec: ImportReceipt = {
      id: (recCode.trim() || `PN-2026-00${importReceipts.length + 1}`).toUpperCase(),
      importDate: recDate || '2026-09-15',
      supplier: recSupplier.trim() || 'Mercedes-Benz AG Sindelfingen (Đức)',
      vehicleName: summaryNames || 'Mercedes-Maybach S 680 4MATIC',
      modelCode: 'MDD223',
      quantity: totalCars,
      unitCost: Math.round(totalValue / totalCars),
      totalAmount: totalValue,
      warehouse: 'Showroom Phú Mỹ Hưng (TP.HCM)',
      status: targetStatus,
      inspector: 'KS. Trần Anh Tuấn',
    };

    // Nếu bấm "Hoàn thành & Khóa phiếu", cộng luôn tồn kho cho các xe tương ứng
    if (targetStatus === 'completed') {
      setVehicles((prev) =>
        prev.map((v) => {
          const matchedRows = recItems.filter((r) => r.vehicleName === v.name);
          if (matchedRows.length === 0) return v;
          const addedQty = matchedRows.reduce(
            (sum, r) => sum + Math.max(0, Number(r.quantity) || 0),
            0
          );
          return { ...v, stock: v.stock + addedQty };
        })
      );
    }

    setImportReceipts((prev) => [newRec, ...prev]);
    setIsCreateReceiptOpen(false);
    triggerToast(
      targetStatus === 'completed'
        ? `Đã hoàn thành & khóa phiếu nhập "${newRec.id}"!`
        : `Đã lưu bản nháp phiếu nhập "${newRec.id}"!`
    );
  };

  const handleDeleteDraftReceipt = (rec: ImportReceipt) => {
    setImportReceipts((prev) => prev.filter((item) => item.id !== rec.id));
    triggerToast(`Đã xóa phiếu nhập bản nháp "${rec.id}"!`);
  };

  const handleCompleteDraftReceipt = (id: string) => {
    setImportReceipts((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status: 'completed' } : rec))
    );
    if (viewingReceipt && viewingReceipt.id === id) {
      setViewingReceipt({ ...viewingReceipt, status: 'completed' });
    }
    triggerToast(`Đã chốt & khóa phiếu nhập "${id}" thành công!`);
  };

  // =====================================================================
  // XỬ LÝ THAO TÁC TRỰC TIẾP TRÊN TAB CẤU HÌNH GIÁ BÁN REAL-TIME
  // =====================================================================
  // Gõ trực tiếp vào ô % lợi nhuận của từng xe
  const handleMarginChange = (id: string, rawVal: string) => {
    const normalized = rawVal.replace(',', '.');
    const marginNum = Math.max(0, Number(normalized) || 0);

    setPricingConfigs((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const calculatedPrice = Math.round(item.baseCost * (1 + marginNum / 100));
        return {
          ...item,
          dealerMarginPercent: marginNum,
          listedPrice: calculatedPrice,
          updatedAt: 'Vừa xong',
        };
      })
    );
  };

  // Áp dụng tỷ lệ lợi nhuận đồng loạt cho phân khúc đã chọn
  const handleApplyBulkMargin = () => {
    const normalized = bulkMarginInput.replace(',', '.').trim();
    const marginNum = Number(normalized);
    if (!normalized || isNaN(marginNum) || marginNum < 0) {
      triggerToast('Vui lòng nhập tỷ lệ lợi nhuận (%) hợp lệ để áp dụng đồng loạt!');
      return;
    }

    setPricingConfigs((prev) =>
      prev.map((item) => {
        if (bulkSegment !== 'all' && item.segment !== bulkSegment) {
          return item;
        }
        const calculatedPrice = Math.round(item.baseCost * (1 + marginNum / 100));
        return {
          ...item,
          dealerMarginPercent: marginNum,
          listedPrice: calculatedPrice,
          updatedAt: 'Đồng loạt',
        };
      })
    );

    triggerToast(
      `Đã áp dụng biên lợi nhuận ${marginNum}% cho ${
        bulkSegment === 'all' ? 'tất cả các dòng xe' : `phân khúc ${bulkSegment}`
      }!`
    );
  };

  // Lưu cấu hình giá đồng bộ sang bảng Danh sách xe
  const handleSavePricingConfig = () => {
    setVehicles((prev) =>
      prev.map((v) => {
        const matched = pricingConfigs.find(
          (cfg) => cfg.modelCode === v.modelCode || cfg.vehicleName === v.name
        );
        if (!matched) return v;
        return { ...v, price: matched.listedPrice };
      })
    );
    triggerToast('Đã lưu & đồng bộ cấu hình giá niêm yết lên toàn hệ thống Showroom!');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f8f7f4] overflow-hidden select-none font-sans">
      
      {/* ================================================================= */}
      {/* 1. TOP BAR: TÌM KIẾM NHANH & NÚT VỀ DASHBOARD (ĐÃ BỎ SHOWROOM)    */}
      {/* ================================================================= */}
      <header
        className={`shrink-0 h-16 bg-white border-b border-zinc-200/70 px-8 flex items-center justify-between gap-4 transition-all duration-500 ${
          isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'
        }`}
      >
        {/* Ô tìm kiếm nhanh trên thanh Topbar */}
        <div className="relative w-96 max-w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Tìm kiếm nhanh sản phẩm, mã xe, phân khúc..."
            className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-50/90 border border-zinc-200/80 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-[#b8955a] transition-all"
          />
        </div>

        {/* Nút Về Dashboard bên phải */}
        <button
          type="button"
          onClick={() => navigate('/admin/dashboard')}
          className="h-10 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
        >
          <ArrowLeft className="size-3.5 text-zinc-600" />
          <span>Về Dashboard</span>
        </button>
      </header>

      {/* Thông báo Toast */}
      {toastMessage && (
        <div className="bg-emerald-600 text-white px-8 py-2 flex items-center gap-2 text-xs font-semibold animate-in fade-in duration-200 shadow-sm shrink-0">
          <CheckCircle2 className="size-4 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ================================================================= */}
      {/* 2. KHU VỰC NỘI DUNG CHÍNH CUỘN MƯỢT MÀ                           */}
      {/* ================================================================= */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-5">
        
        {/* Breadcrumb + Tiêu đề Serif + Huy hiệu Tổng tồn kho */}
        <div
          className={`flex flex-wrap items-end justify-between gap-4 transition-all duration-700 ${
            isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
          }`}
        >
          <div>
            {/* Breadcrumb */}
            <div className="flex items-center gap-1.5 text-xs text-zinc-400 mb-1.5">
              <span>Đại lý Mercedes-Benz</span>
              <span>/</span>
              <span>Kho sản phẩm</span>
              <span>/</span>
              <span className="text-[#b8955a] font-medium">Quản lý Sản phẩm & Xe</span>
            </div>

            {/* Tiêu đề chính font có chân sang trọng giống mẫu */}
            <h1 className="text-[28px] leading-tight font-serif font-bold text-zinc-900 tracking-tight">
              Quản Lý Sản Phẩm & Xe Mercedes-Benz
            </h1>
          </div>

          {/* Huy hiệu Tổng tồn kho: 22 xe */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-zinc-200/90 shadow-2xs">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="text-xs text-zinc-600 font-medium">
              Tổng tồn kho: <strong className="text-zinc-900 font-bold">{totalInventoryStock} xe</strong>
            </span>
          </div>
        </div>

        {/* ================================================================= */}
        {/* 3. THANH TABS ĐIỀU HƯỚNG (4 TABS NHƯ TRONG HÌNH)                 */}
        {/* ================================================================= */}
        <div className="border-b border-zinc-200/80 flex items-center gap-7">
          {/* Tab 1: Danh sách xe */}
          <button
            type="button"
            onClick={() => setActiveTab('vehicles')}
            className={`pb-3.5 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'vehicles'
                ? 'border-[#b8955a] text-[#9a7840]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Car className="size-4" />
            <span>Danh sách xe</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'vehicles'
                  ? 'bg-[#f6efe3] text-[#9a7840]'
                  : 'bg-zinc-200/70 text-zinc-600'
              }`}
            >
              {vehicles.length}
            </span>
          </button>

          {/* Tab 2: Loại sản phẩm */}
          <button
            type="button"
            onClick={() => setActiveTab('categories')}
            className={`pb-3.5 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'categories'
                ? 'border-[#b8955a] text-[#9a7840]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Layers className="size-4" />
            <span>Loại sản phẩm</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'categories'
                  ? 'bg-[#f6efe3] text-[#9a7840]'
                  : 'bg-zinc-200/70 text-zinc-600'
              }`}
            >
              {categories.length}
            </span>
          </button>

          {/* Tab 3: Phiếu nhập hàng */}
          <button
            type="button"
            onClick={() => setActiveTab('imports')}
            className={`pb-3.5 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'imports'
                ? 'border-[#b8955a] text-[#9a7840]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <FileSpreadsheet className="size-4" />
            <span>Phiếu nhập hàng</span>
            <span
              className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                activeTab === 'imports'
                  ? 'bg-[#f6efe3] text-[#9a7840]'
                  : 'bg-zinc-200/70 text-zinc-600'
              }`}
            >
              {importReceipts.length}
            </span>
          </button>

          {/* Tab 4: Cấu hình Giá bán REAL-TIME */}
          <button
            type="button"
            onClick={() => setActiveTab('pricing')}
            className={`pb-3.5 flex items-center gap-2 text-xs font-semibold border-b-2 transition-all cursor-pointer ${
              activeTab === 'pricing'
                ? 'border-[#b8955a] text-[#9a7840]'
                : 'border-transparent text-zinc-500 hover:text-zinc-800'
            }`}
          >
            <Sliders className="size-4" />
            <span>Cấu hình Giá bán</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-200/70 text-[10px] font-bold tracking-wider uppercase">
              REAL-TIME
            </span>
          </button>
        </div>

        {/* ================================================================= */}
        {/* 4. NỘI DUNG TỪNG TAB                                             */}
        {/* ================================================================= */}

        {/* TAB 1: DANH SÁCH XE */}
        {activeTab === 'vehicles' && (
          <div className="space-y-4">
            {/* Thanh Bộ lọc + Nút Thêm xe mới nằm trong khung trắng bo góc */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              {/* Ô tìm kiếm theo tên phiên bản, mã model */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Tìm theo tên phiên bản, mã model..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-[#b8955a] transition-all"
                />
              </div>

              {/* Cụm bộ lọc bên phải */}
              <div className="flex items-center gap-3">
                {/* Dropdown Tất cả phân khúc */}
                <div className="relative">
                  <select
                    value={selectedSegment}
                    onChange={(e) => setSelectedSegment(e.target.value as 'all' | VehicleSegment)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-white border border-zinc-200/90 text-xs font-medium text-zinc-700 focus:outline-none focus:border-[#b8955a] appearance-none cursor-pointer transition-all"
                  >
                    <option value="all">Tất cả phân khúc</option>
                    <option value="Maybach">Maybach</option>
                    <option value="AMG">AMG</option>
                    <option value="Sedan">Sedan</option>
                    <option value="SUV">SUV</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                </div>

                {/* Dropdown Tất cả trạng thái */}
                <div className="relative">
                  <select
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value as 'all' | VehicleSaleStatus)}
                    className="h-10 pl-4 pr-9 rounded-xl bg-white border border-zinc-200/90 text-xs font-medium text-zinc-700 focus:outline-none focus:border-[#b8955a] appearance-none cursor-pointer transition-all"
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="selling">Đang bán</option>
                    <option value="hidden">Tạm ẩn</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                </div>

                {/* Nút + Thêm xe mới */}
                <button
                  type="button"
                  onClick={handleOpenAddModal}
                  className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="size-3.5" />
                  <span>+ Thêm xe mới</span>
                </button>
              </div>
            </div>

            {/* Bảng Danh sách xe (9 cột chuẩn xác như hình mẫu) */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[920px]">
                  <colgroup>
                    <col className="w-[4%]" />
                    <col className="w-[8%]" />
                    <col className="w-[27%]" />
                    <col className="w-[10%]" />
                    <col className="w-[9%]" />
                    <col className="w-[15%]" />
                    <col className="w-[7%]" />
                    <col className="w-[9%]" />
                    <col className="w-[11%]" />
                  </colgroup>

                  {/* Header cột */}
                  <thead className="bg-zinc-50/70 border-b border-zinc-200/70">
                    <tr className="text-[10.5px] uppercase tracking-wider text-zinc-400 font-bold">
                      <th className="py-4 pl-5 pr-2">
                        <input
                          type="checkbox"
                          checked={isAllSelected}
                          onChange={handleToggleSelectAll}
                          className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer accent-zinc-900"
                        />
                      </th>
                      <th className="py-4 px-2">ẢNH XE</th>
                      <th className="py-4 px-3">TÊN PHIÊN BẢN</th>
                      <th className="py-4 px-2 leading-tight">
                        MÃ
                        <br />
                        MODEL
                      </th>
                      <th className="py-4 px-2 leading-tight">
                        PHÂN
                        <br />
                        KHÚC
                      </th>
                      <th className="py-4 px-3">GIÁ NIÊM YẾT</th>
                      <th className="py-4 px-2 leading-tight">
                        TỒN
                        <br />
                        KHO
                      </th>
                      <th className="py-4 px-2 text-center leading-tight">
                        TRẠNG
                        <br />
                        THÁI
                      </th>
                      <th className="py-4 pr-5 pl-2 text-center">THAO TÁC</th>
                    </tr>
                  </thead>

                  {/* Danh sách dòng */}
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {filteredVehicles.length === 0 ? (
                      <tr>
                        <td colSpan={9} className="py-16 text-center text-zinc-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <Car className="size-8 text-zinc-300" />
                            <p className="text-sm font-semibold text-zinc-600">
                              Không tìm thấy mẫu xe nào phù hợp
                            </p>
                            <p className="text-xs text-zinc-400">
                              Hãy thử thay đổi bộ lọc phân khúc hoặc từ khóa tìm kiếm
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredVehicles.map((vehicle) => {
                        const isSelling = vehicle.status === 'selling';
                        const isLowStock = vehicle.stock <= 2;
                        const isChecked = selectedIds.includes(vehicle.id);

                        return (
                          <tr
                            key={vehicle.id}
                            className={`hover:bg-zinc-50/70 transition-colors ${
                              isChecked ? 'bg-amber-50/20' : ''
                            }`}
                          >
                            {/* 1. Checkbox */}
                            <td className="py-4 pl-5 pr-2 align-middle">
                              <input
                                type="checkbox"
                                checked={isChecked}
                                onChange={() => handleToggleSelectRow(vehicle.id)}
                                className="size-4 rounded border-zinc-300 text-zinc-900 focus:ring-0 cursor-pointer accent-zinc-900"
                              />
                            </td>

                            {/* 2. Ảnh xe */}
                            <td className="py-4 px-2 align-middle">
                              <div className="w-16 h-11 rounded-lg overflow-hidden bg-zinc-900 border border-zinc-200/80 shadow-2xs shrink-0">
                                <img
                                  src={vehicle.imageUrl}
                                  alt={vehicle.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                            </td>

                            {/* 3. Tên phiên bản & Mô tả ngắn */}
                            <td className="py-4 px-3 align-middle">
                              <p className="font-bold text-zinc-900 text-[13px] leading-snug">
                                {vehicle.name}
                              </p>
                              <p className="text-[11.5px] text-zinc-400 mt-0.5 line-clamp-2 leading-relaxed">
                                {vehicle.description}
                              </p>
                            </td>

                            {/* 4. Mã Model */}
                            <td className="py-4 px-2 align-middle">
                              <span className="inline-block px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 font-mono text-[11px] font-semibold">
                                {vehicle.modelCode}
                              </span>
                            </td>

                            {/* 5. Phân khúc */}
                            <td className="py-4 px-2 align-middle">
                              <span className="inline-block px-3 py-1 rounded-full bg-zinc-100/90 text-zinc-700 text-[11px] font-semibold">
                                {vehicle.segment}
                              </span>
                            </td>

                            {/* 6. Giá niêm yết (Màu vàng đồng sang trọng) */}
                            <td className="py-4 px-3 align-middle whitespace-nowrap">
                              <span className="font-bold text-[#9a7840] text-[13px] tabular-nums">
                                {formatPriceVND(vehicle.price)}
                              </span>
                            </td>

                            {/* 7. Tồn kho ( <= 2 xe tô đỏ như hình mẫu ) */}
                            <td className="py-4 px-2 align-middle whitespace-nowrap">
                              <span
                                className={`font-bold text-xs tabular-nums ${
                                  isLowStock ? 'text-rose-600' : 'text-zinc-900'
                                }`}
                              >
                                {vehicle.stock} xe
                              </span>
                            </td>

                            {/* 8. Trạng thái */}
                            <td className="py-4 px-2 align-middle text-center">
                              <button
                                type="button"
                                onClick={() => handleToggleVehicleStatus(vehicle.id)}
                                title="Bấm để đổi nhanh trạng thái"
                                className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-[11px] font-semibold leading-tight transition-all cursor-pointer ${
                                  isSelling
                                    ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                    : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200/80'
                                }`}
                              >
                                {isSelling ? (
                                  <span className="block text-center">
                                    Đang
                                    <br />
                                    bán
                                  </span>
                                ) : (
                                  <span>Tạm ẩn</span>
                                )}
                              </button>
                            </td>

                            {/* 9. Thao tác: Sửa, Xem, Xóa */}
                            <td className="py-4 pr-5 pl-2 align-middle text-center whitespace-nowrap">
                              <div className="inline-flex items-center justify-center gap-1.5">
                                {/* Sửa */}
                                <button
                                  type="button"
                                  onClick={() => handleOpenEditModal(vehicle)}
                                  className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                  title="Chỉnh sửa thông tin xe"
                                >
                                  <SquarePen className="size-3.5" />
                                </button>

                                {/* Xem chi tiết */}
                                <button
                                  type="button"
                                  onClick={() => setViewingVehicle(vehicle)}
                                  className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                  title="Xem chi tiết thông số"
                                >
                                  <Eye className="size-3.5" />
                                </button>

                                {/* Xóa */}
                                <button
                                  type="button"
                                  onClick={() => setDeletingVehicle(vehicle)}
                                  className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-rose-50 hover:border-rose-200 text-zinc-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                  title="Xóa mẫu xe"
                                >
                                  <Trash2 className="size-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 2: LOẠI SẢN PHẨM (CHUẨN XÁC THEO HÌNH MẪU 2 CỘT TRÁI - PHẢI)  */}
        {/* ================================================================= */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* CỘT TRÁI (4/12): THÊM PHÂN KHÚC MỚI */}
            <div className="lg:col-span-4 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs">
              <div className="mb-5">
                <h2 className="text-[19px] font-serif font-bold text-zinc-900">
                  {editingCategoryId ? 'Chỉnh Sửa Phân Khúc' : 'Thêm Phân Khúc Mới'}
                </h2>
                <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                  Định danh nhóm xe theo chuẩn Mercedes-Benz toàn cầu
                </p>
              </div>

              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                {/* Mã phân khúc * */}
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Mã phân khúc <span className="text-zinc-800">*</span>
                  </label>
                  <input
                    type="text"
                    value={catCode}
                    onChange={(e) => setCatCode(e.target.value)}
                    placeholder="Ví dụ: CAT-EQS"
                    className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                  />
                </div>

                {/* Tên phân khúc * */}
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Tên phân khúc <span className="text-zinc-800">*</span>
                  </label>
                  <input
                    type="text"
                    value={catName}
                    onChange={(e) => setCatName(e.target.value)}
                    placeholder="Ví dụ: Mercedes-EQ Thuần điện"
                    className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                  />
                </div>

                {/* Mô tả định vị */}
                <div>
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Mô tả định vị
                  </label>
                  <textarea
                    rows={3}
                    value={catDescription}
                    onChange={(e) => setCatDescription(e.target.value)}
                    placeholder="Đặc tính sản phẩm và phân khúc khách hàng mục tiêu..."
                    className="w-full p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all resize-none leading-relaxed"
                  />
                </div>

                {/* Nút + Lưu phân khúc xe */}
                <div className="pt-1 flex items-center gap-2">
                  {editingCategoryId && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingCategoryId(null);
                        setCatCode('');
                        setCatName('');
                        setCatDescription('');
                      }}
                      className="h-11 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-600 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Hủy
                    </button>
                  )}
                  <button
                    type="submit"
                    className="flex-1 h-11 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs active:scale-98"
                  >
                    <span>{editingCategoryId ? 'Cập nhật phân khúc' : '+ Lưu phân khúc xe'}</span>
                  </button>
                </div>
              </form>
            </div>

            {/* CỘT PHẢI (8/12): DANH MỤC PHÂN KHÚC HIỆN CÓ */}
            <div className="lg:col-span-8 bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs overflow-hidden">
              <div className="mb-5">
                <h2 className="text-[19px] font-serif font-bold text-zinc-900">
                  Danh Mục Phân Khúc Hiện Có
                </h2>
                <p className="text-xs text-zinc-400 mt-1">
                  Quản lý và điều phối các dòng xe thuộc từng danh mục
                </p>
              </div>

              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[640px]">
                  <colgroup>
                    <col className="w-[15%]" />
                    <col className="w-[37%]" />
                    <col className="w-[16%]" />
                    <col className="w-[16%]" />
                    <col className="w-[16%]" />
                  </colgroup>

                  {/* Header bảng */}
                  <thead className="bg-zinc-50/70 border-y border-zinc-100">
                    <tr className="text-[10.5px] uppercase tracking-wider text-zinc-400 font-bold">
                      <th className="py-3.5 px-3">MÃ LOẠI</th>
                      <th className="py-3.5 px-3">TÊN PHÂN KHÚC</th>
                      <th className="py-3.5 px-2 leading-tight">
                        SỐ XE TRỰC
                        <br />
                        THUỘC
                      </th>
                      <th className="py-3.5 px-2 text-center">TRẠNG THÁI</th>
                      <th className="py-3.5 px-2 text-center">THAO TÁC</th>
                    </tr>
                  </thead>

                  {/* Dữ liệu bảng */}
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {categories.map((cat) => {
                      const isActive = cat.status === 'active';
                      const codeParts = cat.code.split('-');
                      const isLongCode = cat.code === 'CAT-MAYBACH' || cat.code === 'CAT-SEDAN';

                      return (
                        <tr
                          key={cat.id}
                          className="hover:bg-zinc-50/60 transition-colors"
                        >
                          {/* 1. Mã loại */}
                          <td className="py-5 px-3 align-middle">
                            <span className="inline-block px-2.5 py-1.5 rounded-lg bg-zinc-100/90 text-zinc-700 font-mono text-[10.5px] font-bold text-center leading-tight">
                              {isLongCode && codeParts.length === 2 ? (
                                <>
                                  {codeParts[0]}-
                                  <br />
                                  {codeParts[1]}
                                </>
                              ) : (
                                cat.code
                              )}
                            </span>
                          </td>

                          {/* 2. Tên phân khúc & mô tả */}
                          <td className="py-5 px-3 align-middle">
                            <p className="font-bold text-zinc-900 text-[13.5px] leading-snug">
                              {cat.name}
                            </p>
                            <p className="text-[11.5px] text-zinc-400 mt-0.5 leading-relaxed">
                              {cat.description}
                            </p>
                          </td>

                          {/* 3. Số xe trực thuộc (Màu vàng đồng đậm giống ảnh) */}
                          <td className="py-5 px-2 align-middle whitespace-nowrap">
                            <span className="font-bold text-[#9a7840] text-xs">
                              {cat.vehicleCount} phiên bản
                            </span>
                          </td>

                          {/* 4. Trạng thái */}
                          <td className="py-5 px-2 align-middle text-center">
                            <button
                              type="button"
                              onClick={() => handleToggleCategoryStatus(cat.id)}
                              title="Bấm để chuyển đổi trạng thái"
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-xl text-[11px] font-semibold leading-tight transition-all cursor-pointer ${
                                isActive
                                  ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                  : 'bg-zinc-100 text-zinc-500 hover:bg-zinc-200/80'
                              }`}
                            >
                              {isActive ? (
                                <span className="block text-center">
                                  Đang áp
                                  <br />
                                  dụng
                                </span>
                              ) : (
                                <span>Tạm ẩn</span>
                              )}
                            </button>
                          </td>

                          {/* 5. Thao tác: Sửa, Ẩn/Hiện (EyeOff), Xóa */}
                          <td className="py-5 px-2 align-middle text-center whitespace-nowrap">
                            <div className="inline-flex items-center justify-center gap-1.5">
                              {/* Sửa */}
                              <button
                                type="button"
                                onClick={() => handleEditCategoryRow(cat)}
                                className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                title="Chỉnh sửa phân khúc"
                              >
                                <SquarePen className="size-3.5" />
                              </button>

                              {/* Tạm ẩn / Hiện (Icon con mắt gạch chéo giống ảnh mẫu) */}
                              <button
                                type="button"
                                onClick={() => handleToggleCategoryStatus(cat.id)}
                                className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                title={isActive ? 'Tạm ẩn phân khúc' : 'Kích hoạt lại'}
                              >
                                <EyeOff className="size-3.5" />
                              </button>

                              {/* Xóa */}
                              <button
                                type="button"
                                onClick={() => handleDeleteCategoryRow(cat)}
                                className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-rose-50 hover:border-rose-200 text-zinc-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                title="Xóa phân khúc"
                              >
                                <Trash2 className="size-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 3: PHIẾU NHẬP HÀNG (CHUẨN XÁC THEO HÌNH MẪU)                  */}
        {/* ================================================================= */}
        {activeTab === 'imports' && (
          <div className="space-y-4">
            {/* Thanh công cụ Tìm kiếm + Lọc Từ ngày / Đến ngày + Nút Tạo phiếu nhập mới */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 p-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
              {/* Ô tìm kiếm tra cứu mã phiếu nhập, cảng, nhà cung cấp */}
              <div className="relative flex-1 min-w-[260px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
                <input
                  type="text"
                  value={importSearchQuery}
                  onChange={(e) => setImportSearchQuery(e.target.value)}
                  placeholder="Tra cứu mã phiếu nhập, cảng, nhà cung cấp..."
                  className="w-full h-10 pl-10 pr-4 rounded-xl bg-zinc-50/70 border border-zinc-200/80 text-xs text-zinc-800 placeholder-zinc-400 focus:outline-none focus:bg-white focus:border-[#b8955a] transition-all"
                />
              </div>

              {/* Cụm chọn khoảng ngày + Nút + Tạo phiếu nhập mới */}
              <div className="flex flex-wrap items-center gap-3">
                {/* Từ ngày */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Từ:</span>
                  <input
                    type="date"
                    value={importFromDate}
                    onChange={(e) => setImportFromDate(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white border border-zinc-200/90 text-xs text-zinc-700 font-medium focus:outline-none focus:border-[#b8955a] cursor-pointer"
                  />
                </div>

                {/* Đến ngày */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400">Đến:</span>
                  <input
                    type="date"
                    value={importToDate}
                    onChange={(e) => setImportToDate(e.target.value)}
                    className="h-10 px-3 rounded-xl bg-white border border-zinc-200/90 text-xs text-zinc-700 font-medium focus:outline-none focus:border-[#b8955a] cursor-pointer"
                  />
                </div>

                {/* Nút + Tạo phiếu nhập mới */}
                <button
                  type="button"
                  onClick={handleOpenCreateReceipt}
                  className="h-10 px-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Plus className="size-3.5" />
                  <span>+ Tạo phiếu nhập mới</span>
                </button>
              </div>
            </div>

            {/* Bảng Danh sách Phiếu nhập hàng (7 cột chuẩn xác như hình mẫu) */}
            <div className="bg-white rounded-2xl border border-zinc-200/80 shadow-2xs overflow-hidden">
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[840px]">
                  <colgroup>
                    <col className="w-[11%]" />
                    <col className="w-[10%]" />
                    <col className="w-[31%]" />
                    <col className="w-[10%]" />
                    <col className="w-[15%]" />
                    <col className="w-[14%]" />
                    <col className="w-[9%]" />
                  </colgroup>

                  {/* Header bảng */}
                  <thead className="bg-zinc-50/70 border-b border-zinc-200/70">
                    <tr className="text-[10.5px] uppercase tracking-wider text-zinc-400 font-bold">
                      <th className="py-4 pl-6 pr-2">MÃ PHIẾU</th>
                      <th className="py-4 px-2">NGÀY LẬP</th>
                      <th className="py-4 px-3">CẢNG / NHÀ CUNG CẤP</th>
                      <th className="py-4 px-2 leading-tight">
                        SỐ LƯỢNG
                        <br />
                        XE
                      </th>
                      <th className="py-4 px-3 leading-tight">
                        TỔNG GIÁ TRỊ
                        <br />
                        NHẬP
                      </th>
                      <th className="py-4 px-2">TRẠNG THÁI</th>
                      <th className="py-4 pr-6 pl-2 text-center">THAO TÁC</th>
                    </tr>
                  </thead>

                  {/* Dữ liệu bảng */}
                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {filteredImportReceipts.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="py-16 text-center text-zinc-400">
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileSpreadsheet className="size-8 text-zinc-300" />
                            <p className="text-sm font-semibold text-zinc-600">
                              Không tìm thấy phiếu nhập kho nào phù hợp
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredImportReceipts.map((rec) => {
                        const isCompleted = rec.status === 'completed';
                        // Tách mã phiếu thành 2 dòng giống ảnh: PN-2026- \n 001
                        const codeMatch = rec.id.match(/^(PN-\d{4}-)(.+)$/);
                        // Tách ngày lập thành 2 dòng nếu là 08 hoặc 14 giống ảnh, hoặc cho phép wrap tự nhiên
                        const dateParts = rec.importDate.split('-');
                        const shouldWrapDate =
                          rec.id === 'PN-2026-001' || rec.id === 'PN-2026-003';

                        return (
                          <tr key={rec.id} className="hover:bg-zinc-50/60 transition-colors">
                            {/* 1. Mã phiếu */}
                            <td className="py-5 pl-6 pr-2 align-middle font-mono font-bold text-zinc-900 text-xs leading-snug">
                              {codeMatch ? (
                                <>
                                  {codeMatch[1]}
                                  <br />
                                  {codeMatch[2]}
                                </>
                              ) : (
                                rec.id
                              )}
                            </td>

                            {/* 2. Ngày lập */}
                            <td className="py-5 px-2 align-middle text-zinc-500 tabular-nums text-xs leading-snug">
                              {shouldWrapDate && dateParts.length === 3 ? (
                                <>
                                  {dateParts[0]}-{dateParts[1]}-
                                  <br />
                                  {dateParts[2]}
                                </>
                              ) : (
                                rec.importDate
                              )}
                            </td>

                            {/* 3. Cảng / Nhà cung cấp */}
                            <td className="py-5 px-3 align-middle">
                              <p className="font-bold text-zinc-900 text-[13px] leading-snug">
                                {rec.supplier}
                              </p>
                            </td>

                            {/* 4. Số lượng xe */}
                            <td className="py-5 px-2 align-middle whitespace-nowrap">
                              <span className="font-bold text-zinc-900 text-xs">
                                {rec.quantity} xe
                              </span>
                            </td>

                            {/* 5. Tổng giá trị nhập (Màu vàng đồng sang trọng) */}
                            <td className="py-5 px-3 align-middle whitespace-nowrap">
                              <span className="font-bold text-[#9a7840] text-[13px] tabular-nums">
                                {formatPriceVND(rec.totalAmount)}
                              </span>
                            </td>

                            {/* 6. Trạng thái */}
                            <td className="py-5 px-2 align-middle">
                              {isCompleted ? (
                                <div className="inline-flex items-start gap-1.5 px-3 py-1.5 rounded-2xl bg-zinc-100/95 text-zinc-600 text-[11px] font-semibold leading-tight max-w-[138px]">
                                  <Lock className="size-3 text-amber-600 shrink-0 mt-0.5" />
                                  <span>
                                    Đã hoàn thành - Đã
                                    <br />
                                    khóa
                                  </span>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleCompleteDraftReceipt(rec.id)}
                                  title="Bấm để chốt & khóa phiếu nhập này"
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 hover:bg-amber-100 text-amber-700 text-[11px] font-semibold transition-colors cursor-pointer"
                                >
                                  <Pencil className="size-3 text-amber-600 shrink-0" />
                                  <span>Bản nháp</span>
                                </button>
                              )}
                            </td>

                            {/* 7. Thao tác */}
                            <td className="py-5 pr-6 pl-2 align-middle text-center whitespace-nowrap">
                              <div className="inline-flex items-center justify-center gap-1.5">
                                {/* Nút Xem chi tiết (Luôn hiển thị) */}
                                <button
                                  type="button"
                                  onClick={() => setViewingReceipt(rec)}
                                  className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-600 hover:text-zinc-900 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                  title="Xem chi tiết phiếu nhập"
                                >
                                  <Eye className="size-3.5" />
                                </button>

                                {/* Nút Xóa (Chỉ hiển thị khi là Bản nháp giống hệt ảnh mẫu) */}
                                {!isCompleted && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDraftReceipt(rec)}
                                    className="size-8 rounded-lg border border-zinc-200/90 bg-white hover:bg-rose-50 hover:border-rose-200 text-zinc-600 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                                    title="Xóa phiếu nhập bản nháp"
                                  >
                                    <Trash2 className="size-3.5" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================================================================= */}
        {/* TAB 4: CẤU HÌNH GIÁ BÁN REAL-TIME (CHUẨN XÁC THEO HÌNH MẪU)       */}
        {/* ================================================================= */}
        {activeTab === 'pricing' && (
          <div className="space-y-5">
            
            {/* KHỐI 1: QUY TẮC ĐỊNH GIÁ TỰ ĐỘNG - THIẾT LẬP TỶ LỆ LỢI NHUẬN ĐỒNG LOẠT */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 p-6 shadow-2xs">
              {/* Huy hiệu QUY TẮC ĐỊNH GIÁ TỰ ĐỘNG */}
              <span className="inline-block px-3 py-1 rounded-full bg-[#f6efe3] text-[#9a7840] text-[10px] font-mono font-bold tracking-[0.12em] uppercase">
                QUY TẮC ĐỊNH GIÁ TỰ ĐỘNG
              </span>

              {/* Tiêu đề & phụ đề */}
              <h2 className="text-[19px] font-serif font-bold text-zinc-900 mt-2.5">
                Thiết Lập Tỷ Lệ Lợi Nhuận Đồng Loạt
              </h2>
              <p className="text-xs text-zinc-400 mt-1">
                Áp dụng biên lợi nhuận kỳ vọng (% LN) cho toàn bộ phiên bản thuộc phân khúc đã chọn
              </p>

              {/* Hàng điều khiển: Chọn phân khúc áp dụng | Tỷ lệ lợi nhuận (%) | Nút Áp dụng đồng loạt */}
              <div className="mt-4 flex flex-wrap items-end gap-3 text-xs">
                {/* Chọn phân khúc áp dụng */}
                <div className="w-56">
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Chọn phân khúc áp dụng:
                  </label>
                  <div className="relative">
                    <select
                      value={bulkSegment}
                      onChange={(e) => setBulkSegment(e.target.value as 'all' | VehicleSegment)}
                      className="w-full h-10 pl-3.5 pr-9 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-xs font-medium text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] appearance-none cursor-pointer transition-all"
                    >
                      <option value="all">- Tất cả các dòng xe -</option>
                      <option value="Maybach">Maybach</option>
                      <option value="AMG">AMG</option>
                      <option value="Sedan">Sedan</option>
                      <option value="SUV">SUV</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                  </div>
                </div>

                {/* Tỷ lệ lợi nhuận (%) */}
                <div className="w-40">
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Tỷ lệ lợi nhuận (%):
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={bulkMarginInput}
                      onChange={(e) => setBulkMarginInput(e.target.value)}
                      placeholder="Ví dụ: 15"
                      className="w-full h-10 pl-3.5 pr-8 rounded-xl bg-zinc-50/80 border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 tabular-nums focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-zinc-500">
                      %
                    </span>
                  </div>
                </div>

                {/* Nút ✓ Áp dụng đồng loạt */}
                <button
                  type="button"
                  onClick={handleApplyBulkMargin}
                  className="h-10 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  <Check className="size-3.5" />
                  <span>Áp dụng đồng loạt</span>
                </button>
              </div>
            </div>

            {/* KHỐI 2: BẢNG TÍNH GIÁ NIÊM YẾT THEO THỜI GIAN THỰC */}
            <div className="bg-white rounded-3xl border border-zinc-200/80 shadow-2xs overflow-hidden">
              {/* Header bảng */}
              <div className="px-6 py-5 border-b border-zinc-100 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-[19px] font-serif font-bold text-zinc-900">
                    Bảng Tính Giá Niêm Yết Theo Thời Gian Thực
                  </h2>
                  <p className="text-xs text-zinc-400 mt-1">
                    Công thức tính:{' '}
                    <code className="px-1.5 py-0.5 rounded bg-zinc-100 text-zinc-600 font-mono text-[11px]">
                      Giá bán = Giá vốn * (1 + % Lợi nhuận / 100)
                    </code>
                    . Gõ trực tiếp vào ô % để cập nhật tức thì.
                  </p>
                </div>

                {/* Nút Lưu cấu hình giá */}
                <button
                  type="button"
                  onClick={handleSavePricingConfig}
                  className="h-10 px-4 rounded-xl bg-white hover:bg-zinc-50 border border-zinc-200/90 text-zinc-800 text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-2xs active:scale-95"
                >
                  <Save className="size-3.5 text-zinc-700" />
                  <span>Lưu cấu hình giá</span>
                </button>
              </div>

              {/* Bảng 7 cột chuẩn xác như hình mẫu */}
              <div className="w-full overflow-x-auto">
                <table className="w-full text-left border-collapse table-fixed min-w-[880px]">
                  <colgroup>
                    <col className="w-[24%]" />
                    <col className="w-[9%]" />
                    <col className="w-[15%]" />
                    <col className="w-[13%]" />
                    <col className="w-[15%]" />
                    <col className="w-[14%]" />
                    <col className="w-[10%]" />
                  </colgroup>

                  <thead className="bg-zinc-50/70 border-b border-zinc-200/70">
                    <tr className="text-[10.5px] uppercase tracking-wider text-zinc-400 font-bold">
                      <th className="py-4 pl-6 pr-3">PHIÊN BẢN MODEL</th>
                      <th className="py-4 px-2 leading-tight">
                        PHÂN
                        <br />
                        KHÚC
                      </th>
                      <th className="py-4 px-3 leading-tight">
                        GIÁ VỐN NHẬP
                        <br />
                        (VNĐ)
                      </th>
                      <th className="py-4 px-2">% LỢI NHUẬN</th>
                      <th className="py-4 px-3">GIÁ BÁN TÍNH TOÁN</th>
                      <th className="py-4 px-3 leading-tight">
                        CHÊNH LỆCH LỢI
                        <br />
                        NHUẬN
                      </th>
                      <th className="py-4 pr-6 pl-2 text-center">HIỆU QUẢ</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-zinc-100 text-xs">
                    {pricingConfigs.map((cfg) => {
                      const calculatedPrice = Math.round(
                        cfg.baseCost * (1 + cfg.dealerMarginPercent / 100)
                      );
                      const profitDiff = calculatedPrice - cfg.baseCost;

                      return (
                        <tr key={cfg.id} className="hover:bg-zinc-50/60 transition-colors">
                          {/* 1. Phiên bản Model & Mã xe */}
                          <td className="py-4 pl-6 pr-3 align-middle">
                            <p className="font-bold text-zinc-900 text-[13px] leading-snug">
                              {cfg.vehicleName}
                            </p>
                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                              Mã xe: {cfg.id}
                            </p>
                          </td>

                          {/* 2. Phân khúc */}
                          <td className="py-4 px-2 align-middle">
                            <span className="inline-block px-3 py-1 rounded-full bg-zinc-100/90 text-zinc-700 text-[11px] font-semibold">
                              {cfg.segment}
                            </span>
                          </td>

                          {/* 3. Giá vốn nhập (VNĐ) */}
                          <td className="py-4 px-3 align-middle whitespace-nowrap">
                            <span className="font-semibold text-zinc-600 tabular-nums text-xs">
                              {formatPriceVND(cfg.baseCost)}
                            </span>
                          </td>

                          {/* 4. % Lợi nhuận (Ô input gõ trực tiếp có ký hiệu %) */}
                          <td className="py-4 px-2 align-middle">
                            <div className="relative w-24">
                              <input
                                type="number"
                                step="0.1"
                                min="0"
                                value={cfg.dealerMarginPercent}
                                onChange={(e) => handleMarginChange(cfg.id, e.target.value)}
                                className="w-full h-9 pl-3 pr-7 rounded-xl bg-[#fbfaf8] border border-zinc-200/90 text-right font-bold text-[#9a7840] text-xs tabular-nums focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                              />
                              <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[11px] font-bold text-zinc-500 pointer-events-none">
                                %
                              </span>
                            </div>
                          </td>

                          {/* 5. Giá bán tính toán (Màu vàng đồng sang trọng) */}
                          <td className="py-4 px-3 align-middle whitespace-nowrap">
                            <span className="font-bold text-[#9a7840] text-[13.5px] tabular-nums">
                              {formatPriceVND(calculatedPrice)}
                            </span>
                          </td>

                          {/* 6. Chênh lệch lợi nhuận (+2.439.000.000 ₫ màu xanh lá) */}
                          <td className="py-4 px-3 align-middle whitespace-nowrap">
                            <span className="font-bold text-emerald-600 text-xs tabular-nums">
                              +{formatPriceVND(profitDiff)}
                            </span>
                          </td>

                          {/* 7. Hiệu quả (Badge Đạt chuẩn) */}
                          <td className="py-4 pr-6 pl-2 align-middle text-center">
                            <span className="inline-flex items-center justify-center px-3 py-1 rounded-xl bg-emerald-50 text-emerald-700 text-[11px] font-semibold leading-tight">
                              Đạt
                              <br />
                              chuẩn
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* ================================================================= */}
      {/* 5. MODAL THÊM XE MỚI VÀO SHOWROOM (CHUẨN XÁC THEO HÌNH MẪU)       */}
      {/* ================================================================= */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setIsAddModalOpen(false)}
          />

          <div className="relative w-full max-w-[680px] bg-white rounded-[24px] shadow-2xl border border-zinc-200/80 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            <div className="px-7 pt-6 pb-4 border-b border-zinc-100 flex items-start justify-between">
              <div>
                <span className="text-[10.5px] font-mono font-bold tracking-[0.12em] text-[#b8955a] uppercase block">
                  QUẢN TRỊ DANH MỤC XE
                </span>
                <h2 className="text-[20px] font-serif font-bold text-zinc-900 mt-1">
                  {editingVehicle ? 'Chỉnh Sửa Thông Tin Xe' : 'Thêm Xe Mới Vào Showroom'}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="size-8 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <form onSubmit={handleSaveVehicle}>
              <div className="px-7 py-6 grid grid-cols-1 md:grid-cols-12 gap-6 text-xs">
                <div className="md:col-span-6 space-y-4">
                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Phân khúc xe <span className="text-zinc-800">*</span>
                    </label>
                    <div className="relative">
                      <select
                        value={formSegment}
                        onChange={(e) => setFormSegment(e.target.value as VehicleSegment)}
                        className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 font-medium focus:bg-white focus:outline-none focus:border-[#b8955a] appearance-none cursor-pointer transition-all"
                      >
                        <option value="Maybach">Mercedes-Maybach</option>
                        <option value="AMG">Mercedes-AMG</option>
                        <option value="Sedan">Mercedes-Benz Sedan</option>
                        <option value="SUV">Mercedes-Benz SUV</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Mã Model xe <span className="text-zinc-800">*</span>
                    </label>
                    <input
                      type="text"
                      value={formModelCode}
                      onChange={(e) => setFormModelCode(e.target.value)}
                      placeholder="Ví dụ: WDD223"
                      className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Tên phiên bản xe <span className="text-zinc-800">*</span>
                    </label>
                    <input
                      type="text"
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="Ví dụ: Mercedes-Maybach S 680 4MATIC"
                      className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-12 gap-3">
                    <div className="col-span-7">
                      <label className="font-semibold text-zinc-700 block mb-1.5">
                        Giá niêm yết (VNĐ) <span className="text-zinc-800">*</span>
                      </label>
                      <input
                        type="text"
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="15990000000"
                        className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-700 tabular-nums focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                      />
                    </div>

                    <div className="col-span-5">
                      <label className="font-semibold text-zinc-700 block mb-1.5">
                        Số lượng tồn <span className="text-zinc-800">*</span>
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        placeholder="1"
                        className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 tabular-nums focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Trạng thái phát hành
                    </label>
                    <div className="relative">
                      <select
                        value={formStatus}
                        onChange={(e) => setFormStatus(e.target.value as VehicleSaleStatus)}
                        className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 font-medium focus:bg-white focus:outline-none focus:border-[#b8955a] appearance-none cursor-pointer transition-all"
                      >
                        <option value="selling">Đang bán trên hệ thống</option>
                        <option value="hidden">Tạm ẩn khỏi danh mục</option>
                      </select>
                      <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 size-3.5 text-zinc-400 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-6 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="font-semibold text-zinc-700 block">
                        Ảnh đại diện xe
                      </label>
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-[11px] font-semibold text-[#9a7840] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <ImagePlus className="size-3" />
                        <span>Đổi ảnh</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleSelectImageFile}
                        className="hidden"
                      />
                    </div>

                    <div
                      onClick={() => fileInputRef.current?.click()}
                      title="Bấm để tải ảnh xe từ máy tính"
                      className="w-full h-[172px] rounded-2xl overflow-hidden bg-zinc-950 border border-zinc-200/80 shadow-xs cursor-pointer group relative"
                    >
                      <img
                        src={formImageUrl}
                        alt="Ảnh đại diện xe"
                        className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/25 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 transition-opacity px-3 py-1.5 rounded-lg bg-black/70 text-white text-[11px] font-medium">
                          Chọn ảnh khác
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col">
                    <label className="font-semibold text-zinc-700 block mb-1.5">
                      Mô tả thông số kỹ thuật
                    </label>
                    <textarea
                      rows={4}
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      placeholder="Động cơ V12 Biturbo, dung tích 6.0L, công suất 612 mã lực, hộp số 9G-TRONIC..."
                      className="w-full flex-1 min-h-[104px] p-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 placeholder-zinc-400 focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

              <div className="px-7 py-4 border-t border-zinc-100 flex items-center justify-end gap-3 bg-white">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="h-10 px-5 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-all cursor-pointer active:scale-95"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="h-10 px-6 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Lưu thông tin xe
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 6. MODAL TẠO PHIẾU NHẬP HÀNG MỚI (CHUẨN XÁC THEO HÌNH MẪU)         */}
      {/* ================================================================= */}
      {isCreateReceiptOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop mờ tối */}
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setIsCreateReceiptOpen(false)}
          />

          {/* Khung Modal */}
          <div className="relative w-full max-w-[700px] bg-white rounded-[24px] shadow-2xl border border-zinc-200/80 overflow-hidden z-10 animate-in zoom-in-95 duration-200">
            
            {/* Header Modal */}
            <div className="px-7 pt-6 pb-4 border-b border-zinc-100 flex items-start justify-between">
              <div>
                <span className="text-[10.5px] font-mono font-bold tracking-[0.12em] text-[#b8955a] uppercase block">
                  QUẢN TRỊ XUẤT NHẬP KHO
                </span>
                <h2 className="text-[20px] font-serif font-bold text-zinc-900 mt-1">
                  Tạo Phiếu Nhập Hàng Mới
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setIsCreateReceiptOpen(false)}
                className="size-8 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            {/* Body Modal */}
            <div className="px-7 py-6 space-y-5 text-xs">
              
              {/* Hàng 1: Mã phiếu nhập | Cảng / Nhà cung cấp * | Ngày lập phiếu * */}
              <div className="grid grid-cols-12 gap-4">
                {/* Mã phiếu nhập (nền xám đậm nhẹ giống ảnh) */}
                <div className="col-span-3">
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Mã phiếu nhập
                  </label>
                  <input
                    type="text"
                    value={recCode}
                    onChange={(e) => setRecCode(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-zinc-200/60 border border-zinc-200 text-xs font-mono font-bold text-zinc-800 focus:outline-none focus:border-[#b8955a]"
                  />
                </div>

                {/* Cảng / Nhà cung cấp * */}
                <div className="col-span-5">
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Cảng / Nhà cung cấp <span className="text-zinc-800">*</span>
                  </label>
                  <input
                    type="text"
                    value={recSupplier}
                    onChange={(e) => setRecSupplier(e.target.value)}
                    placeholder="Mercedes-Benz AG Sindelfingen (Đức)"
                    className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all"
                  />
                </div>

                {/* Ngày lập phiếu * */}
                <div className="col-span-4">
                  <label className="font-semibold text-zinc-700 block mb-1.5">
                    Ngày lập phiếu <span className="text-zinc-800">*</span>
                  </label>
                  <input
                    type="date"
                    value={recDate}
                    onChange={(e) => setRecDate(e.target.value)}
                    className="w-full h-10 px-3.5 rounded-xl bg-zinc-50/70 border border-zinc-200/90 text-xs text-zinc-800 font-medium focus:bg-white focus:outline-none focus:border-[#b8955a] transition-all cursor-pointer"
                  />
                </div>
              </div>

              {/* Khối 2: DANH SÁCH XE TRONG LÔ HÀNG */}
              <div className="rounded-2xl border border-zinc-200/80 overflow-hidden bg-white">
                {/* Thanh tiêu đề phụ + Nút + Thêm dòng xe */}
                <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-200/70 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-700">
                    DANH SÁCH XE TRONG LÔ HÀNG
                  </span>

                  <button
                    type="button"
                    onClick={handleAddReceiptRow}
                    className="px-3 py-1 rounded-lg bg-white hover:bg-zinc-50 border border-zinc-200 text-[11px] font-semibold text-[#9a7840] transition-all cursor-pointer shadow-2xs active:scale-95"
                  >
                    + Thêm dòng xe
                  </button>
                </div>

                {/* Bảng các dòng xe trong lô */}
                <div className="w-full overflow-x-auto max-h-[220px] overflow-y-auto">
                  <table className="w-full text-left border-collapse table-fixed">
                    <colgroup>
                      <col className="w-[33%]" />
                      <col className="w-[26%]" />
                      <col className="w-[14%]" />
                      <col className="w-[20%]" />
                      <col className="w-[7%]" />
                    </colgroup>

                    <thead className="border-b border-zinc-100 text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                      <tr>
                        <th className="py-2.5 pl-4 pr-2">PHIÊN BẢN XE</th>
                        <th className="py-2.5 px-2">GIÁ VỐN NHẬP (VNĐ)</th>
                        <th className="py-2.5 px-2">SỐ LƯỢNG</th>
                        <th className="py-2.5 px-2">THÀNH TIỀN (VNĐ)</th>
                        <th className="py-2.5 pr-4 pl-1 text-center">XÓA</th>
                      </tr>
                    </thead>

                    <tbody className="divide-y divide-zinc-100">
                      {recItems.map((row) => {
                        const unitCostNum =
                          Number(String(row.unitCost).replace(/\D/g, '')) || 0;
                        const qtyNum = Math.max(0, Number(row.quantity) || 0);
                        const lineTotal = unitCostNum * qtyNum;

                        return (
                          <tr key={row.id} className="hover:bg-zinc-50/40">
                            {/* Phiên bản xe (Dropdown chọn hoặc nhập) */}
                            <td className="py-3 pl-4 pr-2 align-middle">
                              <select
                                value={row.vehicleName}
                                onChange={(e) =>
                                  handleUpdateReceiptRow(
                                    row.id,
                                    'vehicleName',
                                    e.target.value
                                  )
                                }
                                className="w-full h-9 px-2.5 rounded-lg bg-zinc-50/80 border border-zinc-200/90 text-xs text-zinc-800 font-medium truncate focus:bg-white focus:outline-none focus:border-[#b8955a] cursor-pointer"
                              >
                                {vehicles.map((v) => (
                                  <option key={v.id} value={v.name}>
                                    {v.name}
                                  </option>
                                ))}
                              </select>
                            </td>

                            {/* Giá vốn nhập (VNĐ) */}
                            <td className="py-3 px-2 align-middle">
                              <input
                                type="text"
                                value={row.unitCost}
                                onChange={(e) =>
                                  handleUpdateReceiptRow(row.id, 'unitCost', e.target.value)
                                }
                                className="w-full h-9 px-3 rounded-lg bg-zinc-50/80 border border-zinc-200/90 text-xs text-zinc-800 tabular-nums focus:bg-white focus:outline-none focus:border-[#b8955a]"
                              />
                            </td>

                            {/* Số lượng */}
                            <td className="py-3 px-2 align-middle">
                              <input
                                type="number"
                                min={1}
                                value={row.quantity}
                                onChange={(e) =>
                                  handleUpdateReceiptRow(row.id, 'quantity', e.target.value)
                                }
                                className="w-full h-9 px-2.5 rounded-lg bg-zinc-50/80 border border-zinc-200/90 text-xs text-zinc-800 font-medium tabular-nums focus:bg-white focus:outline-none focus:border-[#b8955a]"
                              />
                            </td>

                            {/* Thành tiền (VNĐ) */}
                            <td className="py-3 px-2 align-middle whitespace-nowrap">
                              <span className="font-bold text-[#9a7840] text-xs tabular-nums">
                                {formatPriceVND(lineTotal)}
                              </span>
                            </td>

                            {/* Xóa dòng */}
                            <td className="py-3 pr-4 pl-1 align-middle text-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveReceiptRow(row.id)}
                                className="size-7 rounded-lg text-zinc-400 hover:text-rose-600 hover:bg-rose-50 inline-flex items-center justify-center transition-colors cursor-pointer"
                                title="Xóa dòng xe này"
                              >
                                <X className="size-3.5" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Khối 3: Thanh tổng hợp Tổng số xe nhập & Tổng giá trị lô hàng */}
              <div className="px-5 py-4 rounded-2xl bg-[#fbfaf8] border border-zinc-200/70 flex items-center justify-between">
                <div className="text-xs text-zinc-500">
                  Tổng số xe nhập:{' '}
                  <strong className="text-zinc-900 font-bold ml-1">
                    {receiptTotals.totalCars} xe
                  </strong>
                </div>

                <div className="flex items-baseline gap-2.5">
                  <span className="text-xs text-zinc-500">Tổng giá trị lô hàng:</span>
                  <span className="text-lg font-serif font-bold text-[#9a7840] tabular-nums">
                    {formatPriceVND(receiptTotals.totalValue)}
                  </span>
                </div>
              </div>

            </div>

            {/* Footer Modal: Đóng | Lưu bản nháp | Hoàn thành & Khóa phiếu */}
            <div className="px-7 py-4 border-t border-zinc-100 flex items-center justify-end gap-2.5 bg-white">
              <button
                type="button"
                onClick={() => setIsCreateReceiptOpen(false)}
                className="h-10 px-4 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              >
                Đóng
              </button>

              <button
                type="button"
                onClick={() => handleCreateReceiptSubmit('draft')}
                className="h-10 px-4 rounded-xl border border-zinc-200/90 bg-white hover:bg-zinc-50 text-zinc-800 text-xs font-semibold transition-all cursor-pointer active:scale-95"
              >
                Lưu bản nháp
              </button>

              <button
                type="button"
                onClick={() => handleCreateReceiptSubmit('completed')}
                className="h-10 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Hoàn thành & Khóa phiếu
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 7. MODAL XEM CHI TIẾT PHIẾU NHẬP                                  */}
      {/* ================================================================= */}
      {viewingReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/55 backdrop-blur-[2px] animate-in fade-in duration-200"
            onClick={() => setViewingReceipt(null)}
          />
          <div className="relative w-full max-w-lg bg-white rounded-[24px] shadow-2xl border border-zinc-200 p-6 z-10 animate-in zoom-in-95 duration-200 space-y-5 text-xs">
            <div className="flex items-start justify-between border-b border-zinc-100 pb-4">
              <div>
                <span className="text-[10.5px] font-mono font-bold tracking-widest text-[#b8955a] uppercase block">
                  CHỨNG TỪ NHẬP KHO
                </span>
                <h3 className="text-lg font-serif font-bold text-zinc-900 mt-0.5">
                  Phiếu Nhập: {viewingReceipt.id}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="size-8 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="space-y-3 bg-zinc-50/80 p-4 rounded-2xl border border-zinc-200/70">
              <div className="flex justify-between">
                <span className="text-zinc-400">Ngày lập phiếu:</span>
                <span className="font-semibold text-zinc-800 tabular-nums">
                  {viewingReceipt.importDate}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Cảng / Nhà cung cấp:</span>
                <span className="font-bold text-zinc-900 text-right">
                  {viewingReceipt.supplier}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Dòng xe lô hàng:</span>
                <span className="font-semibold text-zinc-800 text-right">
                  {viewingReceipt.vehicleName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Số lượng xe nhập:</span>
                <span className="font-bold text-zinc-900">{viewingReceipt.quantity} xe</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Tổng giá trị nhập:</span>
                <span className="font-bold text-[#9a7840] text-sm tabular-nums">
                  {formatPriceVND(viewingReceipt.totalAmount)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-1 border-t border-zinc-200/60">
                <span className="text-zinc-400">Trạng thái phiếu:</span>
                <span className="font-semibold text-zinc-800">
                  {viewingReceipt.status === 'completed'
                    ? '🔒 Đã hoàn thành - Đã khóa'
                    : '✏️ Bản nháp'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-1">
              {viewingReceipt.status === 'draft' && (
                <button
                  type="button"
                  onClick={() => handleCompleteDraftReceipt(viewingReceipt.id)}
                  className="h-10 px-5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white font-semibold cursor-pointer"
                >
                  Chốt & Khóa phiếu
                </button>
              )}
              <button
                type="button"
                onClick={() => setViewingReceipt(null)}
                className="h-10 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-zinc-700 font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* 8. DRAWER XEM CHI TIẾT XE                                        */}
      {/* ================================================================= */}
      {viewingVehicle && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={() => setViewingVehicle(null)}
          />
          <aside className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col z-10 overflow-hidden border-l border-zinc-200 animate-in slide-in-from-right duration-300">
            <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/70">
              <div>
                <span className="text-[11px] font-bold tracking-widest text-[#b8955a] uppercase">
                  HỒ SƠ KỸ THUẬT XE
                </span>
                <h2 className="text-lg font-bold text-zinc-900 mt-0.5">{viewingVehicle.name}</h2>
              </div>
              <button
                type="button"
                onClick={() => setViewingVehicle(null)}
                className="size-8 rounded-lg text-zinc-400 hover:text-zinc-800 hover:bg-zinc-200/60 flex items-center justify-center cursor-pointer"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-xs">
              <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-200">
                <img
                  src={viewingVehicle.imageUrl}
                  alt={viewingVehicle.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-zinc-50 border border-zinc-200/80">
                <div>
                  <span className="text-zinc-400 block">Mã Model:</span>
                  <span className="font-mono font-bold text-zinc-900 text-sm">
                    {viewingVehicle.modelCode}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Phân khúc:</span>
                  <span className="font-bold text-zinc-900 text-sm">{viewingVehicle.segment}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Giá niêm yết:</span>
                  <span className="font-bold text-[#9a7840] text-sm">
                    {formatPriceVND(viewingVehicle.price)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-400 block">Tồn kho sẵn có:</span>
                  <span className="font-bold text-zinc-900 text-sm">{viewingVehicle.stock} xe</span>
                </div>
              </div>

              <div className="space-y-3 border border-zinc-100 rounded-2xl p-4">
                <div>
                  <span className="text-zinc-400 block mb-0.5">Động cơ & Vận hành:</span>
                  <span className="font-semibold text-zinc-800">{viewingVehicle.engine}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Màu ngoại thất tiêu chuẩn:</span>
                  <span className="font-semibold text-zinc-800">{viewingVehicle.exteriorColor}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Chất liệu nội thất:</span>
                  <span className="font-semibold text-zinc-800">{viewingVehicle.interiorColor}</span>
                </div>
                <div>
                  <span className="text-zinc-400 block mb-0.5">Mô tả chi tiết:</span>
                  <p className="text-zinc-600 leading-relaxed">{viewingVehicle.description}</p>
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-zinc-200 bg-zinc-50 flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  const v = viewingVehicle;
                  setViewingVehicle(null);
                  handleOpenEditModal(v);
                }}
                className="flex-1 h-10 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-semibold cursor-pointer"
              >
                Chỉnh sửa mẫu xe
              </button>
              <button
                type="button"
                onClick={() => setViewingVehicle(null)}
                className="flex-1 h-10 rounded-xl border border-zinc-300 hover:bg-zinc-200/60 text-zinc-700 text-xs font-semibold cursor-pointer"
              >
                Đóng
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ================================================================= */}
      {/* 9. HỘP THOẠI XÁC NHẬN XÓA MẪU XE                                 */}
      {/* ================================================================= */}
      {deletingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in"
            onClick={() => setDeletingVehicle(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-zinc-200 p-6 z-10 animate-in zoom-in-95 duration-200 text-center space-y-4">
            <div className="size-12 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="size-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-zinc-900">Xác nhận xóa mẫu xe?</h3>
              <p className="text-xs text-zinc-500 mt-1.5 leading-relaxed">
                Bạn có chắc chắn muốn xóa mẫu xe{' '}
                <strong className="text-zinc-900">{deletingVehicle.name}</strong> (Mã:{' '}
                {deletingVehicle.modelCode}) khỏi danh mục sản phẩm không?
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingVehicle(null)}
                className="h-10 px-5 rounded-xl border border-zinc-200 hover:bg-zinc-100 text-zinc-700 text-xs font-semibold cursor-pointer"
              >
                Hủy bỏ
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="h-10 px-5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="size-4" />
                <span>Xác nhận xóa</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminVehiclesPage;
