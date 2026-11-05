// import React from 'react';
// import { Search, Bell, MapPin, ChevronDown, Plus } from 'lucide-react';
// import { Input } from '../ui/input';
// import { Button } from '../ui/button';

// export const AdminHeader: React.FC = () => {
//   return (
//     <header className="h-20 px-8 flex items-center justify-between bg-zinc-50 sticky top-0 z-20">
//       {/* Search */}
//       <div className="relative w-96">
//         <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-zinc-400" />
//         <Input 
//           placeholder="Tra cứu mã VIN, tên xe hoặc tên khách hàng..." 
//           className="pl-10 h-11 bg-white border-zinc-200/80 rounded-xl text-xs w-full"
//         />
//         <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
//           <span className="text-[10px] font-mono text-zinc-400 bg-zinc-100 px-1.5 py-0.5 rounded border border-zinc-200">⌘K</span>
//         </div>
//       </div>

//       {/* Actions */}
//       {/* <div className="flex items-center gap-4">
       
//         <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-zinc-200/80 cursor-pointer hover:bg-zinc-50 transition-colors">
//           <MapPin className="size-4 text-[#b8955a]" />
//           <span className="text-xs font-medium text-zinc-700">Showroom Phú Mỹ Hưng (TP.HCM)</span>
//           <ChevronDown className="size-4 text-zinc-400" />
//         </div>

//         <button className="relative p-2.5 rounded-xl bg-white border border-zinc-200/80 hover:bg-zinc-50 transition-colors">
//           <Bell className="size-4.5 text-zinc-600" />
//           <span className="absolute 1 top-1.5 right-1.5 size-3.5 bg-rose-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">3</span>
//         </button>

      
//         <Button className="h-10 px-5 bg-zinc-950 hover:bg-zinc-800 text-white rounded-xl text-xs font-medium flex items-center gap-2">
//           <Plus className="size-4" />
//           Tạo đơn xe mới
//         </Button>
//       </div> */}
//     </header>
//   );
// };