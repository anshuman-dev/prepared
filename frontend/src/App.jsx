import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';

// Placeholder components - will be built in later phases
const Login = () => <div className="p-8">Login Page</div>;
const Signup = () => <div className="p-8">Signup Page</div>;
const Dashboard = () => <div className="p-8">Dashboard</div>;
const Interview = () => <div className="p-8">Interview Interface</div>;
const Results = () => <div className="p-8">Results</div>;
const Progress = () => <div className="p-8">Progress</div>;
const Profile = () => <div className="p-8">Profile Settings</div>;

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/interview" element={<Interview />} />
            <Route path="/results/:sessionId" element={<Results />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
