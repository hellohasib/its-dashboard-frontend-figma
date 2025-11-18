import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import StatusBadge from '../components/StatusBadge';
import Input from '../components/Input';
import WeatherWidget from '../components/WeatherWidget';
import { TrendingUp, Activity, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('all');

  const stats = [
    {
      title: 'Total Devices',
      value: '1,234',
      change: '+12.5%',
      icon: <Activity className="w-6 h-6" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Active Devices',
      value: '1,156',
      change: '+8.2%',
      icon: <CheckCircle className="w-6 h-6" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Alerts',
      value: '23',
      change: '-5.4%',
      icon: <AlertTriangle className="w-6 h-6" />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Performance',
      value: '94.8%',
      change: '+2.1%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'text-primary',
      bgColor: 'bg-blue-50',
    },
  ];

  const tabs = [
    { id: 'all', label: 'All Devices' },
    { id: 'vds', label: 'VDS' },
    { id: 'ss', label: 'SS' },
    { id: 'vms', label: 'VMS' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'rtms', label: 'RTMS' },
  ];

  const allDevices = [
    { id: 'VDS-001', name: 'VDS Camera 1', type: 'VDS', location: 'Main Carriageway KM 12.5', status: 'active', uptime: '99.8%' },
    { id: 'SS-042', name: 'ANPR Camera 42', type: 'SS', location: 'Junction A - Entry', status: 'active', uptime: '98.5%' },
    { id: 'VMS-015', name: 'VMS Display 15', type: 'VMS', location: 'Exit 12 - North', status: 'wait', uptime: '95.2%' },
    { id: 'RTMS-003', name: 'RTMS Sensor 3', type: 'RTMS', location: 'Highway 5 - West', status: 'offline', uptime: '87.3%' },
    { id: 'VDS-012', name: 'VDS Camera 12', type: 'VDS', location: 'Main Carriageway KM 25.8', status: 'active', uptime: '99.9%' },
    { id: 'FAC-005', name: 'Control Center 5', type: 'Facility', location: 'Central Hub', status: 'active', uptime: '99.5%' },
    { id: 'SS-018', name: 'PTZ Camera 18', type: 'SS', location: 'Junction B - Exit', status: 'active', uptime: '97.8%' },
    { id: 'VMS-022', name: 'VMS Display 22', type: 'VMS', location: 'Highway 3 - South', status: 'active', uptime: '98.9%' },
  ];

  const filteredDevices = activeTab === 'all' 
    ? allDevices 
    : allDevices.filter(device => device.type.toLowerCase() === activeTab);

  const columns = [
    { key: 'id', label: 'Device ID', sortable: true },
    { key: 'name', label: 'Device Name', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'location', label: 'Location', sortable: false },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <StatusBadge status={value as 'active' | 'wait' | 'offline'} />
      ),
    },
    { key: 'uptime', label: 'Uptime', sortable: true },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dark">Dashboard</h1>
        <p className="text-sm text-primary-text mt-1">
          Overview of traffic management system
        </p>
      </div>

      {/* Stats Grid with Weather Widget */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <p className="text-sm text-primary-text mb-1">{stat.title}</p>
                <p className="text-3xl font-semibold text-dark mb-2">{stat.value}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${
                      stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {stat.change}
                  </span>
                  <span className="text-xs text-primary-text">vs last month</span>
                </div>
              </div>
              <div className={`${stat.bgColor} ${stat.color} p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </Card>
        ))}
        
        {/* Weather Widget */}
        <div className="md:col-span-2 lg:col-span-1">
          <WeatherWidget />
        </div>
      </div>

      {/* Tabbed Resource Table */}
      <Card title="All Resources">
        {/* Search and Filter Bar */}
        <div className="mb-6">
          <Input type="search" placeholder="Search devices..." className="max-w-md" />
        </div>

        {/* Tabs */}
        <div className="border-b border-stroke mb-6">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-primary'
                    : 'text-primary-text hover:text-dark'
                }`}
              >
                {tab.label}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Table
          columns={columns}
          data={filteredDevices}
        />

        {/* Table Footer */}
        <div className="mt-6 pt-6 border-t border-stroke flex items-center justify-between">
          <p className="text-sm text-primary-text">
            Showing <span className="font-medium">{filteredDevices.length}</span> of{' '}
            <span className="font-medium">{allDevices.length}</span> devices
          </p>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;

