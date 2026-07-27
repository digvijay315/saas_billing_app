import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Users, UtensilsCrossed, FileText, BedDouble, BookOpen, Settings, CreditCard } from "lucide-react";

export default function Sidebar({ isOpen, closeSidebar }) {
  const location = useLocation();
  const [permissions, setPermissions] = useState(null);

  useEffect(() => {
    const fetchUser = () => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.staffPermissions) {
        setPermissions(user.staffPermissions);
      } else {
        // default all true if not set
        setPermissions({
          restaurant: true,
          roomBooking: true,
          kot: true,
          advanceBooking: true,
          grc: true
        });
      }
    };
    
    fetchUser();
    window.addEventListener("user-updated", fetchUser);
    return () => window.removeEventListener("user-updated", fetchUser);
  }, []);

  const menuItems = [
    {
      name: "Dashboard Reports",
      path: "/admin",
      icon: LayoutDashboard,
      show: true,
    },
    {
      name: "Restaurant Billing",
      path: "/admin/reports",
      icon: FileText,
      show: !permissions || permissions.restaurant,
    },
    {
      name: "Room Bookings",
      path: "/admin/room-reports",
      icon: BookOpen,
      show: !permissions || permissions.roomBooking,
    },
    {
      name: "Advance Bookings",
      path: "/admin/advance-bookings",
      icon: BookOpen,
      show: !permissions || permissions.advanceBooking,
    },
    {
      name: "Manage Staff",
      path: "/admin/staff",
      icon: Users,
      show: true,
    },
    {
      name: "Manage Dishes",
      path: "/admin/dishes",
      icon: UtensilsCrossed,
      show: !permissions || permissions.restaurant,
    },
    {
      name: "Manage Rooms",
      path: "/admin/rooms",
      icon: BedDouble,
      show: !permissions || permissions.roomBooking,
    },
    {
      name: "Manage Tables",
      path: "/admin/tables",
      icon: UtensilsCrossed,
      show: !permissions || permissions.restaurant,
    },
    {
      name: "Settings",
      path: "/admin/settings",
      icon: Settings,
      show: true,
    },
    {
      name: "Subscription",
      path: "/admin/billing",
      icon: CreditCard,
      show: true,
    },
  ];

  const visibleMenuItems = menuItems.filter(item => item.show);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-40 md:hidden top-[73px]"
          onClick={closeSidebar}
        />
      )}
      <aside className={`w-64 glass border-r border-gold-800/10 min-h-[calc(100vh-80px)] p-4 flex flex-col gap-2 no-print shrink-0 
        fixed md:static top-[73px] md:top-0 bottom-0 left-0 z-50 md:z-0
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        bg-slate-950 md:bg-transparent overflow-y-auto
      `}>
        <div className="px-3 py-2">
        <p className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
          Admin Control Center
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        {visibleMenuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => closeSidebar && closeSidebar()}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-amber-600/25 to-yellow-600/10 border border-amber-500/30 text-amber-400 font-semibold"
                  : "hover:bg-slate-905/40 hover:text-slate-200 text-slate-400 border border-transparent"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-amber-400" : "text-slate-400"}`} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </div>
      </aside>
    </>
  );
}
