// backend/utils/socketHandlers.js
// Import the state management module
const state = require('./state.js');

module.exports = (socket, io, state) => {
  // Ensure listeners are only attached once per socket instance here
  // The 'state' object is passed in, so we use it directly

  // Teacher creates poll
  socket.on('createPoll', (data) => {
    console.log('Received createPoll event:', data);

    // Use the functions from the state module to access the global variables
    if (state.getIsPollActive() && Object.keys(state.getAnswers()).length < state.getParticipants().length) {
      console.log(`Teacher ${socket.id} cannot create new poll. Waiting for students to answer.`);
      socket.emit('error', 'Cannot create new poll until all students answer.');
      return;
    }

    state.setCurrentQuestion(data);
    state.resetAnswers(); // Use the reset function
    state.setTimeLimit(data.timeLimit || 60);
    state.setIsPollActive(true);

    // Log the participants list before emitting
    console.log('Current participants:', state.getParticipants().map(p => p.name));

    io.emit('newQuestion', {
      question: data.question,
      timeLimit: state.getTimeLimit(),
      options: data.options,
    });

    console.log(`Emitted newQuestion to all clients. Total clients: ${io.sockets.sockets.size}`);
    startTimer(io, state);
  });

  // Student submits answer
  socket.on('submitAnswer', (data) => {
    // Check the global state for activity
    if (!state.getIsPollActive()) {
      console.log('Received answer from student', socket.id, 'but poll is not active.');
      return; // Ignore the answer if the poll isn't active
    }

    console.log(`Received answer from student ${socket.id}: ${data.answer}`);
    state.addAnswer(socket.id, data.answer); // Use the function to update global state

    // Broadcast updated answers to teacher (for live tracking if needed)
    io.emit('updateAnswers', { studentId: socket.id, answer: data.answer });

    // Check if all students have answered using the global state
    if (Object.keys(state.getAnswers()).length === state.getParticipants().length) {
      console.log('All students have answered. Ending poll.');
      endPoll(io, state);
    }
  });

  // Teacher removes student
  socket.on('removeStudent', (studentId) => {
    console.log(`Teacher ${socket.id} is removing student ${studentId}`);
    state.removeParticipant(studentId); // Use the function to update global state
    io.to(studentId).emit('kickedOut');
    io.emit('updateParticipants', state.getParticipants()); // Emit updated list
  });

  // Student joins as participant
  socket.on('joinAsStudent', (name) => {
    console.log(`Student ${socket.id} is joining with name: ${name}`);
    // Check if participant already exists to prevent duplicates on this socket instance
    // This is a safeguard, but the primary fix is ensuring the listener runs once per socket
    const existingIndex = state.getParticipants().findIndex(p => p.id === socket.id);
    if (existingIndex === -1) {
        const student = { id: socket.id, name };
        state.addParticipant(student); // Use the function to update global state
        socket.emit('joined', student);
        io.emit('updateParticipants', state.getParticipants()); // Emit updated list
    } else {
        // If participant already exists, just update the name if it changed
        state.getParticipants()[existingIndex].name = name;
        io.emit('updateParticipants', state.getParticipants());
    }
  });

  // Teacher joins
  socket.on('joinAsTeacher', () => {
    console.log(`Teacher ${socket.id} is joining`);
    socket.emit('teacherJoined', {
      participants: state.getParticipants(), // Use the function to get global state
      currentQuestion: state.getCurrentQuestion(), // Use the function to get global state
      isPollActive: state.getIsPollActive() // Use the function to get global state
    });
  });

  // Chat message
  socket.on('chatMessage', (msg) => {
    console.log(`Received chat message from ${msg.senderName || 'Anonymous'}: ${msg.text}`);
    io.emit('chatMessage', { ...msg, senderId: socket.id });
  });

  // Reset poll after results shown
  socket.on('resetPoll', () => {
    console.log('Received resetPoll event');
    state.setCurrentQuestion(null); // Use the function to update global state
    state.setIsPollActive(false); // Use the function to update global state
    state.resetAnswers(); // Use the reset function
    state.resetTimer(); // Use the reset function
    io.emit('pollReset');
  });

  // Get poll history (Bonus)
  socket.on('getPollHistory', () => {
    console.log('Received getPollHistory event');
    socket.emit('pollHistory', state.getPastPolls()); // Use the function to get global state
  });
};

function startTimer(io, state) {
  let timeLeft = state.getTimeLimit();
  io.emit('timeUpdate', timeLeft); // Send initial time

  state.setTimer(setInterval(() => {
    timeLeft--;
    io.emit('timeUpdate', timeLeft);

    if (timeLeft <= 0) {
      console.log('Timer reached 0. Ending poll.');
      endPoll(io, state);
    }
  }, 1000));
}

function endPoll(io, state) {
  console.log('Ending poll...');
  state.resetTimer(); // Use the reset function to clear and reset the timer
  state.setIsPollActive(false); // Use the function to update global state

  // Calculate results using the global state
  const results = {};
  for (let answer of Object.values(state.getAnswers())) { // Access answers object correctly
    results[answer] = (results[answer] || 0) + 1;
  }
  const formattedResults = Object.entries(results).map(([option, count]) => ({ option, count }));

  // Store for history (Bonus) using the global state
  const currentQ = state.getCurrentQuestion();
  if (currentQ) {
    state.addPastPoll({ // Use the function to update global state
      id: Date.now(),
      question: currentQ.question,
      options: currentQ.options,
      results: formattedResults,
      timestamp: new Date().toISOString(),
    });
  }

  io.emit('showResults', formattedResults);
}