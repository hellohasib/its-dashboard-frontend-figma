import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Map } from 'lucide-react';

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
}

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarItems: SidebarItem[] = [
    { id: 'home', label: 'Home', icon: <Home className="w-6 h-6" />, path: '/dashboard' },
    { id: 'map', label: 'Map', icon: <Map className="w-6 h-6" />, path: '/map' },
  ];

  return (
    <aside className="w-20 bg-white dark:bg-dark dark:border-gray-700 border-r border-stroke h-[calc(100vh-5rem)] flex flex-col items-center py-6 transition-colors">
      {/* Navigation Items */}
      <nav className="flex flex-col gap-4 w-full">
        {sidebarItems.map((item) => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            title={item.label}
            className={`w-full flex items-center justify-center py-4 transition-colors relative ${
              location.pathname === item.path
                ? 'text-primary bg-blue-50 dark:bg-blue-900/30'
                : 'text-primary-text dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-dark-dark3'
            }`}
          >
            {item.icon}
            {location.pathname === item.path && (
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-l" />
            )}
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;

