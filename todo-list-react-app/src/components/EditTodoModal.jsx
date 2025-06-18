
import TodoForm from "./TodoForm";

// components/modals/EditTodoModal.jsx
const EditTodoModal = ({ isOpen, onClose, todo, onChange, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h2 className="text-xl font-bold mb-4">Edit Todo</h2>
        <TodoForm todo={todo} onChange={onChange} isEdit={true} />
        <div className="flex justify-end space-x-3 mt-6">
          <button
            className="px-4 py-2 text-gray-600 border rounded-lg hover:bg-gray-50 transition-colors"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            onClick={onSubmit}
          >
            Update Todo
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTodoModal;