import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setStudentName } from '../store/slices/pollSlice.js';

export default function StudentNameEntry() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = () => {
    if (!name.trim()) return;
    dispatch(setStudentName(name));
    navigate('/student-waiting'); // Redirect to waiting screen
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Let's Get Started</h1>
      <p className="text-gray-600 mb-6">
        If you're a student, you'll be able to <strong>submit your answers</strong>, participate in live polls, and see how your responses compare with your classmates
      </p>

      <div className="w-full max-w-md">
        <label className="block mb-2 font-medium">Enter your Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-7765DA"
          placeholder="Rahul Bajaj"
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={!name.trim()}
        className={`mt-6 px-8 py-2 rounded-full font-medium transition ${
          name.trim()
            ? 'bg-primary-7765DA text-white hover:bg-primary-5767D0'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}