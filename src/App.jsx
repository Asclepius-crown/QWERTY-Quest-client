import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Play from './pages/Play';
import Leaderboard from './pages/Leaderboard';
import HowItWorks from './pages/HowItWorks';
import Profile from './pages/Profile';
import Practice from './pages/Practice';
import Rank from './pages/Rank';
import Settings from './pages/Settings';
import Network from './pages/Network';
import RankedLobby from './pages/RankedLobby';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/play" element={<ProtectedRoute><Play /></ProtectedRoute>} />
        <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
        <Route path="/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/rank" element={<ProtectedRoute><Rank /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        <Route path="/network" element={<ProtectedRoute><Network /></ProtectedRoute>} />
        <Route path="/ranked-lobby" element={<ProtectedRoute><RankedLobby /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
