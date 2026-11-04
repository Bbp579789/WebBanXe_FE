
// import React from "react";

// import { Link } from "react-router-dom";
// import { Icon } from "../../components/ui/icon";

// import { useContracts } from "../../hooks/useContracts";

// import { OrderHeaderSection } from "./OrderHeaderSection";
// import { OrderFilterSection } from "./OrderFilterSection";
// import { OrderListSection } from "./OrderListSection";
// import { OrderPaginationSection } from "./OrderPaginationSection";

// export const OrderContentSection: React.FC = () => {
//   const {
//     filteredContracts,
//     activeFilter,
//     setActiveFilter,
//     counts,
//     loading,
//   } = useContracts();

//   return (
//     <section className="max-w-6xl mx-auto px-6">

//       {/* Breadcrumb */}
//       <nav
//         aria-label="Breadcrumb"
//         className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8"
//       >
//         <Link
//           to="/"
//           className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
//         >
//           <Icon name="home" className="size-3.5" />
//           <span>Home</span>
//         </Link>

//         <span className="text-zinc-300">/</span>

//         <span className="text-[#b8955a] font-medium">
//           My Contracts
//         </span>
//       </nav>

//       {/* Main Content */}
//       <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-zinc-200">

//         <OrderHeaderSection />

//         <OrderFilterSection
//           activeFilter={activeFilter}
//           setFilter={setActiveFilter}
//           counts={counts}
//         />

//         {loading ? (
//           <div className="py-20 text-center text-sm text-zinc-500">
//             Loading contracts...
//           </div>
//         ) : (
//           <>
//             <OrderListSection contracts={filteredContracts} />

//             {filteredContracts.length > 0 && (
//               <OrderPaginationSection />
//             )}
//           </>
//         )}

//       </div>
//     </section>
//   );
// };


import React from "react";
import { Link } from "react-router-dom";
import { Icon } from "../../components/ui/icon";

import { useContracts } from "../../hooks/useContracts";

import { OrderHeaderSection } from "./OrderHeaderSection";
import { OrderFilterSection } from "./OrderFilterSection";
import { OrderListSection } from "./OrderListSection";
import { OrderPaginationSection } from "./OrderPaginationSection";

export const OrderContentSection: React.FC = () => {
  const {
    filteredContracts,
    activeFilter,
    setActiveFilter,
    counts,
    loading,
  } = useContracts();

  // Đảm bảo dữ liệu luôn là một mảng
  const safeContracts = Array.isArray(filteredContracts)
    ? filteredContracts
    : [];

  return (
    <section className="max-w-6xl mx-auto px-6">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8"
      >
        <Link
          to="/"
          className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors"
        >
          <Icon name="home" className="size-3.5" />
          <span>Home</span>
        </Link>

        <span className="text-zinc-300">/</span>

        <span className="text-[#b8955a] font-medium">
          My Contracts
        </span>
      </nav>

      {/* Main Content */}
      <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-zinc-200">
        <OrderHeaderSection />

        <OrderFilterSection
          activeFilter={activeFilter}
          setFilter={setActiveFilter}
          counts={counts}
        />

        {loading ? (
          <div className="py-20 text-center">
            <div className="animate-spin rounded-full size-8 border-2 border-zinc-200 border-t-[#b8955a] mx-auto mb-4" />

            <p className="text-sm text-zinc-500">
              Loading contracts...
            </p>
          </div>
        ) : (
          <>
            <OrderListSection contracts={safeContracts} />

            {safeContracts.length > 0 && (
              <OrderPaginationSection />
            )}
          </>
        )}
      </div>
    </section>
  );
};