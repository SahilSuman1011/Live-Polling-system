import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket.js';

export default function PollHistory() {
  const navigate = useNavigate();
  const { studentName } = useSelector(state => state.poll);

  const [pollHistory, setPollHistory] = useState([]);

  useEffect(() => {
    // Fetch poll history from backend
    socket.emit('getPollHistory');

    socket.on('pollHistory', (history) => {
      setPollHistory(history);
    });

    return () => {
      socket.off('pollHistory');
    };
  }, []);

  return (
    <div className="p-6">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>

      <h1 className="text-2xl font-bold mb-6">View Poll History</h1>

      <div className="space-y-6">
        {pollHistory.map((poll, index) => (
          <div key={poll.id} className="bg-white border border-gray-300 rounded-lg p-4">
            <h2 className="text-xl font-bold mb-2">Question {index + 1}</h2>
            <div className="bg-bg-dark text-white p-3 rounded-t-lg mb-4">
              <p className="text-lg">{poll.question}</p>
            </div>

            <div className="space-y-3">
              {poll.results.map((result, idx) => {
                const totalVotes = poll.results.reduce((sum, r) => sum + r.count, 0);
                const percentage = totalVotes > 0 ? Math.round((result.count / totalVotes) * 100) : 0;

                return (
                  <div key={idx} className="flex items-center space-x-4">
                    <div className="w-6 h-6 bg-primary-7765DA text-white rounded-full flex items-center justify-center text-xs">
                      {idx + 1}
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
        ))}
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

      {/* Chat Modal - Same as before */}
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
              {/* Participants will be rendered here */}
            </div>
          </div>

          {/* Chat Tab */}
          <div id="chatTab" className="">
            <div className="space-y-3 mb-4">
              {/* Messages will be rendered here */}
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const input = e.target.elements.message;
                if (input.value.trim()) {
                  socket.emit('chatMessage', { text: input.value, senderName: studentName });
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