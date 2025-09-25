import { useNavigate } from 'react-router-dom';

export default function KickedOut() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>
      <h1 className="text-3xl font-bold mb-2">You've been Kicked out!</h1>
      <p className="text-gray-600 mb-6">
        Looks like the teacher had removed you from the poll system. Please try again sometime.
      </p>
      <button
        onClick={() => navigate('/')}
        className="px-6 py-2 bg-primary-7765DA text-white rounded-full hover:bg-primary-5767D0"
      >
        Go Back
      </button>
    </div>
  );
}