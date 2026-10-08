import React from 'react';
import { MaybachShowcase } from '../sections/home/MaybachShowcase';
import { AtelierProtocols } from '../sections/home/AtelierProtocols';
import BannerSlider from '../components/common/BannerSlider';


export const HomePage: React.FC = () => {
  return (
    <div className="w-full bg-[#fcfbf9] text-zinc-900 select-none pb-24">

      <BannerSlider />
      <MaybachShowcase />
      <AtelierProtocols />

    </div>
  );
};

export default HomePage;