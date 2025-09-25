// frontend/src/pages/StudentDashboard.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { submitAnswer, addChatMessage, setKickedOut, setIsResultsVisible, updateResults, setCurrentQuestion, setTimeLeft, setParticipants } from '../store/slices/pollSlice.js';
import socket from '../utils/socket.js';

export default function StudentDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentName, currentQuestion, isPollActive, timeLeft, isResultsVisible, results, chatMessages, participants } = useSelector(state => state.poll);

  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    // Listen for new questions and results from the server
    socket.on('newQuestion', (data) => {
      console.log('StudentDashboard: Received newQuestion event:', data);
      dispatch(setCurrentQuestion(data));
      setSelectedAnswer('');
      dispatch(setIsResultsVisible(false));
    });

    socket.on('timeUpdate', (time) => {
      console.log('StudentDashboard: Received timeUpdate event:', time);
      dispatch(setTimeLeft(time));
    });

    socket.on('showResults', (res) => {
      console.log('StudentDashboard: Received showResults event:', res);
      dispatch(updateResults(res));
      dispatch(setIsResultsVisible(true));
    });

    socket.on('kickedOut', () => {
      console.log('StudentDashboard: Received kickedOut event');
      dispatch(setKickedOut(true));
      navigate('/kicked-out');
    });

    socket.on('chatMessage', (msg) => {
      console.log('StudentDashboard: Received chatMessage event:', msg);
      dispatch(addChatMessage(msg));
    });

    socket.on('updateParticipants', (updatedParticipants) => {
      console.log('StudentDashboard: Received updateParticipants event:', updatedParticipants);
      dispatch(setParticipants(updatedParticipants));
    });

    return () => {
      socket.off('newQuestion');
      socket.off('timeUpdate');
      socket.off('showResults');
      socket.off('kickedOut');
      socket.off('chatMessage');
      socket.off('updateParticipants');
    };
  }, [dispatch, navigate]);

  if (isResultsVisible) {
    return <ResultsView />;
  }

  if (!currentQuestion) {
    return <StudentWaiting />;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Question 1</h2>
        <div className="flex items-center mb-2">
          <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 11-2 0 1 1 0 012 0zm0 4a1 1 0 11-2 0 1 1 0 012 0zm0 4a1 1 0 11-2 0 1 1 0 012 0z" clipRule="evenodd" />
          </svg>
          <span className={`text-lg ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
            {String(Math.floor(timeLeft / 60)).padStart(2, '0')}:{String(timeLeft % 60).padStart(2, '0')}
          </span>
        </div>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
        <div className="bg-bg-dark text-white p-3 rounded-t-lg mb-4">
          <p className="text-lg">{currentQuestion.question}</p>
        </div>

        <div className="space-y-3">
          {currentQuestion.options.map((option, index) => (
            <div
              key={index}
              onClick={() => setSelectedAnswer(option)}
              className={`p-3 border rounded-lg cursor-pointer transition ${
                selectedAnswer === option
                  ? 'bg-primary-7765DA text-white border-primary-7765DA'
                  : 'bg-gray-100 border-gray-300 hover:bg-gray-200'
              }`}
            >
              <span className="inline-block w-6 h-6 bg-primary-7765DA text-white rounded-full text-center mr-2">
                {index + 1}
              </span>
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => {
            if (!selectedAnswer) return;
            socket.emit('submitAnswer', { answer: selectedAnswer, studentId: socket.id });
          }}
          disabled={!selectedAnswer}
          className={`px-6 py-2 rounded-full font-medium transition ${
            selectedAnswer
              ? 'bg-primary-7765DA text-white hover:bg-primary-5767D0'
              : 'bg-gray-300 text-gray-600 cursor-not-allowed'
          }`}
        >
          Submit
        </button>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => document.getElementById('chatModal').classList.remove('hidden')}
          className="w-12 h-12 bg-primary-7765DA text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-5767D0"
        >
          💬
        </button>
      </div>

      {/* Chat Modal */}
      <div id="chatModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 border-b pb-2">
              <button
                onClick={() => {
                  document.getElementById('chatTab').classList.add('hidden');
                  document.getElementById('participantsTab').classList.remove('hidden');
                }}
                className="font-medium text-gray-500"
              >
                Participants
              </button>
              <button
                onClick={() => {
                  document.getElementById('chatTab').classList.remove('hidden');
                  document.getElementById('participantsTab').classList.add('hidden');
                }}
                className="font-medium text-primary-7765DA"
              >
                Chat
              </button>
            </div>
            <button onClick={() => document.getElementById('chatModal').classList.add('hidden')} className="text-gray-500">×</button>
          </div>

          {/* Participants Tab */}
          <div id="participantsTab" className="hidden">
            <div className="space-y-2">
              {participants.map((p) => (
                <div key={p.id} className="flex justify-between items-center">
                  <span>{p.name}</span>
                  {/* Students cannot kick out, so hide this button for students */}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Tab */}
          <div id="chatTab" className="">
            <div className="space-y-3 mb-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-2 rounded-lg max-w-[80%] ${msg.senderId === socket.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                  <strong>{msg.senderName || 'Anonymous'}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.message;
                if (input.value.trim()) {
                  socket.emit('chatMessage', { text: input.value, senderName: studentName });
                  // Add the message to the local state immediately for a better UX
                  dispatch(addChatMessage({
                    text: input.value,
                    senderName: studentName,
                    senderId: socket.id
                  }));
                  input.value = '';
                }
              }}
              className="flex gap-2"
            >
              <input
                name="message"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-7765DA"
              />
              <button type="submit" className="px-3 py-2 bg-primary-7765DA text-white rounded-lg hover:bg-primary-5767D0">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultsView() {
  const { results, currentQuestion, participants, chatMessages } = useSelector(state => state.poll);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">Question 1</h2>
      </div>

      <div className="bg-white border border-gray-300 rounded-lg p-4 mb-6">
        <div className="bg-bg-dark text-white p-3 rounded-t-lg mb-4">
          <p className="text-lg">{currentQuestion.question}</p>
        </div>

        <div className="space-y-3">
          {results.map((result, index) => {
            const totalVotes = results.reduce((sum, r) => sum + r.count, 0);
            const percentage = totalVotes > 0 ? Math.round((result.count / totalVotes) * 100) : 0;

            return (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-primary-7765DA text-white rounded-full flex items-center justify-center text-xs">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="bg-gray-200 rounded-full h-8">
                    <div
                      className="bg-primary-7765DA h-8 rounded-full flex items-center justify-center text-white"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage}%
                    </div>
                  </div>
                </div>
                <span className="font-medium">{result.option}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Button */}
      <div className="fixed bottom-6 right-6">
        <button
          onClick={() => document.getElementById('chatModal').classList.remove('hidden')}
          className="w-12 h-12 bg-primary-7765DA text-white rounded-full flex items-center justify-center shadow-lg hover:bg-primary-5767D0"
        >
          💬
        </button>
      </div>

      {/* Chat Modal - Same as above */}
      <div id="chatModal" className="hidden fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4 border-b pb-2">
              <button
                onClick={() => {
                  document.getElementById('chatTab').classList.add('hidden');
                  document.getElementById('participantsTab').classList.remove('hidden');
                }}
                className="font-medium text-gray-500"
              >
                Participants
              </button>
              <button
                onClick={() => {
                  document.getElementById('chatTab').classList.remove('hidden');
                  document.getElementById('participantsTab').classList.add('hidden');
                }}
                className="font-medium text-primary-7765DA"
              >
                Chat
              </button>
            </div>
            <button onClick={() => document.getElementById('chatModal').classList.add('hidden')} className="text-gray-500">×</button>
          </div>

          {/* Participants Tab */}
          <div id="participantsTab" className="hidden">
            <div className="space-y-2">
              {participants.map((p) => (
                <div key={p.id} className="flex justify-between items-center">
                  <span>{p.name}</span>
                  {/* Students cannot kick out, so hide this button for students */}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Tab */}
          <div id="chatTab" className="">
            <div className="space-y-3 mb-4">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className={`p-2 rounded-lg max-w-[80%] ${msg.senderId === socket.id ? 'bg-blue-100 ml-auto' : 'bg-gray-100'}`}>
                  <strong>{msg.senderName || 'Anonymous'}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.message;
                if (input.value.trim()) {
                  socket.emit('chatMessage', { text: input.value, senderName: studentName });
                  // Add the message to the local state immediately for a better UX
                  dispatch(addChatMessage({
                    text: input.value,
                    senderName: studentName,
                    senderId: socket.id
                  }));
                  input.value = '';
                }
              }}
              className="flex gap-2"
            >
              <input
                name="message"
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-7765DA"
              />
              <button type="submit" className="px-3 py-2 bg-primary-7765DA text-white rounded-lg hover:bg-primary-5767D0">
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}