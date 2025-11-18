import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import { Calendar, Download, Search } from 'lucide-react';

const HistoryInquiry = () => {
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const historyRecords = [
    {
      id: 'LOG-001',
      deviceId: 'VDS-001',
      action: 'Status Update',
      user: 'System',
      timestamp: '2024-11-17 10:30:15',
      details: 'Device status changed to Active',
    },
    {
      id: 'LOG-002',
      deviceId: 'VMS-015',
      action: 'Configuration Change',
      user: 'admin@atms.com',
      timestamp: '2024-11-17 10:15:42',
      details: 'Message display updated',
    },
    {
      id: 'LOG-003',
      deviceId: 'SS-042',
      action: 'Maintenance',
      user: 'tech@atms.com',
      timestamp: '2024-11-17 09:45:20',
      details: 'Camera calibration completed',
    },
    {
      id: 'LOG-004',
      deviceId: 'RTMS-003',
      action: 'Alert',
      user: 'System',
      timestamp: '2024-11-17 09:30:08',
      details: 'Connection timeout detected',
    },
    {
      id: 'LOG-005',
      deviceId: 'VDS-012',
      action: 'Data Sync',
      user: 'System',
      timestamp: '2024-11-17 09:00:00',
      details: 'Hourly data synchronization',
    },
  ];

  const columns = [
    { key: 'id', label: 'Log ID', sortable: true },
    { key: 'deviceId', label: 'Device ID', sortable: true },
    { key: 'action', label: 'Action', sortable: true },
    { key: 'user', label: 'User', sortable: true },
    { key: 'timestamp', label: 'Timestamp', sortable: true },
    { key: 'details', label: 'Details', sortable: false },
  ];

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-dark">History Inquiry</h1>
          <p className="text-sm text-primary-text mt-1">
            Search and view historical system logs and activities
          </p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Search Filters */}
      <Card>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Input
              type="search"
              placeholder="Search by device ID..."
              icon={<Search className="w-4 h-4" />}
            />
            <Input
              type="date"
              placeholder="Start Date"
              icon={<Calendar className="w-4 h-4" />}
            />
            <Input
              type="date"
              placeholder="End Date"
              icon={<Calendar className="w-4 h-4" />}
            />
            <select className="px-4 py-2 border border-stroke rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary">
              <option value="">All Actions</option>
              <option value="status">Status Update</option>
              <option value="config">Configuration Change</option>
              <option value="maintenance">Maintenance</option>
              <option value="alert">Alert</option>
              <option value="sync">Data Sync</option>
            </select>
          </div>
          <div className="flex items-center justify-end gap-3">
            <Button variant="outline">Clear Filters</Button>
            <Button variant="primary">Search</Button>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-primary-text mb-1">Total Logs</p>
          <p className="text-2xl font-semibold text-dark">1,234</p>
        </Card>
        <Card>
          <p className="text-sm text-primary-text mb-1">Today's Activity</p>
          <p className="text-2xl font-semibold text-dark">156</p>
        </Card>
        <Card>
          <p className="text-sm text-primary-text mb-1">System Alerts</p>
          <p className="text-2xl font-semibold text-dark">23</p>
        </Card>
        <Card>
          <p className="text-sm text-primary-text mb-1">User Actions</p>
          <p className="text-2xl font-semibold text-dark">89</p>
        </Card>
      </div>

      {/* History Table */}
      <Card>
        <Table
          columns={columns}
          data={historyRecords}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />

        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-stroke">
          <p className="text-sm text-primary-text">
            Showing <span className="font-medium">1-5</span> of{' '}
            <span className="font-medium">1,234</span> logs
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              Previous
            </Button>
            <Button variant="primary" size="sm">
              1
            </Button>
            <Button variant="outline" size="sm">
              2
            </Button>
            <Button variant="outline" size="sm">
              3
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default HistoryInquiry;

