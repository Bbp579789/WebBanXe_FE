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

export const router = createBrowserRouter([
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
]);
