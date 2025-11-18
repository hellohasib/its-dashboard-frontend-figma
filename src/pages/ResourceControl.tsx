import Card from '../components/Card';
import Button from '../components/Button';
import StatusBadge from '../components/StatusBadge';
import { Power, Settings, RefreshCw, AlertCircle } from 'lucide-react';

const ResourceControl = () => {
  const devices = [
    {
      id: 'VDS-001',
      name: 'VDS Camera 1',
      type: 'VDS',
      status: 'active',
      controls: ['Power', 'Reset', 'Configure'],
    },
    {
      id: 'VMS-015',
      name: 'VMS Display 15',
      type: 'VMS',
      status: 'active',
      controls: ['Power', 'Message', 'Brightness'],
    },
    {
      id: 'SS-042',
      name: 'ANPR Camera 42',
      type: 'SS',
      status: 'wait',
      controls: ['Power', 'Reset', 'Calibrate'],
    },
  ];

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dark">Resource Control</h1>
        <p className="text-sm text-primary-text mt-1">
          Control and configure traffic system devices
        </p>
      </div>

      {/* Control Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {devices.map((device) => (
          <Card key={device.id}>
            <div className="space-y-4">
              {/* Device Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-dark">{device.name}</h3>
                  <p className="text-sm text-primary-text">{device.id}</p>
                </div>
                <StatusBadge status={device.status as 'active' | 'wait' | 'offline'} />
              </div>

              {/* Device Type Badge */}
              <div className="inline-flex px-3 py-1 bg-blue-50 text-primary text-xs font-medium rounded-full">
                {device.type}
              </div>

              {/* Control Buttons */}
              <div className="space-y-2">
                <Button variant="primary" className="w-full justify-center flex items-center">
                  <Power className="w-4 h-4 mr-2" />
                  Power Control
                </Button>
                <Button variant="outline" className="w-full justify-center flex items-center">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset Device
                </Button>
                <Button variant="outline" className="w-full justify-center flex items-center">
                  <Settings className="w-4 h-4 mr-2" />
                  Configure
                </Button>
              </div>

              {/* Status Info */}
              <div className="pt-4 border-t border-stroke space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-primary-text">Last Action:</span>
                  <span className="text-dark">2 hours ago</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-primary-text">Response Time:</span>
                  <span className="text-dark">120ms</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alerts Section */}
      <Card title="Active Alerts">
        <div className="space-y-3">
          <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-orange-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">
                VMS-015 requires maintenance
              </p>
              <p className="text-xs text-primary-text mt-1">
                Display brightness sensor reporting unusual values
              </p>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-dark">
                SS-042 awaiting calibration
              </p>
              <p className="text-xs text-primary-text mt-1">
                Camera requires recalibration after recent adjustment
              </p>
            </div>
            <Button size="sm" variant="outline">
              View
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ResourceControl;

