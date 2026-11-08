import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { HomePage } from '../pages/user/HomePage';
import { ProductDetailPage } from '../pages/user/ProductDetailPage';
import { CartPage } from '../pages/user/CartPage';
// import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/user/RegisterPage';
import { VehiclePage } from '../pages/user/VehiclePage';
import { PaymentPage } from '../pages/user/PaymentPage';
import { OrderPage } from '../pages/user/OrderPage';
import { CheckoutPage } from '../pages/user/CheckoutPage';
import VNPayReturnPage from '../pages/user/VNPayReturnPage';


// import admin
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import { AdminLayout } from '../layouts/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import { AdminChatPage } from '../pages/admin/AdminChatPage';

import AdminOrdersPage from '../pages/admin/AdminOrdersPage';
import AdminCustomersPage from '../pages/admin/AdminCustomersPage';
import AdminVehiclesPage from '../pages/admin/AdminVehiclesPage';
import AdminKnowledgePage from '../pages/admin/AdminKnowledgePage';

export const router = createBrowserRouter([
  // CÁC ROUTE CHO WEB USER
  {
    path: '/',
    element: <CustomerLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: 'order',
        element: <OrderPage />,
      },
      {
        path: 'payment',
        element: <PaymentPage />,
      },
      {
        path: 'vehicles',
        element: <VehiclePage />,
      },
      {
        path: 'cart',
        element: <CartPage />,
      },
      // {
      //   path: 'profile',
      //   element: <ProfilePage />,
      // },
    ],
  },
  {
    path: 'vehicle-detail/:id',
    element: <ProductDetailPage />,
  },
  {
    path: 'checkout/:vehicle_id',
    element: <CheckoutPage />,
  },
  {
    path: "/payments/vnpay/return",
    element: <VNPayReturnPage />,
  },
  {
    path: 'register',
    element: <RegisterPage />,
  },
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },



  {
    path: '/admin/login',
    element: <AdminLoginPage />,
  },
{
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'vehicles',
        element: <AdminVehiclesPage />,
      },
      {
        path: 'orders',
        element: <AdminOrdersPage />,
      },
      {
        path: 'customers',
        element: <AdminCustomersPage />,
      },
      {
        path: 'chat',
        element: <AdminChatPage />,
      },
      {
        path: 'knowledge',
        element: <AdminKnowledgePage />,
      },

    ]},
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
  
]);
