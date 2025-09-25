import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setRole } from '../store/slices/pollSlice.js';

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleContinue = () => {
    if (!selectedRole) return;
    dispatch(setRole(selectedRole));
    navigate(selectedRole === 'student' ? '/student' : '/teacher');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2">Welcome to the Live Polling System</h1>
      <p className="text-gray-600 mb-8">Please select the role that best describes you to begin using the live polling system</p>

      <div className="flex gap-6 mb-8">
        <div
          onClick={() => setSelectedRole('student')}
          className={`p-6 border-2 rounded-lg cursor-pointer w-64 transition-all ${
            selectedRole === 'student' ? 'border-primary-7765DA bg-primary-7765DA/10' : 'border-gray-300'
          }`}
        >
          <h3 className="font-bold mb-2">I'm a Student</h3>
          <p className="text-sm text-gray-600">Lorem Ipsum is simply dummy text of the printing and typesetting industry</p>
        </div>
        <div
          onClick={() => setSelectedRole('teacher')}
          className={`p-6 border-2 rounded-lg cursor-pointer w-64 transition-all ${
            selectedRole === 'teacher' ? 'border-primary-7765DA bg-primary-7765DA/10' : 'border-gray-300'
          }`}
        >
          <h3 className="font-bold mb-2">I'm a Teacher</h3>
          <p className="text-sm text-gray-600">Submit answers and view live poll results in real-time.</p>
        </div>
      </div>

      <button
        onClick={handleContinue}
        disabled={!selectedRole}
        className={`px-8 py-2 rounded-full font-medium transition ${
          selectedRole
            ? 'bg-primary-7765DA text-white hover:bg-primary-5767D0'
            : 'bg-gray-300 text-gray-600 cursor-not-allowed'
        }`}
      >
        Continue
      </button>
    </div>
  );
}