// frontend/src/store/slices/pollSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: null,
  studentName: '',
  currentQuestion: null,
  answers: {},
  results: [],
  participants: [], // Initialize as empty array
  isPollActive: false,
  timeLeft: 60,
  isResultsVisible: false,
  chatMessages: [],
  kickedOut: false,
  pollHistory: [],
  isChatOpen: false,
};

const pollSlice = createSlice({
  name: 'poll',
  initialState,
  reducers: {
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setStudentName: (state, action) => {
      state.studentName = action.payload;
    },
    setCurrentQuestion: (state, action) => {
      state.currentQuestion = action.payload;
      state.isPollActive = true;
      state.timeLeft = action.payload.timeLimit || 60;
      state.isResultsVisible = false;
      state.answers = {};
    },
    submitAnswer: (state, action) => {
      state.answers[action.payload.studentId] = action.payload.answer;
    },
    updateResults: (state, action) => {
      state.results = action.payload;
    },
    addParticipant: (state, action) => {
      // Check if participant already exists by id to avoid duplicates
      const existingIndex = state.participants.findIndex(p => p.id === action.payload.id);
      if (existingIndex === -1) {
        state.participants.push(action.payload);
      } else {
        // Update the existing participant's name if needed
        state.participants[existingIndex].name = action.payload.name;
      }
    },
    removeParticipant: (state, action) => {
      state.participants = state.participants.filter(p => p.id !== action.payload);
    },
    setKickedOut: (state, action) => {
      state.kickedOut = action.payload;
    },
    setTimeLeft: (state, action) => {
      state.timeLeft = action.payload;
    },
    setIsResultsVisible: (state, action) => {
      state.isResultsVisible = action.payload;
    },
    addChatMessage: (state, action) => {
      state.chatMessages.push(action.payload);
    },
    resetPoll: (state) => {
      state.currentQuestion = null;
      state.isPollActive = false;
      state.timeLeft = 60;
      state.isResultsVisible = false;
      state.answers = {};
      state.results = [];
    },
    setPollHistory: (state, action) => {
      state.pollHistory = action.payload;
    },
    setChatOpen: (state, action) => {
      state.isChatOpen = action.payload;
    },
    setParticipants: (state, action) => {
      // This action will replace the entire participants array
      state.participants = action.payload;
    },
  },
});

export const {
  setRole,
  setStudentName,
  setCurrentQuestion,
  submitAnswer,
  updateResults,
  addParticipant,
  removeParticipant,
  setKickedOut,
  setTimeLeft,
  setIsResultsVisible,
  addChatMessage,
  resetPoll,
  setPollHistory,
  setChatOpen,
  setParticipants, // Export the new action
} = pollSlice.actions;

export default pollSlice.reducer;