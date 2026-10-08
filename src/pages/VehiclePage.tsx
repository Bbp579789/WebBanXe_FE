import React from 'react';
import { BannerSlider } from '../components/common/BannerSlider';
import { VehicleListGrid } from '../sections/vehicle/VehicleListGrid';


export const VehiclePage: React.FC = () => {
  return (
    <div className="w-full bg-[#fbfaf8] min-h-screen">
     
      <BannerSlider
      />
      <VehicleListGrid itemsPerPage={6} />
    </div>
  );
};

export default VehiclePage;