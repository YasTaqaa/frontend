'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  getNoteById,
  updateNote,
  deleteNote,
  clearCurrentNote,
} from '../../store/noteSlice';
import Header from '../../components/Header';
import ProtectedRoute from '../../components/ProtectedRoute';

export default function NoteDetail() {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
  });

  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentNote, isLoading, isError, isSuccess, message } = useSelector(
    (state: RootState) => state.notes
  );

  // Fetch note saat component load
  useEffect(() => {
    if (id) {
      dispatch(getNoteById(id as string));
    }

    return () => {
      dispatch(clearCurrentNote());
    };
  }, [id, dispatch]);

  // Set form dengan data note
  useEffect(() => {
    if (currentNote) {
      setFormData({
        title: currentNote.title,
        content: currentNote.content,
      });
    }
  }, [currentNote]);

  // Redirect setelah update berhasil
  useEffect(() => {
    if (!isLoading && isSuccess && message === 'Note updated successfully') {
      router.push('/notes');
    }
  }, [isSuccess, isLoading, message, router]);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      return alert('Please add both a title and content');
    }

    const noteData = {
      _id: id as string,
      title: formData.title,
      content: formData.content,
    };

    dispatch(updateNote(noteData));
  };

  const onDelete = () => {
    if (window.confirm('Are you sure you want to delete this note?')) {
      dispatch(deleteNote(id as string));
      router.push('/notes');
    }
  };

  if (isLoading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-100">
          <Header />
          <main className="container mx-auto py-10 px-4">
            <div className="text-center py-10">
              <p className="text-xl">Loading note...</p>
            </div>
          </main>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="container mx-auto py-10 px-4">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/notes')}
              className="text-blue-600 hover:text-blue-800 mr-4"
            >
              ← Back to Notes
            </button>
            <h1 className="text-3xl font-bold">Edit Note</h1>
          </div>

          {isError && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
              {message}
            </div>
          )}

          {currentNote ? (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <form onSubmit={onSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="title"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Title
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={onChange}
                    placeholder="Enter note title"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-6">
                  <label
                    htmlFor="content"
                    className="block text-gray-700 font-medium mb-2"
                  >
                    Content
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={onChange}
                    placeholder="Enter note content"
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  ></textarea>
                </div>
                <div className="flex justify-between">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    onClick={onDelete}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete Note
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-lg text-gray-700">Note not found.</p>
              <button
                onClick={() => router.push('/notes')}
                className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Go Back to All Notes
              </button>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
