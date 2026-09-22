import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import PageContainer from './PageContainer';

export default function AppShell({ children }) {
  const [mobileDrawerOpen, setMobileDrawerOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F7F6F2] text-[#202124] flex flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar Component (Desktop column + Mobile drawer) */}
      <Sidebar mobileDrawerOpen={mobileDrawerOpen} setMobileDrawerOpen={setMobileDrawerOpen} />

      {/* Main App Container */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen pb-16 lg:pb-0">
        {/* Header */}
        <Header mobileDrawerOpen={mobileDrawerOpen} setMobileDrawerOpen={setMobileDrawerOpen} />

        {/* Main Content Area inside PageContainer */}
        <main className="flex-1 min-w-0">
          <PageContainer>
            {children}
          </PageContainer>
        </main>
      </div>
    </div>
  );
}
