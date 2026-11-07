import React, { useMemo, useState } from "react";

import {
  Search,
  Plus,
  Eye,
  Pencil,
  Trash2,
  X,
  Car,
  RefreshCw,
  ImagePlus,
} from "lucide-react";

import { useAdminVehicle } from "../../hooks/admin/useAdminVehicle";

import type {
  Vehicle,
  VehicleStatus,
  CreateVehiclePayload,
  UpdateVehiclePayload,
} from "../../types/adminVehicle.types";

/* =========================================
   HELPERS
========================================= */

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value) || 0);

const emptyForm: VehicleForm = {
  vin: "",
  engine_no: "",
  brand: "Mercedes-Benz",
  model: "",
  year: new Date().getFullYear(),

  exterior_color: "",
  interior_color: "",

  import_price: 0,
  percentage_profit: 0,
  price: 0,

  variant: "",
  description: "",

  engine: "",
  power_hp: "",
  torque_nm: "",
  acceleration: "",
  top_speed: "",

  fuel: "",
  transmission: "",
  drivetrain: "",
  seats: "",

  status: "available",
};

/* =========================================
   FORM TYPE
========================================= */

interface VehicleForm {
  vin: string;
  engine_no: string;

  brand: string;
  model: string;
  year: number;

  exterior_color: string;
  interior_color: string;

  import_price: number;
  percentage_profit: number;
  price: number;

  variant: string;
  description: string;

  engine: string;
  power_hp: string;
  torque_nm: string;
  acceleration: string;
  top_speed: string;

  fuel: string;
  transmission: string;
  drivetrain: string;
  seats: string;

  // Cho phép cả available và new
  status: VehicleStatus;
}

/* =========================================
   COMPONENT
========================================= */

