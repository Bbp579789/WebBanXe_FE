# Dealership Management System - Frontend

Frontend của hệ thống quản lý kinh doanh ô tô, được xây dựng nhằm cung cấp giao diện cho khách hàng và nhân viên quản trị thực hiện các chức năng như xem danh sách xe, tìm kiếm xe, quản lý hợp đồng, đặt cọc và theo dõi trạng thái đơn hàng.

## 1. Technologies

Dự án được phát triển bằng các công nghệ:

- **ReactJS** – Thư viện xây dựng giao diện người dùng.
- **Vite** – Công cụ build và phát triển ứng dụng Frontend.
- **TypeScript** – Ngôn ngữ lập trình mở rộng từ JavaScript, hỗ trợ kiểm tra kiểu dữ liệu.
- **Tailwind CSS** – Framework CSS hỗ trợ thiết kế giao diện nhanh chóng.
- **Axios** – Thư viện HTTP Client dùng để giao tiếp với Backend API.
- **React Router DOM** – Quản lý điều hướng giữa các trang.
- **Lucide React** – Thư viện icon cho giao diện.

## 2. Requirements

Trước khi cài đặt dự án, cần chuẩn bị:

- Node.js (khuyến nghị phiên bản LTS).
- npm hoặc yarn.
- Git.

Kiểm tra phiên bản:

```bash
node -v
npm -v
```

## 3. Installation

### Step 1: Clone repository

```bash
git clone <repository-url>
```

### Step 2: Move into project directory

```bash
cd <project-folder>
```

### Step 3: Install dependencies

```bash
npm install
```


Trong đó:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Địa chỉ API Gateway của Backend. Có thể đặt domain gốc, `/api` hoặc đầy đủ `/api/v1`. |
| `VITE_AI_URL` | Địa chỉ public của ai-service hoặc reverse proxy tới ai-service. Bắt buộc khi build production. |

Lưu ý: Thay đổi URL tùy theo môi trường chạy Backend.

## 4. Run Application

### Development mode

```bash
npm run dev
```

Sau khi chạy thành công, truy cập:

```text
http://localhost:5173
```

### Build for production

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

## 5. Project Structure

```text
src/
├── assets/              # Hình ảnh, font và tài nguyên tĩnh
├── components/          # Các component dùng chung
├── data/                # Dữ liệu cấu hình và dữ liệu tĩnh
├── hooks/               # Custom React Hooks
├── layouts/             # Các layout của ứng dụng
├── pages/               # Các trang chính
├── routes/              # Cấu hình React Router
├── sections/            # Các thành phần giao diện theo từng chức năng
├── services/            # API services và Axios configuration
├── types/               # TypeScript interfaces và types
├── utils/               # Các hàm tiện ích
├── App.tsx              # Component gốc
└── main.tsx             # Entry point của ứng dụng

public/                  # Tài nguyên public
.env                     # Biến môi trường
package.json             # Dependencies và scripts
vite.config.ts           # Cấu hình Vite
tsconfig.json            # Cấu hình TypeScript
```

*Lưu ý: Cấu trúc trên mang tính tham khảo và có thể thay đổi tùy theo phiên bản hiện tại của dự án.*

## 6. API Configuration

Dự án sử dụng Axios để giao tiếp với Backend thông qua API Gateway.

Ví dụ cấu hình Axios:

```typescript
import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});
```

Các API được tổ chức trong thư mục `services/`, giúp tách biệt phần xử lý dữ liệu với giao diện người dùng.

## 7. Main Features

Các chức năng chính của hệ thống:

### Customer

- Đăng ký và đăng nhập tài khoản.
- Xem danh sách xe ô tô.
- Xem thông tin chi tiết xe.
- Quản lý giỏ hàng.
- Tạo hợp đồng mua xe.
- Đặt cọc và thanh toán trực tuyến qua VNPay.
- Theo dõi trạng thái hợp đồng và giao xe.


### Admin

- Đăng nhập hệ thống quản trị.
- Quản lý thông tin xe.
- Quản lý danh sách khách hàng.
- Quản lý hợp đồng và đơn hàng.
- Cập nhật trạng thái hợp đồng.
- Theo dõi quá trình giao xe.
- Quản lý và theo dõi hoạt động kinh doanh.

## 8. Development Workflow

Quy trình phát triển dự án:

1. Clone repository từ Git.
2. Cài đặt các dependencies bằng `npm install`.
3. Cấu hình biến môi trường trong file `.env`.
4. Khởi chạy Backend API Gateway.
5. Chạy Frontend bằng `npm run dev`.
6. Phát triển và kiểm thử các chức năng.
7. Build ứng dụng bằng `npm run build`.

## 9. Git Workflow

Một số lệnh Git thường sử dụng:

```bash
# Kiểm tra trạng thái
git status

# Tạo branch mới
git checkout -b feature/feature-name

# Thêm thay đổi
git add .

# Commit
git commit -m "Add feature description"

# Push branch
git push origin feature/feature-name
```

## 10. License

This project is developed for academic purposes as part of a university capstone project.
