'use client';

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { getNotes, createNote, deleteNote, resetState } from '../store/noteSlice';
import Header from '../components/Header';
import NoteCard from '../components/NoteCard';
import ProtectedRoute from '../components/ProtectedRoute';

export default function NotesClient() {
  const dispatch = useDispatch<AppDispatch>();
  const { notes, isLoading, isError, message } = useSelector((state: RootState) => state.notes);

  const [newNote, setNewNote] = useState({ title: '', content: '' });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    dispatch(getNotes());
    return () => {
      dispatch(resetState());
    };
  }, [dispatch]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setNewNote((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newNote.title || !newNote.content) return alert('Please fill in all fields');
    dispatch(createNote(newNote));
    setNewNote({ title: '', content: '' });
    setShowForm(false);
  };

  const onDelete = (id: string) => {
    if (window.confirm('Delete this note?')) {
      dispatch(deleteNote(id));
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        <Header/>
        <main className="container mx-auto py-10 px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">My Notes</h1>
            <button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
            >
              {showForm ? 'Cancel' : 'Add New Note'}
            </button>
          </div>

          {isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {showForm && (
            <div className="bg-white p-6 rounded-lg shadow-md mb-6 border border-gray-200">
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label htmlFor="title" className="block text-gray-700 font-medium mb-2">Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={newNote.title}
                    onChange={onChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="content" className="block text-gray-700 font-medium mb-2">Content</label>
                  <textarea
                    id="content"
                    name="content"
                    value={newNote.content}
                    onChange={onChange}
                    rows={5}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors">
                  Save Note
                </button>
              </form>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-10 text-xl text-gray-600">Loading notes...</div>
          ) : notes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCard key={note._id} note={note} onDelete={onDelete} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">No notes yet. Start by creating one!</div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}