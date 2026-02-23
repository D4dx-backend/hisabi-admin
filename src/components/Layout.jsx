import { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Users, UsersRound, ScrollText, LogOut,
  BookOpen, Sparkles, Moon, Activity, HandHeart,
  Flame, BookMarked, BookCheck, BookOpenCheck, TrendingUp,
  LibraryBig, GraduationCap, Menu, Search, Bell, X, User as UserIcon
} from 'lucide-react';
import ConfirmationModal from './ConfirmationModal';

const mainNav = [
  { to: '/', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/users', label: 'Users', Icon: Users },
  { to: '/groups', label: 'Groups', Icon: UsersRound },
  { to: '/activity-logs', label: 'Activity Logs', Icon: ScrollText },
];

const contentNav = [
  { to: '/content/duas', label: 'Duas', Icon: BookOpen },
  { to: '/content/dhikr-types', label: 'Dhikr Types', Icon: Sparkles },
  { to: '/content/fasting-types', label: 'Fasting Types', Icon: Moon },
  { to: '/content/quran-reading-portions', label: 'Reading Portions', Icon: LibraryBig },
  { to: '/content/quran-memorization-portions', label: 'Memorization Portions', Icon: GraduationCap },
];

const trackingNav = [
  { to: '/tracking/prayers', label: 'Prayer Tracking', Icon: HandHeart },
  { to: '/tracking/dhikr', label: 'Dhikr Tracking', Icon: Sparkles },
  { to: '/tracking/fasting', label: 'Fasting Days', Icon: Flame },
  { to: '/tracking/quran-reading', label: 'Quran Reading', Icon: BookMarked },
  { to: '/tracking/quran-memorization', label: 'Quran Memorization', Icon: BookCheck },
  { to: '/tracking/quran-progress', label: 'Quran Progress', Icon: BookOpenCheck },
  { to: '/tracking/dua-memorization', label: 'Dua Memorization', Icon: Activity },
  { to: '/tracking/streaks', label: 'Streaks Overview', Icon: TrendingUp },
];

function NavSection({ title, items, closeSidebar }) {
  return (
    <div className="mb-6">
      <h3 className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2 font-display">{title}</h3>
      <div className="space-y-1">
        {items.map(({ to, label, Icon }) => {
          const NavIcon = Icon;
          return (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={closeSidebar}
              className={({ isActive }) =>
                `group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 ${isActive
                  ? 'bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100/50'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <div className="flex items-center gap-3">
                  <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-emerald-100/50 text-emerald-600' : 'bg-slate-100/50 text-slate-400 group-hover:bg-slate-200/50 group-hover:text-slate-600'}`}>
                    <NavIcon size={16} />
                  </div>
                  {label}
                </div>
              )}
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default function Layout({ children }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogoutConfirm = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  // Derive page title from path
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/users')) return 'Users';
    if (path.startsWith('/groups')) return 'Groups';
    if (path.startsWith('/activity-logs')) return 'Activity Logs';
    if (path.startsWith('/content')) return 'Detailed Content';
    if (path.startsWith('/tracking')) return 'Analytics Tracking';
    return 'Admin Portal';
  };

  return (
    <div className="flex h-screen bg-slate-50/50 overflow-hidden font-sans text-slate-800">

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-100 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>

        {/* Sidebar Header */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50 shrink-0">
          <NavLink to="/" className="flex items-center gap-3 group" onClick={closeSidebar}>
            <div className="p-1.5 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white group-hover:shadow-sm transition-all">
              <img src="/color.png" alt="Hisabi Logo" className="h-8 w-8 object-contain" />
            </div>
            <span className="text-xl font-black font-display tracking-tight text-slate-800 group-hover:text-emerald-600 transition-colors">Hisabi</span>
          </NavLink>
          <button onClick={closeSidebar} className="lg:hidden p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-4 py-6">
          <NavSection title="Core Platform" items={mainNav} closeSidebar={closeSidebar} />
          <NavSection title="Content Catalogues" items={contentNav} closeSidebar={closeSidebar} />
          <NavSection title="Tracking Data" items={trackingNav} closeSidebar={closeSidebar} />
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-50 shrink-0 bg-slate-50/50">
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="flex items-center justify-center gap-2 w-full px-4 py-2.5 rounded-xl text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:border-red-200 hover:text-red-600 hover:bg-red-50 hover:shadow-sm transition-all group"
          >
            <LogOut size={16} className="text-slate-400 group-hover:text-red-500 transition-colors" />
            <span className="group-hover:translate-x-0.5 transition-transform">Secure Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">

        {/* Top Header */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-4 sm:px-8 z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              <Menu size={24} />
            </button>
            <h1 className="text-xl font-bold text-slate-800 font-display hidden sm:block">{getPageTitle()}</h1>
          </div>

          <div className="flex items-center gap-3 sm:gap-5">
            {/* Search Bar (Visual Only) */}
            <div className="hidden md:flex items-center relative group">
              <Search size={16} className="absolute left-3 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
              <input
                type="text"
                placeholder="Search resources..."
                className="pl-10 pr-4 py-2 rounded-full text-sm bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 hover:bg-white transition-all w-48 lg:w-64 font-medium"
              />
            </div>

            {/* Notifications */}
            <button className="relative p-2 text-slate-400 hover:bg-slate-50 hover:text-slate-600 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="w-px h-6 bg-slate-200 mx-1 hidden sm:block"></div>

            {/* User Avatar */}
            <div className="flex items-center gap-3 px-1">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-sm font-bold text-slate-700">Super Admin</span>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Active Session</span>
              </div>
              <div className="h-10 w-10 rounded-full bg-slate-900 border-2 border-slate-100 shadow-sm flex items-center justify-center text-white overflow-hidden transform hover:scale-105 transition-transform cursor-pointer">
                <UserIcon size={18} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 custom-scrollbar relative z-10 w-full">
          <div className="animate-fade-in mx-auto w-full max-w-[1600px]">
            {children}
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
        title="Secure Sign Out"
        message="Are you sure you want to end your current session and securely sign out of the administrative portal?"
        confirmText="Yes, sign me out"
        cancelText="Cancel"
        type="logout"
      />
    </div>
  );
}
