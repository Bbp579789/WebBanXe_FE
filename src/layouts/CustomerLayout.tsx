import { Outlet } from 'react-router-dom';
import AIChatWidget from '../components/ai-chat/AIChatWidget';
import Footer from '../components/common/Footer';
import Header from '../components/common/Header';

export const CustomerLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#fbfaf8]">
      <Header />
      <main className="flex-1 w-full"><Outlet /></main>
      <Footer />
      
      <AIChatWidget />
    </div>
  );
};