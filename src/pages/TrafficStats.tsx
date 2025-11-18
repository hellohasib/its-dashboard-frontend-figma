import Card from '../components/Card';
import { TrendingUp, TrendingDown, Activity, Users } from 'lucide-react';

const TrafficStats = () => {
  const stats = [
    {
      title: 'Average Traffic Flow',
      value: '1,245',
      unit: 'vehicles/hour',
      change: '+12.5%',
      trend: 'up',
      icon: <Activity className="w-6 h-6" />,
    },
    {
      title: 'Peak Hour Volume',
      value: '2,856',
      unit: 'vehicles/hour',
      change: '+8.2%',
      trend: 'up',
      icon: <TrendingUp className="w-6 h-6" />,
    },
    {
      title: 'Incident Rate',
      value: '0.23',
      unit: 'per 1000 vehicles',
      change: '-15.4%',
      trend: 'down',
      icon: <TrendingDown className="w-6 h-6" />,
    },
    {
      title: 'Daily Vehicles',
      value: '45,678',
      unit: 'total count',
      change: '+5.7%',
      trend: 'up',
      icon: <Users className="w-6 h-6" />,
    },
  ];

  const hourlyData = [
    { hour: '00:00', volume: 234 },
    { hour: '03:00', volume: 156 },
    { hour: '06:00', volume: 789 },
    { hour: '09:00', volume: 2145 },
    { hour: '12:00', volume: 1876 },
    { hour: '15:00', volume: 2234 },
    { hour: '18:00', volume: 2856 },
    { hour: '21:00', volume: 1234 },
  ];

  const maxVolume = Math.max(...hourlyData.map((d) => d.volume));

  return (
    <div className="p-8 space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-dark">Traffic Statistics</h1>
        <p className="text-sm text-primary-text mt-1">
          Analyze traffic patterns and trends
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-primary-text mb-1">{stat.title}</p>
                <p className="text-3xl font-semibold text-dark">{stat.value}</p>
                <p className="text-xs text-primary-text mt-1">{stat.unit}</p>
              </div>
              <div className="bg-blue-50 text-primary p-3 rounded-lg">
                {stat.icon}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs font-medium ${
                  stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-primary-text">vs last period</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Hourly Traffic Volume Chart */}
      <Card title="Hourly Traffic Volume">
        <div className="space-y-4">
          {hourlyData.map((data, index) => (
            <div key={index} className="flex items-center gap-4">
              <span className="text-sm text-primary-text w-16">{data.hour}</span>
              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className="bg-primary h-full flex items-center justify-end pr-3 transition-all duration-500"
                  style={{ width: `${(data.volume / maxVolume) * 100}%` }}
                >
                  <span className="text-xs text-white font-medium">
                    {data.volume}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Top Congestion Points">
          <div className="space-y-3">
            {[
              { location: 'Junction A - Entry', count: '234 incidents' },
              { location: 'Main Carriageway KM 15', count: '189 incidents' },
              { location: 'Exit 12 - North', count: '156 incidents' },
              { location: 'Highway 5 - West', count: '134 incidents' },
            ].map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-dark">{item.location}</span>
                <span className="text-sm font-medium text-primary-text">
                  {item.count}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Vehicle Type Distribution">
          <div className="space-y-3">
            {[
              { type: 'Passenger Cars', percentage: 65, color: 'bg-blue-500' },
              { type: 'Light Trucks', percentage: 20, color: 'bg-green-500' },
              { type: 'Heavy Trucks', percentage: 10, color: 'bg-orange-500' },
              { type: 'Buses', percentage: 5, color: 'bg-purple-500' },
            ].map((item, index) => (
              <div key={index} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-dark">{item.type}</span>
                  <span className="font-medium text-primary-text">
                    {item.percentage}%
                  </span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TrafficStats;

