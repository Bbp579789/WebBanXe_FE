import React, { useMemo, useState } from 'react';
import {
  Car,
  CheckCircle2,
  Edit3,
  Layers3,
  PackagePlus,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import type { Vehicle, VehicleStatus } from '../../types';

type VehicleForm = Pick<
  Vehicle,
  'brand' | 'model' | 'year' | 'price' | 'exterior_color' | 'status'
>;

const initialVehicles: Vehicle[] = [
  {
    id: 1,
    vin: 'W1K3F8HB9PV012345',
    engine_no: 'M264-001',
    brand: 'Mercedes-Benz',
    model: 'C 200 Avantgarde',
    year: 2025,
    exterior_color: 'Obsidian Black',
    interior_color: 'Black',
    cost_price: 1500000000,
    price: 1799000000,
    status: 'new',
  },
  {
    id: 2,
    vin: 'W1N1679231A067890',
    engine_no: 'M256-008',
    brand: 'Mercedes-Benz',
    model: 'GLC 300 4MATIC',
    year: 2025,
    exterior_color: 'Polar White',
    interior_color: 'Macchiato Beige',
    cost_price: 2200000000,
    price: 2599000000,
    status: 'new',
  },
  {
    id: 3,
    vin: 'W1K2231761A098765',
    engine_no: 'M177-003',
    brand: 'Mercedes-Maybach',
    model: 'S 480 4MATIC',
    year: 2024,
    exterior_color: 'Selenite Grey',
    interior_color: 'Nappa Brown',
    cost_price: 6500000000,
    price: 8299000000,
    status: 'reserved',
  },
];

const statusLabels: Record<VehicleStatus, string> = {
  new: 'Đang kinh doanh',
  reserved: 'Đã đặt cọc',
  sold: 'Đã bán',
  used: 'Xe đã qua sử dụng',
};

const emptyForm: VehicleForm = {
  brand: 'Mercedes-Benz',
  model: '',
  year: new Date().getFullYear(),
  price: 0,
  exterior_color: '',
  status: 'new',
};

const formatCurrency = (value: number | string) =>
  new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0,
  }).format(Number(value));

