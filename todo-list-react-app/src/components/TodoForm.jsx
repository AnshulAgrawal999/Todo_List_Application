

// components/forms/TodoForm.jsx
const TodoForm = ({ todo, onChange, isEdit = false }) => {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Title"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={todo.title}
        onChange={(e) => onChange({...todo, title: e.target.value})}
      />
      <textarea
        placeholder="Description"
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        rows={3}
        value={todo.description || ''}
        onChange={(e) => onChange({...todo, description: e.target.value})}
      />
      <select
        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={todo.priority}
        onChange={(e) => onChange({...todo, priority: e.target.value})}
      >
        <option value="low">Low Priority</option>
        <option value="medium">Medium Priority</option>
        <option value="high">High Priority</option>
      </select>
      {!isEdit && (
        <>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onChange({...todo, tags: e.target.value.split(',').map(t => t.trim()).filter(t => t)})}
          />
          <input
            type="text"
            placeholder="Assigned Users (comma separated, e.g., @john_doe)"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => onChange({...todo, assignedUsers: e.target.value.split(',').map(u => u.trim()).filter(u => u)})}
          />
        </>
      )}
    </div>
  );
};

export default TodoForm;