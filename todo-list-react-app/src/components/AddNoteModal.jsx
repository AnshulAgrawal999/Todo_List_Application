

// components/modals/AddNoteModal.jsx
const AddNoteModal = ({ isOpen, onClose, todoTitle, noteContent, onChange, onSubmit }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 max-w-90vw">
        <h2 className="text-xl font-bold mb-4">Add Note to: {todoTitle}</h2>
        <textarea
          placeholder="Enter your note..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          value={noteContent}
          onChange={(e) => onChange(e.target.value)}
        />
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
            disabled={!noteContent.trim()}
          >
            Add Note
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNoteModal ;