// =====================================================
// MAIN LAYOUT
// Site-wide layout with header and footer
// Migrated from: PHP header.php + footer.php
// =====================================================

import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-dark-800">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
