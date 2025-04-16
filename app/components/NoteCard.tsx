'use client';

import Link from 'next/link';
import { Note } from '../store/noteSlice'; 

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
}

const NoteCard = ({ note, onDelete }: NoteCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  return (
    <div className="bg-white shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-semibold mb-2">{note.title}</h3>
        <span className="text-xs text-gray-500">
          {note.updatedAt ? formatDate(note.updatedAt) : 'No date available'}
        </span>
      </div>
      <p className="text-gray-700 mb-4 line-clamp-3">{note.content}</p>
      <div className="flex justify-between">
        <Link 
          href={`/notes/${note._id}`} 
          className="text-blue-600 hover:text-blue-800"
        >
          View & Edit
        </Link>
        <button
          onClick={() => onDelete(note._id)} 
          className="text-red-600 hover:text-red-800"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
export default NoteCard;
