import { createBrowserRouter, Navigate } from 'react-router-dom';
import { CustomerLayout } from '../layouts/CustomerLayout';
import { HomePage } from '../pages/HomePage';
import { ProductDetailPage } from '../pages/ProductDetailPage';
import { CartPage } from '../pages/CartPage';
// import { ProfilePage } from '../pages/ProfilePage';
import { RegisterPage } from '../pages/RegisterPage';
import { VehiclePage } from '../pages/VehiclePage';
import { PaymentPage } from '../pages/PaymentPage';
import { OrderPage } from '../pages/OrderPage';

// import admin
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import { AdminLayout } from '../layouts/admin/AdminLayout';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';

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
      // {
      //   path: 'vehicles',
      //   element: <div className="pt-24 text-center">Trang danh mục tất cả dòng xe</div>,
      // },
      // {
      //   path: 'vehicle-detail/:id',
      //   element: <ProductDetailPage />,
      // },
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
  //  {
  //       path: 'cart/:id',
  //       element: <CartPage />,
  //     },
    {
        path: 'vehicle-detail/:id',
        element: <ProductDetailPage />,
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

    ]},
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
  
]); 