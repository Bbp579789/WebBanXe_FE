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
  VehicleAsset,
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
    <div className="min-h-screen bg-gray-50 p-5 md:p-8">

      {/* HEADER */}
      <div className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Quản lý sản phẩm
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Quản lý danh sách xe trong hệ thống.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => void fetchVehicles()}
            disabled={loading}
            className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium hover:bg-gray-100 disabled:opacity-50"
          >
            <RefreshCw size={16} />
            Làm mới
          </button>

          <button
            type="button"
            onClick={openCreateModal}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus size={18} />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* STATISTICS */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">
                Tổng sản phẩm
              </p>

              <p className="mt-2 text-2xl font-bold">
                {vehicles.length}
              </p>
            </div>

            <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
              <Car size={23} />
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Xe khả dụng
          </p>

          <p className="mt-2 text-2xl font-bold text-green-600">
            {
              vehicles.filter(
                (vehicle) => vehicle.status === "available"
              ).length
            }
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5">
          <p className="text-sm text-gray-500">
            Xe mới
          </p>

          <p className="mt-2 text-2xl font-bold text-blue-600">
            {
              vehicles.filter(
                (vehicle) => vehicle.status === "new"
              ).length
            }
          </p>
        </div>
      </div>

      {/* SEARCH */}
      <div className="mb-5 rounded-xl border border-gray-200 bg-white p-4">
        <div className="relative max-w-md">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={searchQuery}
            onChange={(event) =>
              setSearchQuery(event.target.value)
            }
            placeholder="Tìm theo tên xe, VIN, phiên bản..."
            className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-blue-500"
          />
        </div>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* PRODUCT TABLE */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left text-sm">
            <thead className="bg-gray-50 text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-4">Sản phẩm</th>
                <th className="px-5 py-4">VIN</th>
                <th className="px-5 py-4">Phiên bản</th>
                <th className="px-5 py-4">Năm</th>
                <th className="px-5 py-4">Giá bán</th>
                <th className="px-5 py-4">Trạng thái</th>
                <th className="px-5 py-4 text-center">
                  Thao tác
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-500"
                  >
                    Đang tải danh sách sản phẩm...
                  </td>
                </tr>
              ) : filteredVehicles.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="py-12 text-center text-gray-500"
                  >
                    Không tìm thấy sản phẩm.
                  </td>
                </tr>
              ) : (
                filteredVehicles.map((vehicle) => (
                  <tr
                    key={vehicle.id}
                    className="transition hover:bg-gray-50"
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                          {vehicle.image_url ? (
                            <img
                              src={vehicle.image_url}
                              alt={vehicle.model}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center text-gray-400">
                              <Car size={25} />
                            </div>
                          )}
                        </div>

                        <div>
                          <p className="font-semibold text-gray-900">
                            {vehicle.brand} {vehicle.model}
                          </p>

                          <p className="mt-1 text-xs text-gray-500">
                            ID: {vehicle.id}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {vehicle.vin}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {vehicle.variant}
                    </td>

                    <td className="px-5 py-4 text-gray-600">
                      {vehicle.year}
                    </td>

                    <td className="px-5 py-4 font-semibold text-gray-900">
                      {formatCurrency(vehicle.price)}
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          vehicle.status === "available"
                            ? "bg-green-100 text-green-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {vehicle.status === "available"
                          ? "Khả dụng"
                          : "Xe mới"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          type="button"
                          title="Xem chi tiết"
                          onClick={() => openDetail(vehicle)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Eye size={17} />
                        </button>

                        <button
                          type="button"
                          title="Chỉnh sửa"
                          onClick={() => openEditModal(vehicle)}
                          className="rounded-lg p-2 text-gray-500 hover:bg-amber-50 hover:text-amber-600"
                        >
                          <Pencil size={17} />
                        </button>

                        <button
                          type="button"
                          title="Xóa sản phẩm"
                          onClick={() =>
                            openDeleteConfirm(vehicle)
                          }
                          className="rounded-lg p-2 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="border-t border-gray-100 px-5 py-4 text-sm text-gray-500">
          Hiển thị {filteredVehicles.length} / {vehicles.length} sản phẩm
        </div>
      </div>

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