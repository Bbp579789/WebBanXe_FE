import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Icon } from '../components/ui/icon';
import { orderService, type Order } from '../services/api/orderService';

import { OrderHeaderSection } from '../sections/order/OrderHeaderSection';
import { OrderFilterSection } from '../sections/order/OrderFilterSection';
import { OrderListSection } from '../sections/order/OrderListSection';
import { OrderPaginationSection } from '../sections/order/OrderPaginationSection';
import Header from '../components/common/Header';

export const OrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [isAuthorized, setIsAuthorized] = useState(false);

  // Bảo mật: Chưa đăng nhập không cho vào trang này
  useEffect(() => {
    const userName = localStorage.getItem('userName');
    if (!userName) {
      navigate('/');
      setTimeout(() => window.dispatchEvent(new Event('openLoginDialog')), 300);
      return;
    }
    
    setIsAuthorized(true);
    
    const fetchOrders = async () => {
      const data = await orderService.getOrdersForCurrentUser();
      setOrders(data);
    };
    fetchOrders();
  }, [navigate]);

  if (!isAuthorized) return null;

  const filteredOrders = orders.filter(o => 
    activeFilter === 'all' ? true : o.status === activeFilter
  );

  const counts = {
    all: orders.length,
    deposit: orders.filter(o => o.status === 'deposit').length,
    transit: orders.filter(o => o.status === 'transit').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
  };

  return (
     <div className="min-h-screen flex flex-col bg-[#fbfaf8] text-zinc-900 select-none">
          <Header forceSolid />
    <div className="min-h-screen bg-[#fbfaf8] pt-28 pb-20 font-sans">
      <div className="max-w-6xl mx-auto px-6">
        <nav aria-label="Breadcrumb" className="inline-flex items-center gap-2 text-xs font-mono text-zinc-500 mb-8">
          <Link to="/" className="flex items-center gap-1.5 hover:text-zinc-900 transition-colors">
            <Icon name="home" className="size-3.5" />
            <span>Home</span>
          </Link>
          <span className="text-zinc-300">/</span>
          <span className="text-[#b8955a] font-medium">Order</span>
        </nav>

        <div className="bg-white rounded-[32px] p-8 sm:p-12 shadow-sm border border-zinc-200">
          <OrderHeaderSection />
          <OrderFilterSection activeFilter={activeFilter} setFilter={setActiveFilter} counts={counts} />
          <OrderListSection orders={filteredOrders} />
          <OrderPaginationSection />
        </div>
      </div>
    </div>
    </div>
  );
};

export default OrderPage;