import { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Settings, LogOut, Building2, ChevronLeft, ChevronRight, Menu, X, Bell, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await api.get('/superadmin/notifications');
      setNotifications(res.data);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleReadNotification = async (id) => {
    try {
      await api.put(`/superadmin/notifications/${id}/read`);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('adminAuth');
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Customers', path: '/customers', icon: <Users className="w-5 h-5" /> },
    { name: 'Invoices', path: '/invoices', icon: <Receipt className="w-5 h-5" /> },
    { name: 'Settings', path: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  const SidebarContent = () => (
    <>
      <div className={`p-5 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} border-b border-slate-100`}>
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-2 rounded-xl shadow-md shadow-blue-500/20 shrink-0">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && (
            <motion.h1 
              initial={{ opacity: 0, w: 0 }}
              animate={{ opacity: 1, w: 'auto' }}
              exit={{ opacity: 0, w: 0 }}
              className="text-xl font-extrabold text-slate-900 tracking-tight whitespace-nowrap"
            >
              SecureBill<span className="text-blue-600">Pro</span>
            </motion.h1>
          )}
        </div>
      </div>

      <nav className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? 'bg-blue-50 text-blue-700 font-semibold shadow-sm border border-blue-100/50' 
                  : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600 font-medium'
              } ${isCollapsed ? 'justify-center' : ''}`
            }
            title={isCollapsed ? item.name : ''}
          >
            <div className={`relative ${window.location.pathname.includes(item.path) ? 'text-blue-600' : ''}`}>
              {item.icon}
              {window.location.pathname.includes(item.path) && (
                <span className="absolute -left-3 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-blue-600 rounded-r-md"></span>
              )}
            </div>
            {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 w-full p-3 text-slate-500 hover:bg-red-50 hover:text-red-600 font-medium rounded-xl transition-colors group ${isCollapsed ? 'justify-center' : ''}`}
          title={isCollapsed ? "Logout" : ""}
        >
          <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen bg-[#F8FAFC] font-sans overflow-hidden">
      
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.aside
              initial={{ x: '-100%' }} animate={{ x: 0 }} exit={{ x: '-100%' }} transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-72 bg-white border-r border-slate-200 z-50 flex flex-col shadow-2xl lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-slate-400 hover:text-slate-700 bg-slate-100 rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-white border-r border-slate-200 z-30 transition-all duration-300 relative shadow-sm ${isCollapsed ? 'w-24' : 'w-72'}`}>
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-4 top-8 bg-white border border-slate-200 text-slate-400 p-1.5 rounded-full hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-colors z-40 shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-20 flex items-center justify-between px-4 sm:px-8 z-20 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-bold text-slate-800 hidden sm:block capitalize">
              {location.pathname.substring(1) || 'Dashboard'}
            </h2>
          </div>

          <div className="flex items-center gap-5">
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-400 hover:text-blue-600 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white"></span>
                )}
              </button>
              
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                      <h3 className="font-bold text-slate-800">Notifications</h3>
                      {unreadCount > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-bold">{unreadCount} New</span>}
                    </div>
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-slate-500 text-sm">No notifications yet</div>
                      ) : (
                        notifications.map((notif) => (
                          <div 
                            key={notif._id} 
                            onClick={() => !notif.isRead && handleReadNotification(notif._id)}
                            className={`p-4 border-b border-slate-50 cursor-pointer transition-colors hover:bg-slate-50 ${!notif.isRead ? 'bg-blue-50/50' : ''}`}
                          >
                            <div className="flex justify-between items-start mb-1">
                              <h4 className={`text-sm ${!notif.isRead ? 'font-bold text-slate-900' : 'font-medium text-slate-700'}`}>{notif.title}</h4>
                              <span className="text-[10px] text-slate-400 whitespace-nowrap ml-2">
                                {new Date(notif.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-xs text-slate-600 line-clamp-2">{notif.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>
            <div className="flex items-center gap-3 cursor-pointer group">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">Super Admin</p>
                <p className="text-xs text-slate-500">admin@gmail.com</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold shadow-sm">
                A
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 sm:p-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
