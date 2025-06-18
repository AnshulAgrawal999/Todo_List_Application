
import FilterGroup from "./FilterGroup";

// components/Sidebar.jsx
const Sidebar = ({ filters, onFilterChange }) => {
  return (
    <aside className="app-sidebar w-64 bg-white shadow-sm border-r p-6">
      <div className="filter-section">
        <h3 className="text-lg font-semibold mb-4">Filters</h3>
        
        <FilterGroup 
          title="Priority"
          options={['high', 'medium', 'low']}
          selectedValues={filters.priorities}
          onChange={(value) => onFilterChange('priorities', value)}
        />

        <div className="filter-group">
          <h4 className="text-sm font-medium mb-2">Tags</h4>
          <div className="filter-options tags-filter">
            <div className="tag-placeholder text-sm text-gray-500">
              Tags will appear here based on your todos
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;