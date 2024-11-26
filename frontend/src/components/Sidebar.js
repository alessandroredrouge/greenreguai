import React from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Filter, 
  Settings, 
  Save,
  Clock,
  Tag,
  ChevronDown
} from 'lucide-react';

export default function Sidebar() {
  const [showFilters, setShowFilters] = React.useState(true);
  const [showSaved, setShowSaved] = React.useState(true);

  const filters = [
    { name: 'Regulations', active: true },
    { name: 'Compliance', active: false },
    { name: 'Analysis', active: false }
  ];

  const savedSnippets = [
    { 
      title: 'Solar Panel Regulations Query',
      timestamp: '2024-03-15 14:30',
      tags: ['solar', 'EU']
    }
    // Add more saved snippets as needed
  ];

  return (
    <div className="w-64 bg-eco-darker border-r border-eco-dark flex flex-col h-screen">
      {/* Recent Chats Section */}
      <div className="p-4">
        <h2 className="font-code text-eco-text text-sm mb-4 flex items-center">
          <Clock className="h-4 w-4 mr-2 text-eco-green" />
          Recent Chats
        </h2>
        <div className="space-y-2">
          {savedSnippets.map((snippet, index) => (
            <div 
              key={index}
              className="text-eco-gray hover:text-eco-text cursor-pointer text-sm p-2 rounded-lg hover:bg-eco-black/50 transition-colors"
            >
              <div className="font-code truncate">{snippet.title}</div>
              <div className="text-xs text-eco-gray mt-1">{snippet.timestamp}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Filters Section */}
      <div className="p-4 border-t border-eco-dark">
        <button 
          className="w-full flex items-center justify-between font-code text-eco-text text-sm mb-4"
          onClick={() => setShowFilters(!showFilters)}
        >
          <div className="flex items-center">
            <Filter className="h-4 w-4 mr-2 text-eco-green" />
            Quick Filters
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
        </button>
        
        {showFilters && (
          <div className="space-y-2">
            {filters.map((filter, index) => (
              <button
                key={index}
                className={`w-full text-left p-2 rounded-lg text-sm transition-colors ${
                  filter.active 
                    ? 'bg-eco-green/10 text-eco-green border border-eco-green'
                    : 'text-eco-gray hover:text-eco-text hover:bg-eco-black/50'
                }`}
              >
                {filter.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Saved Snippets Section */}
      <div className="p-4 border-t border-eco-dark">
        <button 
          className="w-full flex items-center justify-between font-code text-eco-text text-sm mb-4"
          onClick={() => setShowSaved(!showSaved)}
        >
          <div className="flex items-center">
            <Save className="h-4 w-4 mr-2 text-eco-green" />
            Saved Snippets
          </div>
          <ChevronDown className={`h-4 w-4 transition-transform ${showSaved ? 'rotate-180' : ''}`} />
        </button>
        
        {showSaved && savedSnippets.map((snippet, index) => (
          <div 
            key={index}
            className="mb-3 p-2 rounded-lg hover:bg-eco-black/50 cursor-pointer group"
          >
            <div className="text-sm text-eco-gray group-hover:text-eco-text truncate">
              {snippet.title}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {snippet.tags.map((tag, tagIndex) => (
                <span 
                  key={tagIndex}
                  className="text-xs px-2 py-1 rounded-full bg-eco-green/10 text-eco-green"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Settings Section */}
      <div className="mt-auto p-4 border-t border-eco-dark">
        <Link 
          to="/settings"
          className="flex items-center text-eco-gray hover:text-eco-text transition-colors"
        >
          <Settings className="h-4 w-4 mr-2" />
          <span className="font-code text-sm">Settings</span>
        </Link>
      </div>
    </div>
  );
}