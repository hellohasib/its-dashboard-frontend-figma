import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronDown, Grid, Layers, Cloud, FileText, PieChart, Check, Settings } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import UserDropdown from './UserDropdown';

interface SubMenuItem {
  id: string;
  label: string;
  path: string;
}

interface MegaMenuColumn {
  title: string;
  items: SubMenuItem[];
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  megaMenu?: MegaMenuColumn[];
  categoryMenu?: {
    categories: { id: string; label: string }[];
    categoryItems: Record<string, SubMenuItem[]>;
  };
}

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hasRole } = useAuth();
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('vds');
  const menuRef = useRef<HTMLDivElement>(null);

  const navItems: NavItem[] = [
    {
      id: 'resource-management',
      label: 'Resource Management',
      icon: <Grid className="w-4 h-4" />,
      categoryMenu: {
        categories: [
          { id: 'vds', label: 'VDS' },
          { id: 'ss', label: 'SS' },
          { id: 'vms', label: 'VMS' },
          { id: 'facility', label: 'Facility' },
          { id: 'rtms', label: 'RTMS' },
        ],
        categoryItems: {
          vds: [
            { id: 'vds-all', label: 'All VDS Cameras', path: '/resource-management/vds' },
            { id: 'vds-main', label: 'Main Carriageway', path: '/resource-management/vds/main' },
            { id: 'vds-smvt', label: 'SMVT', path: '/resource-management/vds/smvt' },
            { id: 'vds-mdc', label: 'Motion Detection Camera', path: '/resource-management/vds/mdc' },
          ],
          ss: [
            { id: 'ss-all', label: 'All SS Cameras', path: '/resource-management/ss' },
            { id: 'ss-anpr', label: 'ANPR', path: '/resource-management/ss/anpr' },
            { id: 'ss-vsds', label: 'VSDS', path: '/resource-management/ss/vsds' },
            { id: 'ss-ptz', label: 'PTZ', path: '/resource-management/ss/ptz' },
            { id: 'ss-mdc', label: 'Motion Detection Camera', path: '/resource-management/ss/mdc' },
          ],
          vms: [
            { id: 'vms-all', label: 'All VMS', path: '/resource-management/vms' },
            { id: 'vms-display', label: 'VMS Display', path: '/resource-management/vms/display' },
            { id: 'vms-ptz', label: 'PTZ', path: '/resource-management/vms/ptz' },
            { id: 'vms-mdc', label: 'Motion Detection Camera', path: '/resource-management/vms/mdc' },
          ],
          facility: [
            { id: 'facility-all', label: 'All Facilities', path: '/resource-management/facilities' },
          ],
          rtms: [
            { id: 'rtms-all', label: 'All RTMS', path: '/resource-management/rtms' },
            { id: 'rtms-ptz', label: 'PTZ', path: '/resource-management/rtms/ptz' },
            { id: 'rtms-mdc', label: 'Motion Detection Camera', path: '/resource-management/rtms/mdc' },
          ],
        },
      },
    },
    {
      id: 'resource-control',
      label: 'Resource Control',
      icon: <Layers className="w-4 h-4" />,
      categoryMenu: {
        categories: [
          { id: 'vds', label: 'VDS' },
          { id: 'ss', label: 'SS' },
          { id: 'vms', label: 'VMS' },
          { id: 'facility', label: 'Facility' },
          { id: 'rtms', label: 'RTMS' },
        ],
        categoryItems: {
          vds: [
            { id: 'vds-all', label: 'All VDS Cameras', path: '/resource-control/vds' },
            { id: 'vds-main', label: 'Main Carriageway', path: '/resource-control/vds/main-carriageway' },
            { id: 'vds-smvt', label: 'SMVT', path: '/resource-control/vds/smvt' },
            { id: 'vds-mdc', label: 'Motion Detection Camera', path: '/resource-control/vds/mdc' },
          ],
          ss: [
            { id: 'ss-all', label: 'All SS Cameras', path: '/resource-control/ss' },
            { id: 'ss-anpr', label: 'ANPR', path: '/resource-control/ss/anpr' },
            { id: 'ss-vsds', label: 'VSDS', path: '/resource-control/ss/vsds' },
            { id: 'ss-ptz', label: 'PTZ', path: '/resource-control/ss/ptz' },
            { id: 'ss-mdc', label: 'Motion Detection Camera', path: '/resource-control/ss/mdc' },
          ],
          vms: [
            { id: 'vms-all', label: 'All VMS', path: '/resource-control/vms' },
            { id: 'vms-display', label: 'Display', path: '/resource-control/vms/display' },
            { id: 'vms-ptz', label: 'PTZ', path: '/resource-control/vms/ptz' },
            { id: 'vms-mdc', label: 'Motion Detection Camera', path: '/resource-control/vms/mdc' },
          ],
          facility: [
            { id: 'facility-all', label: 'All Facilities', path: '/resource-control/facilities' },
          ],
          rtms: [
            { id: 'rtms-all', label: 'All RTMS', path: '/resource-control/rtms' },
            { id: 'rtms-ptz', label: 'PTZ', path: '/resource-control/rtms/ptz' },
            { id: 'rtms-mdc', label: 'Motion Detection Camera', path: '/resource-control/rtms/mdc' },
          ],
        },
      },
    },
    {
      id: 'road-event',
      label: 'Road Event Management',
      icon: <Cloud className="w-4 h-4" />,
      megaMenu: [
        {
          title: 'Event Management',
          items: [
            { id: 'incident-management', label: 'Incident Management', path: '/road-events/incident-management' },
            { id: 'event-tracking', label: 'Event Tracking', path: '/road-events/event-tracking' },
          ],
        },
      ],
    },
    {
      id: 'history',
      label: 'History Inquiry',
      icon: <FileText className="w-4 h-4" />,
      megaMenu: [
        {
          title: 'Control History',
          items: [
            { id: 'control-vds', label: 'VDS', path: '/history/control/vds' },
            { id: 'control-ss', label: 'SS', path: '/history/control/ss' },
            { id: 'control-vms', label: 'VMS', path: '/history/control/vms' },
          ],
        },
        {
          title: 'Status History',
          items: [
            { id: 'status-vds', label: 'VDS', path: '/history/status/vds' },
            { id: 'status-ss', label: 'SS', path: '/history/status/ss' },
            { id: 'status-vms', label: 'VMS', path: '/history/status/vms' },
          ],
        },
        {
          title: 'Other',
          items: [
            { id: 'enforcement', label: 'Enforcement History', path: '/history/enforcement' },
            { id: 'traffic-info', label: 'Traffic Information History', path: '/history/traffic-info' },
          ],
        },
      ],
    },
    {
      id: 'traffic-stats',
      label: 'Traffic Statistics',
      icon: <PieChart className="w-4 h-4" />,
      megaMenu: [
        {
          title: '',
          items: [
            { id: 'traffic-info', label: 'Traffic Information Statistics', path: '/traffic-stats/traffic-information' },
            { id: 'incident', label: 'Incident Statistics', path: '/traffic-stats/incident' },
            { id: 'section-info', label: 'Section Information Statistics', path: '/traffic-stats/section-information' },
            { id: 'speed', label: 'Speed Statistics', path: '/traffic-stats/speed' },
          ],
        },
      ],
    },
  ];

  // Add Administration menu if user is super_admin only
  // Create a new array to avoid mutating the original
  const allNavItems = [...navItems];
  if (hasRole('super_admin')) {
    allNavItems.push({
      id: 'administration',
      label: 'Administration',
      icon: <Settings className="w-4 h-4" />,
      megaMenu: [
        {
          title: 'Management',
          items: [
            { id: 'users', label: 'User Management', path: '/users' },
            { id: 'roles', label: 'Role Management', path: '/roles' },
            { id: 'services', label: 'Service Management', path: '/services' },
            { id: 'permissions', label: 'Permission Management', path: '/permissions' },
          ],
        },
      ],
    });
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMenuClick = (menuId: string) => {
    if (openMenu === menuId) {
      setOpenMenu(null);
    } else {
      setOpenMenu(menuId);
      setSelectedCategory('vds'); // Reset to default category
    }
  };

  const handleSubmenuClick = (path: string) => {
    navigate(path);
    setOpenMenu(null);
  };

  const isPathActive = (item: NavItem): boolean => {
    if (item.megaMenu) {
      return item.megaMenu.some(col => 
        col.items.some(subItem => location.pathname === subItem.path)
      );
    }
    if (item.categoryMenu) {
      return Object.values(item.categoryMenu.categoryItems).some(items =>
        items.some(subItem => location.pathname === subItem.path)
      );
    }
    return false;
  };

  return (
    <header className="h-20 bg-white border-b border-stroke flex items-center justify-between px-6 sticky top-0 z-50">
      {/* Navigation Items */}
      <nav className="flex items-center gap-2" ref={menuRef}>
        {allNavItems.map((item) => (
          <div key={item.id} className="relative">
            <button
              onClick={() => handleMenuClick(item.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                openMenu === item.id || isPathActive(item)
                  ? 'text-primary bg-blue-50'
                  : 'text-primary-text hover:bg-gray-50'
              }`}
            >
              {item.icon}
              <span className="text-sm font-medium">{item.label}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  openMenu === item.id ? 'rotate-180' : ''
                }`}
              />
            </button>

            {/* Mega Menu */}
            {openMenu === item.id && item.megaMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-stroke shadow-lg p-6 z-50 flex gap-8">
                {item.megaMenu.map((column) => (
                  <div key={column.title || 'menu'} className="min-w-[240px]">
                    {column.title && <h4 className="text-sm font-semibold text-dark mb-3">{column.title}</h4>}
                    <div className="space-y-1">
                      {column.items.map((subItem, index) => (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem.path)}
                          className={`w-full text-left px-4 py-3 text-sm rounded-lg transition-colors flex items-center justify-between ${
                            location.pathname === subItem.path || index === 0
                              ? 'text-primary font-medium'
                              : 'text-dark hover:bg-gray-50'
                          }`}
                        >
                          {subItem.label}
                          {(location.pathname === subItem.path || index === 0) && (
                            <Check className="w-5 h-5" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Category Menu (for Resource Management/Control) */}
            {openMenu === item.id && item.categoryMenu && (
              <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-stroke shadow-lg p-6 z-50 flex gap-6">
                {/* Left: Categories */}
                <div className="min-w-[160px]">
                  <h4 className="text-sm font-semibold text-dark mb-3">
                    {item.id === 'resource-management' ? 'Sasec 2 ITS Facility Menu' : 'Device Type'}
                  </h4>
                  <div className="space-y-1">
                    {item.categoryMenu.categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-between ${
                          selectedCategory === category.id
                            ? 'text-primary bg-blue-50 font-medium'
                            : 'text-dark hover:bg-gray-50'
                        }`}
                      >
                        {category.label}
                        {selectedCategory === category.id && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Right: Category Items */}
                <div className="min-w-[220px] bg-gray rounded-2xl p-4">
                  <h4 className="text-base font-semibold text-dark mb-3">
                    All {selectedCategory.toUpperCase()} {item.id === 'resource-control' ? 'Cameras' : ''}
                  </h4>
                  <div className="space-y-1">
                    {item.categoryMenu.categoryItems[selectedCategory]?.map((subItem, index) => (
                      <button
                        key={subItem.id}
                        onClick={() => handleSubmenuClick(subItem.path)}
                        className={`w-full text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                          location.pathname === subItem.path
                            ? 'text-primary font-medium'
                            : index === 1
                            ? 'text-primary font-medium'
                            : 'text-dark hover:bg-gray-100'
                        }`}
                      >
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* User Profile Section */}
      <UserDropdown />
    </header>
  );
};

export default Header;

