// frontend/src/pages/StudentWaiting.jsx
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setKickedOut, setIsResultsVisible, setCurrentQuestion, updateResults, setParticipants, addChatMessage } from '../store/slices/pollSlice.js';
import socket from '../utils/socket.js';

export default function StudentWaiting() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { studentName, currentQuestion, isResultsVisible, participants, chatMessages } = useSelector(state => state.poll);

  // Track if joinAsStudent has been emitted to prevent double emits
  const [hasEmittedJoin, setHasEmittedJoin] = useState(false);

  useEffect(() => {
    // Only emit joinAsStudent once when component mounts and studentName is available
    if (studentName && !hasEmittedJoin) {
      console.log('StudentWaiting: Emitting joinAsStudent for', studentName);
      socket.emit('joinAsStudent', studentName);
      setHasEmittedJoin(true); // Mark that we've emitted the join event
    }

    // Listen for events
    socket.on('newQuestion', (data) => {
      console.log('StudentWaiting: Received newQuestion event:', data);
      dispatch(setCurrentQuestion(data));
      dispatch(setIsResultsVisible(false));
      navigate('/student-dashboard'); // Navigate to dashboard when question arrives
    });

    socket.on('showResults', (res) => {
      console.log('StudentWaiting: Received showResults event:', res);
      dispatch(updateResults(res));
      dispatch(setIsResultsVisible(true));
      navigate('/student-dashboard'); // Navigate to dashboard to show results
    });

    socket.on('kickedOut', () => {
      console.log('StudentWaiting: Received kickedOut event');
      dispatch(setKickedOut(true));
      navigate('/kicked-out');
    });

    socket.on('updateParticipants', (updatedParticipants) => {
      console.log('StudentWaiting: Received updateParticipants event:', updatedParticipants);
      dispatch(setParticipants(updatedParticipants));
    });

    socket.on('chatMessage', (msg) => {
      console.log('StudentWaiting: Received chatMessage event:', msg);
      dispatch(addChatMessage(msg));
    });

    // Cleanup listeners on unmount
    return () => {
      socket.off('newQuestion');
      socket.off('showResults');
      socket.off('kickedOut');
      socket.off('updateParticipants');
      socket.off('chatMessage');
    };
  }, [studentName, dispatch, navigate, hasEmittedJoin]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="mb-8">
        <span className="inline-block px-4 py-1 text-white bg-primary-7765DA rounded-full text-sm">
          Intervue Poll
        </span>
      </div>

      {/* Loader */}
      <div className="w-12 h-12 border-4 border-primary-7765DA rounded-full animate-spin mb-4"></div>
      <h2 className="text-xl font-bold">Wait for the teacher to ask questions..</h2>

      {/* Chat Button - Positioned at bottom right as per Figma */}
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