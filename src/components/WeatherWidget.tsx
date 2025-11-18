import { Cloud, CloudRain, Sun, Wind, Droplets, Eye } from 'lucide-react';
import Card from './Card';

interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  visibility: number;
  location: string;
}

const WeatherWidget = () => {
  // Static weather data - will be replaced with API call later
  const weather: WeatherData = {
    temperature: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    windSpeed: 12,
    visibility: 10,
    location: 'Dhaka, Bangladesh',
  };

  const getWeatherIcon = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'sunny':
      case 'clear':
        return <Sun className="w-16 h-16 text-yellow-500" />;
      case 'rainy':
      case 'rain':
        return <CloudRain className="w-16 h-16 text-blue-500" />;
      case 'cloudy':
      case 'partly cloudy':
        return <Cloud className="w-16 h-16 text-gray-400" />;
      default:
        return <Cloud className="w-16 h-16 text-gray-400" />;
    }
  };

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
      <div className="space-y-4">
        {/* Location */}
        <div>
          <p className="text-xs text-primary-text">Current Weather</p>
          <p className="text-sm font-medium text-dark">{weather.location}</p>
        </div>

        {/* Main Weather Display */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1">
              <span className="text-5xl font-bold text-dark">{weather.temperature}</span>
              <span className="text-2xl text-primary-text">°C</span>
            </div>
            <p className="text-sm text-primary-text mt-2">{weather.condition}</p>
          </div>
          <div>{getWeatherIcon(weather.condition)}</div>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2">
            <Wind className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-primary-text">Wind</p>
              <p className="text-sm font-medium text-dark">{weather.windSpeed} km/h</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Droplets className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-primary-text">Humidity</p>
              <p className="text-sm font-medium text-dark">{weather.humidity}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-primary-text">Visibility</p>
              <p className="text-sm font-medium text-dark">{weather.visibility} km</p>
            </div>
          </div>
        </div>

        {/* Weather Alert (if any) */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
          <p className="text-xs text-yellow-800">
            ⚠️ <span className="font-medium">Traffic Advisory:</span> Light rain expected in the evening. Drive carefully.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default WeatherWidget;