const AdminVehiclesPage: React.FC = () => {
  const {
    vehicles,
    loading,
    submitting,
    error,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    fetchVehicles,
  } = useAdminVehicle();

  /* =========================================
     STATES
  ========================================= */

  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const [editingVehicle, setEditingVehicle] =
    useState<Vehicle | null>(null);

  const [selectedVehicle, setSelectedVehicle] =
    useState<Vehicle | null>(null);

  const [form, setForm] = useState<VehicleForm>({
    ...emptyForm,
  });

  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState("");

  /* =========================================
     FILTER VEHICLES
  ========================================= */

  const filteredVehicles = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();

    if (!keyword) return vehicles;

    return vehicles.filter((vehicle) =>
      [
        vehicle.brand,
        vehicle.model,
        vehicle.variant,
        vehicle.vin,
        vehicle.engine_no,
      ].some((value) =>
        value?.toLowerCase().includes(keyword)
      )
    );
  }, [vehicles, searchQuery]);

  /* =========================================
     FORM HANDLERS
  ========================================= */

  const updateForm = (
    field: keyof VehicleForm,
    value: string | number
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const resetForm = () => {
    setForm({ ...emptyForm });
    setEditingVehicle(null);
    setSelectedImage(null);
    setImagePreview("");
  };

  const openCreateModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const openEditModal = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);

    setForm({
      vin: vehicle.vin,
      engine_no: vehicle.engine_no,

      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,

      exterior_color: vehicle.exterior_color,
      interior_color: vehicle.interior_color,

      import_price: Number(vehicle.import_price),
      percentage_profit: Number(vehicle.percentage_profit),
      price: Number(vehicle.price),

      variant: vehicle.variant,
      description: vehicle.description ?? "",

      engine: vehicle.engine ?? "",
      power_hp: vehicle.power_hp?.toString() ?? "",
      torque_nm: vehicle.torque_nm?.toString() ?? "",
      acceleration: vehicle.acceleration?.toString() ?? "",
      top_speed: vehicle.top_speed?.toString() ?? "",

      fuel: vehicle.fuel ?? "",
      transmission: vehicle.transmission ?? "",
      drivetrain: vehicle.drivetrain ?? "",
      seats: vehicle.seats?.toString() ?? "",

      status: vehicle.status,
    });

    setImagePreview(vehicle.image_url ?? "");
    setSelectedImage(null);
    setIsModalOpen(true);
  };

  const handleImageChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Vui lòng chọn file hình ảnh.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Kích thước ảnh không được vượt quá 5MB.");
      return;
    }

    if (imagePreview.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setSelectedImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const toNullableNumber = (
    value: string
  ): number | null => {
    if (value.trim() === "") return null;

    const number = Number(value);

    return Number.isFinite(number) ? number : null;
  };

  /* =========================================
     CREATE / UPDATE
  ========================================= */

  const handleSaveVehicle = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      !form.vin.trim() ||
      !form.engine_no.trim() ||
      !form.brand.trim() ||
      !form.model.trim() ||
      !form.variant.trim()
    ) {
      alert("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    if (
      form.year <= 0 ||
      form.import_price < 0 ||
      form.percentage_profit < 0 ||
      form.price < 0
    ) {
      alert("Vui lòng kiểm tra lại năm sản xuất và thông tin giá.");
      return;
    }

    const payload: CreateVehiclePayload = {
      vin: form.vin.trim(),
      engine_no: form.engine_no.trim(),

      brand: form.brand.trim(),
      model: form.model.trim(),
      year: Number(form.year),

      exterior_color: form.exterior_color,
      interior_color: form.interior_color,

      import_price: Number(form.import_price),
      percentage_profit: Number(form.percentage_profit),
      price: Number(form.price),

      variant: form.variant.trim(),
      description: form.description || null,

      engine: form.engine || null,
      power_hp: toNullableNumber(form.power_hp),
      torque_nm: toNullableNumber(form.torque_nm),
      acceleration: toNullableNumber(form.acceleration),
      top_speed: toNullableNumber(form.top_speed),

      fuel: form.fuel || null,
      transmission: form.transmission || null,
      drivetrain: form.drivetrain || null,
      seats: toNullableNumber(form.seats),

      status: form.status,
    };

    try {
      if (editingVehicle) {
        const updatePayload: UpdateVehiclePayload = payload;

        await updateVehicle(
          editingVehicle.id,
          updatePayload
        );
      } else {
        await createVehicle(payload);
      }

      setIsModalOpen(false);
      resetForm();

      alert(
        editingVehicle
          ? "Cập nhật sản phẩm thành công!"
          : "Thêm sản phẩm thành công!"
      );
    } catch {
      // Hook đã quản lý lỗi.
    }
  };

  /* =========================================
     DELETE
  ========================================= */

  const handleDeleteVehicle = async () => {
    if (!selectedVehicle) return;

    try {
      await deleteVehicle(selectedVehicle.id);

      setIsDeleteOpen(false);
      setSelectedVehicle(null);

      alert("Xóa sản phẩm thành công!");
    } catch {
      // Hook đã quản lý lỗi.
    }
  };

  /* =========================================
     DETAIL
  ========================================= */

  const openDetail = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDetailOpen(true);
  };

  const openDeleteConfirm = (vehicle: Vehicle) => {
    setSelectedVehicle(vehicle);
    setIsDeleteOpen(true);
  };

  /* =========================================
     STYLE
  ========================================= */

  const inputClass =
    "w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-gray-700";

  /* =========================================
     RENDER
  ========================================= */

  return (
    <div className="flex-1 h-full overflow-y-auto min-h-0 bg-zinc-50 font-sans">
      <main className="p-8 pb-16 space-y-6">

        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-[#b8955a] uppercase tracking-wider mb-1">
              Hệ thống điều hành / Quản lý sản phẩm
            </p>
            <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">
              Quản Lý Sản Phẩm
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => void fetchVehicles()}
              disabled={loading}
              className="h-9 px-4 rounded-full bg-white hover:bg-zinc-100 border border-zinc-200/80 text-zinc-700 text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer disabled:opacity-50"
            >
              <RefreshCw size={14} className={loading ? "animate-spin text-[#b8955a]" : "text-zinc-500"} />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              onClick={openCreateModal}
              className="h-9 px-4 rounded-full bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 text-white hover:text-[#b8955a] text-xs font-semibold flex items-center gap-2 transition-all shadow-xs cursor-pointer active:scale-95"
            >
              <Plus size={15} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>
        </div>

        {/* SEARCH & STATS ROW */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* SEARCH */}
          <div className="relative w-full max-w-md">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(event) =>
                setSearchQuery(event.target.value)
              }
              placeholder="Tìm theo tên xe, VIN, phiên bản..."
              className="w-full h-10 rounded-2xl border border-zinc-200/80 bg-white py-2 pl-10 pr-4 text-xs text-zinc-800 shadow-xs outline-none transition focus:border-[#b8955a] focus:ring-2 focus:ring-[#b8955a]/10"
            />
          </div>

          {/* TỔNG SẢN PHẨM BADGE / CARD */}
          <div className="flex items-center gap-3 self-start rounded-2xl border border-zinc-200/80 bg-white px-5 py-2.5 shadow-xs sm:self-auto">
            <div className="flex size-9 items-center justify-center rounded-xl bg-amber-50 text-[#b8955a]">
              <Car size={18} />
            </div>
            <div>
              <p className="text-[11px] font-medium text-zinc-500">Tổng sản phẩm</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-xl font-bold text-zinc-900 tabular-nums">{vehicles.length}</span>
                <span className="text-[11px] text-zinc-400">xe trong kho</span>
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-xs font-medium text-rose-700">
            {error}
          </div>
        )}

        {/* PRODUCT TABLE */}
        <div className="overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-xs border-collapse">
              <thead className="bg-zinc-50/90 text-[11px] font-bold uppercase tracking-wider text-zinc-500 border-b border-zinc-100">
                <tr>
                  <th className="px-6 py-4">Sản phẩm</th>
                  <th className="px-6 py-4 font-mono">Số khung (VIN)</th>
                  <th className="px-6 py-4">Phiên bản</th>
                  <th className="px-6 py-4 text-center">Năm SX</th>
                  <th className="px-6 py-4 text-right">Giá niêm yết</th>
                  <th className="px-6 py-4 text-center">Thao tác</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-zinc-100">
                {loading ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-zinc-400 font-medium"
                    >
                      Đang tải danh sách sản phẩm...
                    </td>
                  </tr>
                ) : filteredVehicles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="py-12 text-center text-zinc-400"
                    >
                      Không tìm thấy sản phẩm.
                    </td>
                  </tr>
                ) : (
                  filteredVehicles.map((vehicle) => (
                    <tr
                      key={vehicle.id}
                      className="transition-colors hover:bg-zinc-50/80 group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-12 w-16 shrink-0 overflow-hidden rounded-xl border border-zinc-200/70 bg-zinc-50 shadow-2xs">
                            {vehicle.image_url ? (
                              <img
                                src={vehicle.image_url}
                                alt={vehicle.model}
                                className="h-full w-full object-cover group-hover:brightness-110"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-zinc-400">
                                <Car size={20} />
                              </div>
                            )}
                          </div>

                          <div>
                            <p className="font-bold text-zinc-900 group-hover:text-[#b8955a] transition-colors leading-snug">
                              {vehicle.brand} {vehicle.model}
                            </p>

                            <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                              ID: #{vehicle.id}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 font-mono text-xs font-semibold text-zinc-600">
                        {vehicle.vin}
                      </td>

                      <td className="px-6 py-4 text-xs font-medium text-zinc-700">
                        {vehicle.variant}
                      </td>

                      <td className="px-6 py-4 text-center text-xs font-semibold text-zinc-600 tabular-nums">
                        {vehicle.year}
                      </td>

                      <td className="px-6 py-4 text-right font-bold text-zinc-900 whitespace-nowrap tabular-nums">
                        {formatCurrency(vehicle.price)}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            type="button"
                            title="Xem chi tiết"
                            onClick={() => openDetail(vehicle)}
                            className="size-7.5 rounded-lg bg-zinc-100 hover:bg-zinc-200/80 text-zinc-600 hover:text-zinc-950 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Eye size={15} />
                          </button>

                          <button
                            type="button"
                            title="Chỉnh sửa"
                            onClick={() => openEditModal(vehicle)}
                            className="size-7.5 rounded-lg bg-zinc-100 hover:bg-[#b8955a]/15 text-zinc-600 hover:text-[#8a6e3d] flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Pencil size={15} />
                          </button>

                          <button
                            type="button"
                            title="Xóa sản phẩm"
                            onClick={() =>
                              openDeleteConfirm(vehicle)
                            }
                            className="size-7.5 rounded-lg bg-zinc-100 hover:bg-rose-50 text-zinc-500 hover:text-rose-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="border-t border-zinc-100 px-6 py-3.5 text-xs text-zinc-500 bg-zinc-50/50 flex items-center justify-between">
            <span>Hiển thị <strong className="text-zinc-800">{filteredVehicles.length}</strong> / {vehicles.length} sản phẩm</span>
            <span className="text-zinc-400">Mercedes-Benz Product Inventory System</span>
          </div>
        </div>

      </main>

      {/* =====================================
          CREATE / EDIT MODAL
      ===================================== */}

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white shadow-xl">

            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-lg font-bold">
                  {editingVehicle
                    ? "Chỉnh sửa sản phẩm"
                    : "Thêm sản phẩm mới"}
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                  Nhập thông tin xe cần quản lý.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <form
              onSubmit={handleSaveVehicle}
              className="space-y-6 p-6"
            >

              {/* IMAGE */}
              <div>
                <label className={labelClass}>
                  Hình ảnh sản phẩm
                </label>

                <label className="flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <>
                      <ImagePlus
                        size={30}
                        className="text-gray-400"
                      />

                      <span className="mt-2 text-sm text-gray-500">
                        Chọn hình ảnh xe
                      </span>
                    </>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>

                {selectedImage && (
                  <p className="mt-2 text-xs text-gray-500">
                    Đã chọn: {selectedImage.name}
                  </p>
                )}
              </div>

              {/* BASIC INFORMATION */}
              <section>
                <h3 className="mb-4 border-b pb-2 font-semibold">
                  Thông tin cơ bản
                </h3>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className={labelClass}>
                      Thương hiệu *
                    </label>

                    <input
                      className={inputClass}
                      value={form.brand}
                      onChange={(e) =>
                        updateForm("brand", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Tên mẫu xe *
                    </label>

                    <input
                      className={inputClass}
                      value={form.model}
                      onChange={(e) =>
                        updateForm("model", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      VIN *
                    </label>

                    <input
                      className={inputClass}
                      value={form.vin}
                      onChange={(e) =>
                        updateForm("vin", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Số động cơ *
                    </label>

                    <input
                      className={inputClass}
                      value={form.engine_no}
                      onChange={(e) =>
                        updateForm("engine_no", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Phiên bản *
                    </label>

                    <input
                      className={inputClass}
                      value={form.variant}
                      onChange={(e) =>
                        updateForm("variant", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Năm sản xuất
                    </label>

                    <input
                      type="number"
                      className={inputClass}
                      value={form.year}
                      onChange={(e) =>
                        updateForm("year", Number(e.target.value))
                      }
                      required
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Màu ngoại thất
                    </label>

                    <input
                      className={inputClass}
                      value={form.exterior_color}
                      onChange={(e) =>
                        updateForm("exterior_color", e.target.value)
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Màu nội thất
                    </label>

                    <input
                      className={inputClass}
                      value={form.interior_color}
                      onChange={(e) =>
                        updateForm("interior_color", e.target.value)
                      }
                    />
                  </div>
                </div>
              </section>

              {/* PRICE */}
              <section>
                <h3 className="mb-4 border-b pb-2 font-semibold">
                  Thông tin giá
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  <div>
                    <label className={labelClass}>
                      Giá nhập
                    </label>

                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      value={form.import_price}
                      onChange={(e) =>
                        updateForm(
                          "import_price",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Lợi nhuận (%)
                    </label>

                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      value={form.percentage_profit}
                      onChange={(e) =>
                        updateForm(
                          "percentage_profit",
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className={labelClass}>
                      Giá bán
                    </label>

                    <input
                      type="number"
                      min="0"
                      className={inputClass}
                      value={form.price}
                      onChange={(e) =>
                        updateForm("price", Number(e.target.value))
                      }
                    />
                  </div>
                </div>
              </section>

              {/* TECHNICAL INFORMATION */}
              <section>
                <h3 className="mb-4 border-b pb-2 font-semibold">
                  Thông số kỹ thuật
                </h3>

                <div className="grid gap-4 md:grid-cols-3">
                  {(
                    [
                      ["engine", "Động cơ"],
                      ["power_hp", "Công suất (HP)"],
                      ["torque_nm", "Mô-men xoắn (Nm)"],
                      ["acceleration", "Tăng tốc"],
                      ["top_speed", "Tốc độ tối đa"],
                      ["fuel", "Nhiên liệu"],
                      ["transmission", "Hộp số"],
                      ["drivetrain", "Hệ dẫn động"],
                      ["seats", "Số chỗ ngồi"],
                    ] as const
                  ).map(([field, label]) => (
                    <div key={field}>
                      <label className={labelClass}>
                        {label}
                      </label>

                      <input
                        className={inputClass}
                        value={form[field]}
                        onChange={(e) =>
                          updateForm(field, e.target.value)
                        }
                      />
                    </div>
                  ))}
                </div>
              </section>

              {/* DESCRIPTION */}
              <section>
                <label className={labelClass}>
                  Mô tả sản phẩm
                </label>

                <textarea
                  rows={4}
                  className={inputClass}
                  value={form.description}
                  onChange={(e) =>
                    updateForm("description", e.target.value)
                  }
                />
              </section>

              {/* STATUS */}
              <section>
                <label className={labelClass}>
                  Trạng thái
                </label>

                <select
                  className={inputClass}
                  value={form.status}
                  onChange={(e) =>
                    updateForm(
                      "status",
                      e.target.value as VehicleStatus
                    )
                  }
                >
                  <option value="available">
                    Khả dụng
                  </option>

                  <option value="new">
                    Xe mới
                  </option>
                </select>
              </section>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    resetForm();
                  }}
                  className="rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting
                    ? "Đang lưu..."
                    : editingVehicle
                      ? "Lưu thay đổi"
                      : "Thêm sản phẩm"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =====================================
          DETAIL MODAL
      ===================================== */}

      {isDetailOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white">

            <div className="flex items-center justify-between border-b p-5">
              <h2 className="text-lg font-bold">
                Chi tiết sản phẩm
              </h2>

              <button
                type="button"
                onClick={() => setIsDetailOpen(false)}
                className="rounded-lg p-2 hover:bg-gray-100"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-5 p-6">
              {selectedVehicle.image_url && (
                <img
                  src={selectedVehicle.image_url}
                  alt={selectedVehicle.model}
                  className="h-64 w-full rounded-xl bg-gray-50 object-contain"
                />
              )}

              <h3 className="text-xl font-bold">
                {selectedVehicle.brand} {selectedVehicle.model}
              </h3>

              <div className="grid grid-cols-2 gap-4">
                {[
                  ["VIN", selectedVehicle.vin],
                  ["Số động cơ", selectedVehicle.engine_no],
                  ["Phiên bản", selectedVehicle.variant],
                  ["Năm", selectedVehicle.year],
                  ["Giá nhập", formatCurrency(selectedVehicle.import_price)],
                  ["Giá bán", formatCurrency(selectedVehicle.price)],
                  ["Ngoại thất", selectedVehicle.exterior_color],
                  ["Nội thất", selectedVehicle.interior_color],
                  ["Động cơ", selectedVehicle.engine],
                  ["Công suất", selectedVehicle.power_hp],
                  ["Mô-men xoắn", selectedVehicle.torque_nm],
                  ["Tăng tốc", selectedVehicle.acceleration],
                  ["Tốc độ tối đa", selectedVehicle.top_speed],
                  ["Hộp số", selectedVehicle.transmission],
                  ["Nhiên liệu", selectedVehicle.fuel],
                  ["Hệ dẫn động", selectedVehicle.drivetrain],
                  ["Số chỗ", selectedVehicle.seats],
                  ["Trạng thái", selectedVehicle.status],
                ].map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="rounded-lg bg-gray-50 p-3"
                  >
                    <p className="text-xs text-gray-500">
                      {label}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold">
                      {value ?? "Chưa cập nhật"}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <p className="text-sm font-semibold">
                  Mô tả
                </p>

                <p className="mt-2 whitespace-pre-line text-sm text-gray-600">
                  {selectedVehicle.description || "Chưa có mô tả."}
                </p>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setIsDetailOpen(false);
                    openEditModal(selectedVehicle);
                  }}
                  className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  <Pencil size={16} />
                  Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================
          DELETE CONFIRM
      ===================================== */}

      {isDeleteOpen && selectedVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6">

            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              <Trash2 size={22} />
            </div>

            <h2 className="text-lg font-bold">
              Xóa sản phẩm?
            </h2>

            <p className="mt-2 text-sm text-gray-500">
              Bạn có chắc chắn muốn xóa{" "}
              <strong>
                {selectedVehicle.brand} {selectedVehicle.model}
              </strong>
              ? Thao tác này không thể hoàn tác.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsDeleteOpen(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm"
              >
                Hủy
              </button>

              <button
                type="button"
                onClick={() => void handleDeleteVehicle()}
                disabled={submitting}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
              >
                {submitting ? "Đang xóa..." : "Xác nhận xóa"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminVehiclesPage;