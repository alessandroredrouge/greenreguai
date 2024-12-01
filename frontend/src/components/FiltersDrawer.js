import React from 'react';
import { X } from 'lucide-react';

export default function FiltersDrawer({ isOpen, onClose, filters, onApplyFilters }) {
  const [localFilters, setLocalFilters] = React.useState(filters);

  const regions = ['europe', 'north america', 'asia', 'global'];
  const categories = ['regulations', 'guidelines', 'reports', 'templates'];
  const availableTags = ['renewable', 'solar', 'wind', 'hydro', 'energy transition', 'compliance', 'safety'];
  const years = Array.from({length: 25}, (_, i) => 2024 - i); // Creates array from 2024 to 2000

  const handleApply = () => {
    console.log('Applying filters:', localFilters);
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-eco-darker border-l border-eco-dark transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} z-50`}>
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-eco-dark flex justify-between items-center">
          <h2 className="text-eco-text font-code text-lg">Filters</h2>
          <button onClick={onClose} className="text-eco-gray hover:text-eco-text">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Year Filter */}
          <div>
            <h3 className="text-eco-text font-code mb-2">Publication Year</h3>
            <select
              value={localFilters.year || ''}
              onChange={(e) => setLocalFilters(prev => ({
                ...prev,
                year: e.target.value ? parseInt(e.target.value) : null
              }))}
              className="w-full bg-eco-black border border-eco-dark rounded-lg py-2 px-3 text-eco-text focus:outline-none focus:ring-2 focus:ring-eco-green"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <h3 className="text-eco-text font-code mb-2">Region</h3>
            <div className="space-y-2">
              {regions.map((region) => (
                <label key={region} className="flex items-center text-eco-gray hover:text-eco-text cursor-pointer">
                  <input
                    type="radio"
                    name="region"
                    value={region}
                    checked={localFilters.region === region}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, region: e.target.value }))}
                    className="mr-2"
                  />
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-eco-text font-code mb-2">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label key={category} className="flex items-center text-eco-gray hover:text-eco-text cursor-pointer">
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={localFilters.category === category}
                    onChange={(e) => setLocalFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="mr-2"
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-eco-text font-code mb-2">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setLocalFilters(prev => ({
                      ...prev,
                      tags: prev.tags.includes(tag)
                        ? prev.tags.filter(t => t !== tag)
                        : [...prev.tags, tag]
                    }));
                  }}
                  className={`px-3 py-1 rounded-full font-code text-sm transition-colors ${
                    localFilters.tags.includes(tag)
                      ? 'bg-eco-green/20 text-eco-green border border-eco-green'
                      : 'bg-eco-dark/50 text-eco-gray hover:text-eco-text hover:bg-eco-dark border border-transparent'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-eco-dark">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setLocalFilters({ region: null, category: null, tags: [] });
              }}
              className="flex-1 px-4 py-2 border border-eco-dark text-eco-gray hover:text-eco-text rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-eco-green/10 text-eco-green border border-eco-green px-4 py-2 rounded-lg hover:bg-eco-green/20 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}