export const AdminVehiclesPage: React.FC = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>(initialVehicles);
  const [activeTab, setActiveTab] = useState<'vehicles' | 'categories' | 'inbound' | 'pricing'>('vehicles');
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | VehicleStatus>('all');
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState<VehicleForm>(emptyForm);
  const [toast, setToast] = useState('');

  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();
    return vehicles.filter((vehicle) => {
      const matchesSearch =
        !query ||
        [vehicle.model, vehicle.brand, vehicle.vin, vehicle.exterior_color]
          .join(' ')
          .toLowerCase()
          .includes(query);
      return matchesSearch && (status === 'all' || vehicle.status === status);
    });
  }, [search, status, vehicles]);

  const showToast = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 3000);
  };

  const openCreate = () => {
    setEditingVehicle(null);
    setForm(emptyForm);
    setIsModalOpen(true);
  };

  const openEdit = (vehicle: Vehicle) => {
    setEditingVehicle(vehicle);
    setIsModalOpen(true);
    setForm({
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      price: vehicle.price,
      exterior_color: vehicle.exterior_color,
      status: vehicle.status,
    });
  };

  const saveVehicle = (event: React.FormEvent) => {
    event.preventDefault();
    if (!form.model.trim() || !form.exterior_color.trim() || Number(form.price) <= 0) {
      showToast('Vui lòng nhập đầy đủ thông tin sản phẩm');
      return;
    }

    if (editingVehicle) {
      setVehicles((current) =>
        current.map((vehicle) =>
          vehicle.id === editingVehicle.id ? { ...vehicle, ...form, price: Number(form.price) } : vehicle
        )
      );
      showToast('Đã cập nhật thông tin sản phẩm');
    } else {
      const id = Math.max(0, ...vehicles.map((vehicle) => vehicle.id)) + 1;
      const newVehicle: Vehicle = {
        ...form,
        id,
        cost_price: Number(form.price),
        price: Number(form.price),
        vin: `CHỜ CẤP VIN-${id}`,
        engine_no: 'Chờ cập nhật',
        interior_color: 'Chưa cập nhật',
      };
      setVehicles((current) => [
        newVehicle,
        ...current,
      ]);
      showToast('Đã thêm sản phẩm mới');
    }
    setEditingVehicle(null);
    setIsModalOpen(false);
  };

  const deleteVehicle = (vehicle: Vehicle) => {
    if (!window.confirm(`Xóa sản phẩm "${vehicle.model}"?`)) return;
    setVehicles((current) => current.filter((item) => item.id !== vehicle.id));
    showToast('Đã xóa sản phẩm');
  };

  const tabs = [
    { key: 'vehicles' as const, label: 'Danh sách xe', count: vehicles.length, icon: Car },
    { key: 'categories' as const, label: 'Phân khúc', count: 5, icon: Layers3 },
    { key: 'inbound' as const, label: 'Nhập kho', count: 0, icon: PackagePlus },
    { key: 'pricing' as const, label: 'Bảng giá', count: vehicles.length, icon: CheckCircle2 },
  ];

  return (
    <div className="relative flex h-full flex-col overflow-y-auto bg-[#f7f7f5] px-5 py-5 font-sans text-zinc-900 md:px-8">
      <header className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[#a17d40]">Mercedes-Benz Authorized Portal</p>
          <h1 className="font-serif text-3xl font-semibold text-zinc-950">Quản lý sản phẩm</h1>
          <p className="mt-1 text-sm text-zinc-500">Quản lý danh mục xe, tồn kho và bảng giá.</p>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm shadow-sm">
          <span className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#22c55e]" />
          <span className="text-zinc-600">Tồn kho</span>
          <strong>{vehicles.filter((vehicle) => vehicle.status !== 'sold').length} xe</strong>
        </div>
      </header>

      <nav className="mb-5 flex gap-1 overflow-x-auto border-b border-zinc-200">
        {tabs.map(({ key, label, count, icon: Icon }) => (
          <button
            key={key}
            type="button"
            onClick={() => setActiveTab(key)}
            className={`flex shrink-0 items-center gap-2 rounded-t-lg px-4 py-3 text-sm font-semibold transition ${
              activeTab === key ? 'border-b-2 border-[#b8955a] bg-white text-zinc-950' : 'text-zinc-500 hover:bg-white/70 hover:text-zinc-900'
            }`}
          >
            <Icon className={`size-4 ${activeTab === key ? 'text-[#b8955a]' : ''}`} />
            {label}
            <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs">{count}</span>
          </button>
        ))}
      </nav>

      {activeTab === 'vehicles' ? (
        <>
          <section className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4 shadow-sm">
            <div className="relative min-w-[240px] flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400" />
              <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Tìm tên xe, mã VIN, màu xe..." className="h-10 w-full rounded-lg border border-zinc-200 bg-zinc-50 pl-9 pr-3 text-sm outline-none transition focus:border-[#b8955a] focus:bg-white" />
            </div>
            <select value={status} onChange={(event) => setStatus(event.target.value as 'all' | VehicleStatus)} className="h-10 rounded-lg border border-zinc-200 bg-zinc-50 px-3 text-sm outline-none focus:border-[#b8955a]">
              <option value="all">Tất cả trạng thái</option>
              <option value="new">Đang kinh doanh</option>
              <option value="reserved">Đã đặt cọc</option>
              <option value="sold">Đã bán</option>
            </select>
            <button type="button" onClick={openCreate} className="inline-flex h-10 items-center gap-2 rounded-lg bg-zinc-950 px-4 text-sm font-semibold text-white transition hover:bg-[#b8955a]">
              <Plus className="size-4" /> Thêm sản phẩm
            </button>
          </section>

          <section className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] text-left text-sm">
                <thead className="border-b border-zinc-200 bg-zinc-50 text-xs uppercase tracking-wide text-zinc-500">
                  <tr><th className="px-5 py-4">Sản phẩm</th><th className="px-5 py-4">Mã VIN</th><th className="px-5 py-4">Năm</th><th className="px-5 py-4">Giá niêm yết</th><th className="px-5 py-4">Trạng thái</th><th className="px-5 py-4 text-right">Thao tác</th></tr>
                </thead>
                <tbody className="divide-y divide-zinc-100">
                  {filteredVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="transition hover:bg-amber-50/30">
                      <td className="px-5 py-4"><div className="font-semibold text-zinc-900">{vehicle.model}</div><div className="mt-1 text-xs text-zinc-500">{vehicle.brand} · {vehicle.exterior_color}</div></td>
                      <td className="px-5 py-4 font-mono text-xs text-zinc-500">{vehicle.vin}</td>
                      <td className="px-5 py-4 text-zinc-600">{vehicle.year}</td>
                      <td className="px-5 py-4 font-semibold text-zinc-800">{formatCurrency(vehicle.price)}</td>
                      <td className="px-5 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${vehicle.status === 'new' ? 'bg-emerald-50 text-emerald-700' : vehicle.status === 'reserved' ? 'bg-amber-50 text-amber-700' : 'bg-zinc-100 text-zinc-600'}`}>{statusLabels[vehicle.status] || vehicle.status}</span></td>
                      <td className="px-5 py-4"><div className="flex justify-end gap-2"><button type="button" onClick={() => openEdit(vehicle)} aria-label={`Sửa ${vehicle.model}`} className="rounded-lg p-2 text-zinc-500 hover:bg-amber-50 hover:text-[#a17d40]"><Edit3 className="size-4" /></button><button type="button" onClick={() => deleteVehicle(vehicle)} aria-label={`Xóa ${vehicle.model}`} className="rounded-lg p-2 text-zinc-500 hover:bg-rose-50 hover:text-rose-600"><Trash2 className="size-4" /></button></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {filteredVehicles.length === 0 && <div className="p-12 text-center text-sm text-zinc-500">Không tìm thấy sản phẩm phù hợp.</div>}
          </section>
        </>
      ) : (
        <section className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-zinc-300 bg-white p-12 text-center">
          <div><PackagePlus className="mx-auto mb-3 size-10 text-[#b8955a]" /><h2 className="font-serif text-xl font-semibold">Khu vực {tabs.find((tab) => tab.key === activeTab)?.label}</h2><p className="mt-2 text-sm text-zinc-500">Giao diện chi tiết sẽ được triển khai ở bước tiếp theo.</p></div>
        </section>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 p-4" onMouseDown={(event) => { if (event.target === event.currentTarget) { setEditingVehicle(null); setIsModalOpen(false); } }}>
          <form onSubmit={saveVehicle} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-5 flex items-center justify-between"><h2 className="font-serif text-2xl font-semibold">{editingVehicle ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}</h2><button type="button" onClick={() => { setEditingVehicle(null); setIsModalOpen(false); }} aria-label="Đóng"><X className="size-5 text-zinc-500" /></button></div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-zinc-600">Thương hiệu</span><input value={form.brand} onChange={(event) => setForm({ ...form, brand: event.target.value })} className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-[#b8955a]" /></label>
              <label className="sm:col-span-2"><span className="mb-1 block text-xs font-semibold text-zinc-600">Tên mẫu xe *</span><input value={form.model} onChange={(event) => setForm({ ...form, model: event.target.value })} className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-[#b8955a]" /></label>
              <label><span className="mb-1 block text-xs font-semibold text-zinc-600">Năm sản xuất</span><input type="number" value={form.year} onChange={(event) => setForm({ ...form, year: Number(event.target.value) })} className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-[#b8955a]" /></label>
              <label><span className="mb-1 block text-xs font-semibold text-zinc-600">Giá niêm yết *</span><input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: Number(event.target.value) })} className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-[#b8955a]" /></label>
              <label><span className="mb-1 block text-xs font-semibold text-zinc-600">Màu ngoại thất *</span><input value={form.exterior_color} onChange={(event) => setForm({ ...form, exterior_color: event.target.value })} className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-[#b8955a]" /></label>
              <label><span className="mb-1 block text-xs font-semibold text-zinc-600">Trạng thái</span><select value={form.status} onChange={(event) => setForm({ ...form, status: event.target.value as VehicleStatus })} className="h-10 w-full rounded-lg border border-zinc-200 px-3 text-sm outline-none focus:border-[#b8955a]"><option value="new">Đang kinh doanh</option><option value="reserved">Đã đặt cọc</option><option value="sold">Đã bán</option></select></label>
            </div>
            <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => { setEditingVehicle(null); setIsModalOpen(false); }} className="rounded-lg border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-600 hover:bg-zinc-50">Hủy</button><button type="submit" className="rounded-lg bg-zinc-950 px-5 py-2 text-sm font-semibold text-white hover:bg-[#b8955a]">Lưu sản phẩm</button></div>
          </form>
        </div>
      )}

      {toast && <div className="fixed bottom-6 right-6 z-[70] flex items-center gap-2 rounded-lg bg-zinc-950 px-4 py-3 text-sm font-medium text-white shadow-xl"><CheckCircle2 className="size-4 text-[#d5b477]" />{toast}</div>}
    </div>
  );
};

export default AdminVehiclesPage;
