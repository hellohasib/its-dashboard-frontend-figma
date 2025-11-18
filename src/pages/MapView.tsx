import Card from '../components/Card';
import StatusBadge from '../components/StatusBadge';
import { MapPin } from 'lucide-react';

const MapView = () => {
  const devices = [
    { id: 'VDS-001', name: 'VDS Camera 1', type: 'VDS', status: 'active', lat: 23.8103, lng: 90.4125 },
    { id: 'SS-042', name: 'ANPR Camera 42', type: 'SS', status: 'active', lat: 23.7805, lng: 90.4258 },
    { id: 'VMS-015', name: 'VMS Display 15', type: 'VMS', status: 'wait', lat: 23.7925, lng: 90.4078 },
    { id: 'RTMS-003', name: 'RTMS Sensor 3', type: 'RTMS', status: 'offline', lat: 23.8203, lng: 90.3899 },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dark">Resource Map</h1>
        <p className="text-sm text-primary-text mt-1">
          Geographic view of all traffic management resources
        </p>
      </div>

      {/* Map and Device List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map Area */}
        <Card className="lg:col-span-2">
          <div className="h-[600px] bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <MapPin className="w-16 h-16 text-primary-text mx-auto mb-4" />
              <p className="text-lg font-medium text-dark mb-2">Map View</p>
              <p className="text-sm text-primary-text">
                Interactive map showing all device locations will be displayed here
              </p>
              <p className="text-xs text-primary-text mt-2">
                (Integration with mapping service required)
              </p>
            </div>
          </div>
        </Card>

        {/* Device List */}
        <Card title="Device Locations">
          <div className="space-y-3 max-h-[600px] overflow-y-auto">
            {devices.map((device) => (
              <div
                key={device.id}
                className="p-4 rounded-lg border border-stroke hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-sm font-medium text-dark">{device.name}</p>
                    <p className="text-xs text-primary-text mt-0.5">{device.id}</p>
                  </div>
                  <StatusBadge status={device.status as 'active' | 'wait' | 'offline'} />
                </div>
                <div className="flex items-center gap-1 text-xs text-primary-text">
                  <MapPin className="w-3 h-3" />
                  <span>
                    {device.lat.toFixed(4)}, {device.lng.toFixed(4)}
                  </span>
                </div>
                <div className="mt-2">
                  <span className="inline-flex px-2 py-0.5 bg-blue-50 text-primary text-xs font-medium rounded">
                    {device.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <p className="text-sm text-primary-text mb-1">Total Locations</p>
          <p className="text-2xl font-semibold text-dark">{devices.length}</p>
        </Card>
        <Card>
          <p className="text-sm text-primary-text mb-1">Active Devices</p>
          <p className="text-2xl font-semibold text-status-green-text">
            {devices.filter((d) => d.status === 'active').length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-primary-text mb-1">Pending</p>
          <p className="text-2xl font-semibold text-status-orange-text">
            {devices.filter((d) => d.status === 'wait').length}
          </p>
        </Card>
        <Card>
          <p className="text-sm text-primary-text mb-1">Offline</p>
          <p className="text-2xl font-semibold text-status-grey-text">
            {devices.filter((d) => d.status === 'offline').length}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default MapView;

