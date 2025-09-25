import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoleSelection from './pages/RoleSelection.jsx';
import StudentNameEntry from './pages/StudentNameEntry.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import TeacherDashboard from './pages/TeacherDashboard.jsx';
import KickedOut from './pages/KickedOut.jsx';
import StudentWaiting from './pages/StudentWaiting.jsx'; // New
import PollHistory from './pages/PollHistory.jsx'; // New

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoleSelection />} />
        <Route path="/student" element={<StudentNameEntry />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/student-waiting" element={<StudentWaiting />} />
        <Route path="/teacher" element={<TeacherDashboard />} />
        <Route path="/kicked-out" element={<KickedOut />} />
        <Route path="/poll-history" element={<PollHistory />} />
      </Routes>
    </Router>
  );
}

export default App;