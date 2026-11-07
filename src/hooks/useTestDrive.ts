import { useState } from 'react';
import type { TestDriveFormData } from '../types';

export function useTestDrive(initialVehicleId: number = 1) {
  const [formData, setFormData] = useState<TestDriveFormData>({
    user_name: '',
    phone: '',
    driver_license_no: '',
    vehicle_id: initialVehicleId,
    timeline: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof TestDriveFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const submitTestDrive = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_name || !formData.phone) {
      alert('Vui lòng nhập đầy đủ Quý danh và Số điện thoại liên hệ.');
      return;
    }

    setIsSubmitting(true);
    try {
      // Giả lập gửi request API tới Backend (/api/test-drives)
      await new Promise(resolve => setTimeout(resolve, 800));
      alert(`Đã gửi đăng ký thành công cho Quý khách ${formData.user_name}!`);
      // Reset form
      setFormData({
        user_name: '',
        phone: '',
        driver_license_no: '',
        vehicle_id: initialVehicleId,
        timeline: 1,
      });
    } catch (err) {
      alert('Có lỗi xảy ra, vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    updateField,
    submitTestDrive,
    isSubmitting,
  };
}