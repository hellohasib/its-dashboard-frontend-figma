import { useState } from 'react';
import { Check } from 'lucide-react';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MegaMenu = ({ isOpen, onClose }: MegaMenuProps) => {
  const [selectedFacility, setSelectedFacility] = useState('VDS');
  const [selectedCategory, setSelectedCategory] = useState('Main Carriageway');

  const facilities = [
    { id: 'VDS', label: 'VDS' },
    { id: 'SS', label: 'SS' },
    { id: 'VMS', label: 'VMS' },
    { id: 'Facility', label: 'Facility' },
    { id: 'RTMS', label: 'RTMS' },
  ];

  const categories: Record<string, string[]> = {
    VDS: ['Main Carriageway', 'SMVT', 'Motion Detection Camera'],
    SS: ['ANPR', 'VSDS', 'PTZ', 'Motion Detection Camera'],
    VMS: ['VMS Display', 'PTZ', 'Motion Detection Camera'],
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-10 z-40"
        onClick={onClose}
      />

      {/* Menu */}
      <div className="absolute top-full left-0 mt-2 bg-white rounded-2xl border border-stroke shadow-lg z-50 p-6 min-w-[400px]">
        <div className="flex gap-6">
          {/* Left: Facility Selection */}
          <div className="flex flex-col gap-2">
            <h3 className="text-sm font-medium text-primary-text mb-2">
              Sasec 2 ITS Facility Menu
            </h3>
            {facilities.map((facility) => (
              <button
                key={facility.id}
                onClick={() => setSelectedFacility(facility.id)}
                className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                  selectedFacility === facility.id
                    ? 'text-primary bg-blue-50'
                    : 'text-dark hover:bg-gray-50'
                }`}
              >
                {facility.label}
                {selectedFacility === facility.id && (
                  <Check className="w-4 h-4" />
                )}
              </button>
            ))}
          </div>

          {/* Right: Category Selection */}
          <div className="bg-gray rounded-2xl p-4 min-w-[200px]">
            <h3 className="text-lg font-semibold text-dark mb-3">
              All {selectedFacility} Cameras
            </h3>
            <div className="flex flex-col gap-2">
              {categories[selectedFacility]?.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`text-sm px-3 py-1.5 rounded text-left transition-colors ${
                    selectedCategory === category
                      ? 'text-primary font-medium'
                      : 'text-dark hover:bg-gray-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MegaMenu;

