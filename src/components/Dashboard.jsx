import { useState, useEffect, useRef } from 'react';
import Analytics from './Analytics';
import RecordsTable from './RecordsTable';
import {
  LayoutDashboard,
  Table2,
  LogOut,
  User,
  Menu,
  X,
  ChevronDown,
  Settings,
  HelpCircle,
} from 'lucide-react';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      try {
        setUser(JSON.parse(userData));
      } catch {
        setUser(null);
      }
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth < 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'analytics', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'records', label: 'Records', icon: Table2 },
  ];

  const getUserInitial = () => {
    const name = user?.name || user?.username || 'User';
    return name.charAt(0).toUpperCase();
  };

  const getUserName = () => {
    return user?.name || user?.username || 'User';
  };

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar Overlay (Mobile) */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:relative z-50 h-full w-64 bg-white border-r border-gray-200 
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Logo / Header Sidebar - HANYA LOGO, TANPA USER */}
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="font-semibold text-gray-800">Dashboard</span>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg hover:bg-gray-100"
            >
              <X size={20} className="text-gray-500" />
            </button>
          )}
        </div>

        {/* Menu Navigation - LANGSUNG MENU, TANPA USER PROFILE */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-50 text-blue-600 shadow-sm' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }
                `}
              >
                <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-400'} />
                <span>{item.label}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-8 bg-blue-600 rounded-full" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Dropdown Logout - DI BAWAH */}
        <div className="p-4 border-t border-gray-200 shrink-0" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-all relative"
          >
            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
              <User size={16} className="text-gray-600" />
            </div>
            <span className="flex-1 text-left">{getUserName()}</span>
            <ChevronDown 
              size={16} 
              className={`text-gray-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}
            />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute bottom-20 left-4 right-4 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
              <div className="px-4 py-2 border-b border-gray-100">
                <p className="text-sm font-medium text-gray-800">{getUserName()}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <Settings size={16} />
                Pengaturan
              </button>
              <button
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <HelpCircle size={16} />
                Bantuan
              </button>
              <div className="border-t border-gray-100 my-1" />
              <button
                onClick={() => {
                  setDropdownOpen(false);
                  onLogout();
                }}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header - dengan User Info di Kanan */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center px-4 md:px-6 shrink-0">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors md:hidden"
          >
            <Menu size={22} className="text-gray-600" />
          </button>
          <div className="flex-1" />
          
          {/* User Info di Header Kanan */}
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500 hidden sm:block">
              {new Date().toLocaleDateString('id-ID', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric'
              })}
            </div>
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-xs shadow-sm">
              {getUserInitial()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'analytics' ? <Analytics /> : <RecordsTable />}
          </div>
        </main>
      </div>
    </div>
  );
}