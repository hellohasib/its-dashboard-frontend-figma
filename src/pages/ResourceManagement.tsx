import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { Plus, Download } from 'lucide-react';

const ResourceManagement = () => {
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const devices = [
    {
      id: 'VDS-001',
      name: 'VDS Camera 1',
      type: 'VDS',
      location: 'Main Carriageway KM 12.5',
      status: 'active',
      lastUpdate: '2024-11-17 10:30',
      uptime: '99.8%',
    },
    {
      id: 'SS-042',
      name: 'ANPR Camera 42',
      type: 'SS',
      location: 'Junction A - Entry',
      status: 'active',
      lastUpdate: '2024-11-17 10:28',
      uptime: '98.5%',
    },
    {
      id: 'VMS-015',
      name: 'VMS Display 15',
      type: 'VMS',
      location: 'Exit 12 - North',
      status: 'wait',
      lastUpdate: '2024-11-17 09:45',
      uptime: '95.2%',
    },
    {
      id: 'RTMS-003',
      name: 'RTMS Sensor 3',
      type: 'RTMS',
      location: 'Highway 5 - West',
      status: 'offline',
      lastUpdate: '2024-11-17 08:15',
      uptime: '87.3%',
    },
    {
      id: 'VDS-012',
      name: 'VDS Camera 12',
      type: 'VDS',
      location: 'Main Carriageway KM 25.8',
      status: 'active',
      lastUpdate: '2024-11-17 10:29',
      uptime: '99.9%',
    },
  ];

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
    { key: 'lastUpdate', label: 'Last Update', sortable: true },
    { key: 'uptime', label: 'Uptime', sortable: true },
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
          <h1 className="text-2xl font-semibold text-dark">Resource Management</h1>
          <p className="text-sm text-primary-text mt-1">
            Manage and monitor all traffic system devices
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary">
            <Plus className="w-4 h-4 mr-2" />
            Add Device
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <Input type="search" placeholder="Search devices..." className="flex-1" />
          <select className="px-4 py-2 border border-stroke rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">All Types</option>
            <option value="VDS">VDS</option>
            <option value="SS">SS</option>
            <option value="VMS">VMS</option>
            <option value="RTMS">RTMS</option>
            <option value="Facility">Facility</option>
          </select>
          <select className="px-4 py-2 border border-stroke rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="wait">Wait</option>
            <option value="offline">Offline</option>
          </select>
        </div>
      </Card>

      {/* Devices Table */}
      <Card>
        <Table
          columns={columns}
          data={devices}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-6 pt-6 border-t border-stroke">
          <p className="text-sm text-primary-text">
            Showing <span className="font-medium">1-5</span> of{' '}
            <span className="font-medium">42</span> devices
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

export default ResourceManagement;

