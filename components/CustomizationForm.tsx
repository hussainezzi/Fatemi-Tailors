
import React from 'react';
import { CustomizationOptions, CollarDesign } from '../types';
import { FITS, COLORS, FABRICS, COLLAR_DESIGNS } from '../constants';

interface CustomizationFormProps {
  options: CustomizationOptions;
  setOptions: React.Dispatch<React.SetStateAction<CustomizationOptions>>;
  onSubmit: () => void;
  isLoading: boolean;
  isImageUploaded: boolean;
}

const CustomizationForm: React.FC<CustomizationFormProps> = ({ options, setOptions, onSubmit, isLoading, isImageUploaded }) => {
  const handleOptionChange = <K extends keyof CustomizationOptions,>(
    key: K,
    value: CustomizationOptions[K]
  ) => {
    setOptions(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Customize Your Saya-Kurta</h2>
      
      {/* Fit Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Fit</label>
        <div className="grid grid-cols-3 gap-2">
          {FITS.map(fit => (
            <button
              key={fit}
              onClick={() => handleOptionChange('fit', fit)}
              className={`px-4 py-2 text-sm rounded-md transition-all ${
                options.fit === fit
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
              }`}
            >
              {fit}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
        <div className="flex flex-wrap gap-3">
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => handleOptionChange('color', color)}
              className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 ${
                options.color === color ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' : 'border-gray-200'
              }`}
              style={{ backgroundColor: color.replace(' ', '').toLowerCase() }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Fabric Selector */}
       <div>
        <label htmlFor="fabric-select" className="block text-sm font-medium text-gray-700">Fabric</label>
        <select
          id="fabric-select"
          value={options.fabric}
          onChange={(e) => handleOptionChange('fabric', e.target.value)}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md shadow-sm"
        >
          {FABRICS.map(fabric => <option key={fabric}>{fabric}</option>)}
        </select>
      </div>

      {/* Collar Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Collar Design</label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {COLLAR_DESIGNS.map(collar => (
            <div
              key={collar.name}
              onClick={() => handleOptionChange('collar', collar)}
              className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                options.collar.name === collar.name ? 'border-blue-600 ring-2 ring-blue-600 ring-offset-2' : 'border-gray-200'
              }`}
            >
              <img src={collar.imageUrl} alt={collar.name} className="w-full h-16 object-cover" />
              <p className="text-center text-xs py-1 bg-white">{collar.name}</p>
            </div>
          ))}
        </div>
      </div>
      
      <button
        onClick={onSubmit}
        disabled={isLoading || !isImageUploaded}
        className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:bg-blue-700 transition-all transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
      >
        {isLoading ? 'Generating...' : 'Virtually Try On'}
      </button>
      {!isImageUploaded && <p className="text-center text-sm text-red-600">Please upload a photo to begin.</p>}
    </div>
  );
};

export default CustomizationForm;
