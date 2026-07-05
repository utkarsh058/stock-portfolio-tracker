import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';

function Notes() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  const authHeader = { headers: { Authorization: `Bearer ${token}` } };

  const fetchNotes = () => {
    axios.get('http://localhost:5000/api/notes', authHeader)
      .then((response) => {
        setNotes(response.data);
      })
      .catch((error) => {
        console.error('Error fetching notes:', error);
      });
  };

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchNotes();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('http://localhost:5000/api/notes', { title, content }, authHeader)
      .then(() => {
        fetchNotes();
        setTitle('');
        setContent('');
      })
      .catch((error) => {
        console.error('Error adding note:', error);
      });
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/notes/${id}`, authHeader)
      .then(() => {
        fetchNotes();
      })
      .catch((error) => {
        console.error('Error deleting note:', error);
      });
  };

  // Format date nicely, e.g. "Jul 4, 2026"
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold text-white">My Notes</h1>
      </div>

      {/* Add Note Form */}
      <div className="bg-gray-900 rounded-xl p-4 border border-gray-800 mb-6">
        <h2 className="text-lg font-semibold mb-3 text-white">Add Note</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
          />
          <textarea
            placeholder="Write your note here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
            rows={3}
            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white resize-none"
          />
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded-lg text-sm font-medium text-white"
          >
            Add Note
          </button>
        </form>
      </div>

      {/* Notes Grid */}
      {notes.length === 0 ? (
        <div className="bg-gray-900 rounded-xl p-6 border border-gray-800 text-center text-gray-500">
          No notes yet. Add one above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {notes.map((note) => (
            <div key={note._id} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-white">{note.title}</h3>
                <button
                  onClick={() => handleDelete(note._id)}
                  className="text-red-400 hover:text-red-300 text-xs"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-3">{note.content}</p>
              <p className="text-gray-600 text-xs">{formatDate(note.createdAt)}</p>
            </div>
          ))}
        </div>
      )}
    </Layout>
  );
}

export default Notes;