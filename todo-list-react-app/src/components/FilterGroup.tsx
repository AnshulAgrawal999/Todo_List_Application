

// components/FilterGroup.jsx
const FilterGroup = ({ title, options, selectedValues, onChange }) => {
  return (
    <div className="filter-group mb-6">
      <h4 className="text-sm font-medium mb-2">{title}</h4>
      <div className="filter-options space-y-2">
        {options.map(option => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              value={option}
              checked={selectedValues.includes(option)}
              onChange={() => onChange(option)}
              className="rounded"
            />
            <span className="capitalize">{option}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default FilterGroup;
