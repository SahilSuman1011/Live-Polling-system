
let currentQuestion = null;
let answers = {};
let participants = [];
let timer = null;
let timeLimit = 60; // Default 60 seconds
let isPollActive = false;
let pastPolls = []; // Bonus feature: In-memory storage for past polls

// Export functions to get and set the state
module.exports = {
  // Getters
  getCurrentQuestion: () => currentQuestion,
  getAnswers: () => answers,
  getParticipants: () => participants,
  getTimer: () => timer,
  getTimeLimit: () => timeLimit,
  getIsPollActive: () => isPollActive,
  getPastPolls: () => pastPolls,

  // Setters
  setCurrentQuestion: (q) => { currentQuestion = q; },
  setAnswers: (a) => { answers = a; }, // This allows full reset
  addAnswer: (studentId, answer) => { answers[studentId] = answer; },
  setParticipants: (p) => { participants = p; }, // This allows full reset
  addParticipant: (p) => { participants.push(p); },
  removeParticipant: (id) => { participants = participants.filter(p => p.id !== id); },
  setTimer: (t) => { timer = t; },
  setTimeLimit: (tl) => { timeLimit = tl; },
  setIsPollActive: (active) => { isPollActive = active; },
  setPastPolls: (p) => { pastPolls = p; }, // This allows full reset
  addPastPoll: (poll) => { pastPolls.push(poll); },

  // Reset
  resetAnswers: () => { answers = {}; },
  resetTimer: () => {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
    module.exports.setTimer(timer); // Update the stored value
  }
};