import { useState } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import Input from '../components/Input';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { Plus, Filter } from 'lucide-react';

const RoadEvents = () => {
  const [sortKey, setSortKey] = useState('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const events = [
    {
      id: 'EVT-001',
      type: 'Accident',
      location: 'Main Carriageway KM 15.2',
      severity: 'High',
      status: 'active',
      reportedAt: '2024-11-17 09:15',
      respondedBy: 'Unit-A3',
    },
    {
      id: 'EVT-002',
      type: 'Congestion',
      location: 'Junction B - North',
      severity: 'Medium',
      status: 'active',
      reportedAt: '2024-11-17 09:45',
      respondedBy: 'Unit-B1',
    },
    {
      id: 'EVT-003',
      type: 'Road Work',
      location: 'Exit 12 - West',
      severity: 'Low',
      status: 'wait',
      reportedAt: '2024-11-17 08:30',
      respondedBy: 'Unit-C2',
    },
    {
      id: 'EVT-004',
      type: 'Weather Alert',
      location: 'Highway 5 - All Sections',
      severity: 'Medium',
      status: 'active',
      reportedAt: '2024-11-17 07:00',
      respondedBy: 'Auto',
    },
  ];

  const columns = [
    { key: 'id', label: 'Event ID', sortable: true },
    { key: 'type', label: 'Type', sortable: true },
    { key: 'location', label: 'Location', sortable: false },
    {
      key: 'severity',
      label: 'Severity',
      sortable: true,
      render: (value: string) => {
        const colors: Record<string, string> = {
          High: 'bg-status-red-bg text-status-red-text',
          Medium: 'bg-status-orange-bg text-status-orange-text',
          Low: 'bg-status-grey-bg text-status-grey-text',
        };
        return (
          <span className={`px-2 py-1 rounded text-xs font-medium ${colors[value]}`}>
            {value}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <StatusBadge status={value as 'active' | 'wait' | 'offline'} />
      ),
    },
    { key: 'reportedAt', label: 'Reported At', sortable: true },
    { key: 'respondedBy', label: 'Responded By', sortable: false },
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
          <h1 className="text-2xl font-semibold text-dark">Road Event Management</h1>
          <p className="text-sm text-primary-text mt-1">
            Monitor and manage road events and incidents
          </p>
        </div>
        <Button variant="primary">
          <Plus className="w-4 h-4 mr-2" />
          Report Event
        </Button>
      </div>

      {/* Event Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-status-red-bg border-0">
          <div className="text-center">
            <p className="text-3xl font-bold text-status-red-text">3</p>
            <p className="text-sm text-dark mt-1">High Severity</p>
          </div>
        </Card>
        <Card className="bg-status-orange-bg border-0">
          <div className="text-center">
            <p className="text-3xl font-bold text-status-orange-text">8</p>
            <p className="text-sm text-dark mt-1">Medium Severity</p>
          </div>
        </Card>
        <Card className="bg-status-grey-bg border-0">
          <div className="text-center">
            <p className="text-3xl font-bold text-status-grey-text">12</p>
            <p className="text-sm text-dark mt-1">Low Severity</p>
          </div>
        </Card>
        <Card className="bg-status-green-bg border-0">
          <div className="text-center">
            <p className="text-3xl font-bold text-status-green-text">45</p>
            <p className="text-sm text-dark mt-1">Resolved Today</p>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <div className="flex items-center gap-4">
          <Input type="search" placeholder="Search events..." className="flex-1" />
          <select className="px-4 py-2 border border-stroke rounded-lg text-sm text-dark focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="">All Types</option>
            <option value="accident">Accident</option>
            <option value="congestion">Congestion</option>
            <option value="roadwork">Road Work</option>
            <option value="weather">Weather Alert</option>
          </select>
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            More Filters
          </Button>
        </div>
      </Card>

      {/* Events Table */}
      <Card>
        <Table
          columns={columns}
          data={events}
          onSort={handleSort}
          sortKey={sortKey}
          sortDirection={sortDirection}
        />
      </Card>
    </div>
  );
};

export default RoadEvents;

