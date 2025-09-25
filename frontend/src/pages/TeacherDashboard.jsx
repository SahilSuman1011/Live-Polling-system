// frontend/src/pages/TeacherDashboard.jsx
import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { resetPoll, addParticipant, removeParticipant, setCurrentQuestion, setIsResultsVisible, updateResults, setTimeLeft, addChatMessage, setParticipants } from '../store/slices/pollSlice.js';
import socket from '../utils/socket.js';

export default function TeacherDashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentQuestion, isPollActive, timeLeft, isResultsVisible, participants, results, studentName, chatMessages } = useSelector(state => state.poll);

  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [timeLimit, setTimeLimit] = useState(60);

  useEffect(() => {
    socket.emit('joinAsTeacher');

    socket.on('updateParticipants', (updatedParticipants) => {
      console.log('TeacherDashboard: Received updateParticipants event:', updatedParticipants);
      dispatch(setParticipants(updatedParticipants));
    });

    socket.on('newQuestion', (data) => {
      console.log('TeacherDashboard: Received newQuestion event:', data);
      dispatch(setCurrentQuestion(data));
      dispatch(setIsResultsVisible(false));
    });

    socket.on('timeUpdate', (time) => {
      console.log('TeacherDashboard: Received timeUpdate event:', time);
      dispatch(setTimeLeft(time));
    });

    socket.on('showResults', (res) => {
      console.log('TeacherDashboard: Received showResults event:', res);
      dispatch(updateResults(res));
      dispatch(setIsResultsVisible(true));
    });

    socket.on('chatMessage', (msg) => {
      console.log('TeacherDashboard: Received chatMessage event:', msg);
      dispatch(addChatMessage(msg));
    });

    socket.on('pollReset', () => {
      console.log('TeacherDashboard: Received pollReset event');
      dispatch(resetPoll());
    });

    return () => {
      socket.off('updateParticipants');
      socket.off('newQuestion');
      socket.off('timeUpdate');
      socket.off('showResults');
      socket.off('chatMessage');
      socket.off('pollReset');
    };
  }, [dispatch, navigate]);

  const handleCreatePoll = () => {
    if (!question.trim() || options.filter(opt => opt.trim()).length < 2) return; // At least 2 options

    socket.emit('createPoll', {
      question: question.trim(),
      options: options.filter(opt => opt.trim()),
      timeLimit: parseInt(timeLimit),
    });

    setQuestion('');
    setOptions(['', '', '', '']);
  };

  const handleRemoveStudent = (studentId) => {
    socket.emit('removeStudent', studentId);
  };

  const handleResetPoll = () => {
    socket.emit('resetPoll');
  };

  return (
    <div className="p-6">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>

      {!isPollActive && !isResultsVisible && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Create New Poll</h2>
          <div className="mb-4">
            <label className="block mb-2">Question</label>
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-7765DA"
              placeholder="Which planet is known as the Red Planet?"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Options (at least 2)</label>
            {options.map((opt, idx) => (
              <input
                key={idx}
                type="text"
                value={opt}
                onChange={(e) => {
                  const newOptions = [...options];
                  newOptions[idx] = e.target.value;
                  setOptions(newOptions);
                }}
                className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-7765DA"
                placeholder={`Option ${idx + 1}`}
              />
            ))}
          </div>

          <div className="mb-4">
            <label className="block mb-2">Time Limit (seconds)</label>
            <select
              value={timeLimit}
              onChange={(e) => setTimeLimit(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-7765DA"
            >
              <option value="10">10 seconds</option>
              <option value="30">30 seconds</option>
              <option value="60">60 seconds</option>
              <option value="120">120 seconds</option>
              <option value="300">300 seconds</option>
            </select>
          </div>

          <button
            onClick={handleCreatePoll}
            disabled={!question.trim() || options.filter(opt => opt.trim()).length < 2}
            className={`px-6 py-2 rounded-full font-medium transition ${
              question.trim() && options.filter(opt => opt.trim()).length >= 2
                ? 'bg-primary-7765DA text-white hover:bg-primary-5767D0'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'
            }`}
          >
            Ask a New Question
          </button>
        </div>
      )}

      {isPollActive && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-2">Live Poll</h2>
          <div className="bg-bg-dark text-white p-4 rounded-lg mb-4">
            <p className="text-lg">{currentQuestion.question}</p>
          </div>
          <div className="flex justify-between items-center mb-4">
            <div className="text-lg font-semibold">
              Time Left: <span className="text-primary-7765DA">{timeLeft}s</span>
            </div>
            <button
              onClick={handleResetPoll}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Cancel Poll
            </button>
          </div>
        </div>
      )}

      {isResultsVisible && (
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Poll Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => {
              const totalVotes = results.reduce((sum, r) => sum + r.count, 0);
              const percentage = totalVotes > 0 ? Math.round((result.count / totalVotes) * 100) : 0;

              return (
                <div key={index} className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-primary-7765DA text-white rounded-full flex items-center justify-center">
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
          <button
            onClick={handleResetPoll}
            className="mt-4 px-6 py-2 bg-primary-7765DA text-white rounded-full hover:bg-primary-5767D0"
          >
            Start New Poll
          </button>
        </div>
      )}

      {/* Participants Panel */}
      <div className="bg-white rounded-lg p-4">
        <h3 className="font-bold mb-4">Participants</h3>
        <div className="space-y-2">
          {participants.map((p) => (
            <div key={p.id} className="flex justify-between items-center">
              <span>{p.name}</span>
              <button
                onClick={() => handleRemoveStudent(p.id)}
                className="text-blue-500 hover:text-blue-700 text-sm"
              >
                Kick out
              </button>
            </div>
          ))}
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
                  <button
                    onClick={() => handleRemoveStudent(p.id)}
                    className="text-blue-500 hover:text-blue-700 text-sm"
                  >
                    Kick out
                  </button>
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
                  socket.emit('chatMessage', { text: input.value, senderName: 'Teacher' });
                  // Add the message to the local state immediately for a better UX
                  dispatch(addChatMessage({
                    text: input.value,
                    senderName: 'Teacher',
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