import { useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  HomeIcon,
  CreditCardIcon,
  ChartPieIcon,
  BanknotesIcon, // Icon tiền bạc cho Budgets
  CogIcon,
  XMarkIcon,
  UsersIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";

const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { user, isAdmin } = useAuth();

  // Base navigation items for all users
  const baseNavigation = [
    { name: "Dashboard", href: "/dashboard", icon: HomeIcon },
    { name: "Transactions", href: "/transactions", icon: CreditCardIcon },
    { name: "Budgets", href: "/budgets", icon: BanknotesIcon }, // Sử dụng BanknotesIcon
    { name: "Analytics", href: "/analytics", icon: ChartPieIcon },
    { name: "Settings", href: "/settings", icon: CogIcon },
  ];

  // Admin-only navigation items
  const adminNavigation = [
    {
      name: "Quản lý tài khoản",
      href: "/admin/accounts",
      icon: UsersIcon,
      adminOnly: true,
    },
  ];

  // Combine navigation based on user role
  const navigation = isAdmin()
    ? [...baseNavigation, ...adminNavigation]
    : baseNavigation;

  const isActive = (href) => {
    return location.pathname === href;
  };

  return (
    <>
      {/* Mobile sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              FinanceTracker
            </h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User info section for mobile */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {user.firstName?.[0] || user.email?.[0] || "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    {isAdmin() && (
                      <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <ShieldCheckIcon className="w-3 h-3 mr-1" />
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } ${item.adminOnly ? "border-l-2 border-purple-300" : ""}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.adminOnly && (
                  <ShieldCheckIcon className="ml-auto h-4 w-4 text-purple-500" />
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-grow bg-white border-r border-gray-200">
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              FinanceTracker
            </h2>
          </div>

          {/* User info section for desktop */}
          {user && (
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.firstName?.[0] || user.email?.[0] || "U"}
                    </span>
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.firstName} {user.lastName}
                  </p>
                  <div className="flex items-center space-x-2">
                    <p className="text-xs text-gray-500 truncate">
                      {user.email}
                    </p>
                    {isAdmin() && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                        <ShieldCheckIcon className="w-3 h-3 mr-1" />
                        Admin
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navigation.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive(item.href)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                } ${item.adminOnly ? "border-l-2 border-purple-300" : ""}`}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.name}
                {item.adminOnly && (
                  <ShieldCheckIcon className="ml-auto h-4 w-4 text-purple-500" />
                )}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
