import React from "react";
import { X } from "lucide-react";

export default function FiltersDrawer({
  isOpen,
  onClose,
  filters,
  onApplyFilters,
}) {
  const [localFilters, setLocalFilters] = React.useState(filters);

  const regions = ["europe", "north america", "asia", "global"];
  const categories = ["regulations", "guidelines", "reports", "templates"];
  const availableTags = [
    "renewable",
    "solar",
    "wind",
    "hydro",
    "energy transition",
    "compliance",
    "safety",
  ];
  const years = Array.from({ length: 25 }, (_, i) => 2024 - i); // Creates array from 2024 to 2000

  const handleApply = () => {
    console.log("Applying filters:", localFilters);
    onApplyFilters(localFilters);
    onClose();
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 w-full sm:w-80 bg-harvey-bg-lighter border-l border-harvey-border transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } z-50 shadow-lg`}
    >
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-harvey-border flex justify-between items-center">
          <h2 className="text-harvey-text text-lg font-medium">Filters</h2>
          <button
            onClick={onClose}
            className="text-harvey-text-light hover:text-harvey-text"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Year Filter */}
          <div>
            <h3 className="text-harvey-text mb-2 font-medium">
              Publication Year
            </h3>
            <select
              value={localFilters.year || ""}
              onChange={(e) =>
                setLocalFilters((prev) => ({
                  ...prev,
                  year: e.target.value ? parseInt(e.target.value) : null,
                }))
              }
              className="w-full bg-harvey-bg border border-harvey-border rounded-lg py-2 px-3 text-harvey-text focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              <option value="">All Years</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          {/* Region Filter */}
          <div>
            <h3 className="text-harvey-text mb-2 font-medium">Region</h3>
            <div className="space-y-2">
              {regions.map((region) => (
                <label
                  key={region}
                  className="flex items-center text-harvey-text-light hover:text-harvey-text cursor-pointer"
                >
                  <input
                    type="radio"
                    name="region"
                    value={region}
                    checked={localFilters.region === region}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        region: e.target.value,
                      }))
                    }
                    className="mr-2"
                  />
                  {region.charAt(0).toUpperCase() + region.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <h3 className="text-harvey-text mb-2 font-medium">Category</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category}
                  className="flex items-center text-harvey-text-light hover:text-harvey-text cursor-pointer"
                >
                  <input
                    type="radio"
                    name="category"
                    value={category}
                    checked={localFilters.category === category}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="mr-2"
                  />
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </label>
              ))}
            </div>
          </div>

          {/* Tags Filter */}
          <div>
            <h3 className="text-harvey-text mb-2 font-medium">Tags</h3>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => {
                    setLocalFilters((prev) => ({
                      ...prev,
                      tags: prev.tags.includes(tag)
                        ? prev.tags.filter((t) => t !== tag)
                        : [...prev.tags, tag],
                    }));
                  }}
                  className={`px-3 py-1 rounded-full text-sm transition-colors ${
                    localFilters.tags.includes(tag)
                      ? "bg-gray-100 text-gray-700 border border-gray-300"
                      : "bg-harvey-bg text-harvey-text-light hover:text-harvey-text hover:bg-harvey-hover border border-transparent"
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-harvey-border">
          <div className="flex gap-3">
            <button
              onClick={() => {
                setLocalFilters({ region: null, category: null, tags: [] });
              }}
              className="flex-1 px-4 py-2 border border-harvey-border text-harvey-text-light hover:text-harvey-text rounded-lg transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleApply}
              className="flex-1 bg-gray-100 text-gray-700 border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
