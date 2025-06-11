import {
  Bars3Icon,
  BellIcon,
  UserCircleIcon,
  ChevronDownIcon,
} from "@heroicons/react/24/outline";
import { useState } from "react";
import { Link } from "react-router-dom";

const Header = ({ user, onMenuClick, onLogout }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        onClick={onMenuClick}
        className="text-gray-500 hover:text-gray-600 lg:hidden"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex flex-1"></div>
        <div className="flex items-center gap-x-4 lg:gap-x-6">
          <button className="text-gray-400 hover:text-gray-500">
            <BellIcon className="h-6 w-6" />
          </button>

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-x-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            >
              <UserCircleIcon className="h-8 w-8 text-gray-400" />
              <span className="hidden lg:block">
                {user?.firstName || "User"}
              </span>
              <ChevronDownIcon className="h-4 w-4" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2 text-sm text-gray-700 border-b">
                  <p className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <a
                  href="/settings"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Settings
                </a>
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
