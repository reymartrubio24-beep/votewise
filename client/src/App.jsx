import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { VoterLogin } from './pages/VoterLogin';
import { AdminLogin } from './pages/AdminLogin';
import { VoterDashboard } from './pages/VoterDashboard';
import { VotingPage } from './pages/VotingPage';
import { Confirmation } from './pages/Confirmation';
import { Results } from './pages/Results';
import { AdminDashboard } from './pages/AdminDashboard';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<VoterLogin />} />
            <Route path="admin/login" element={<AdminLogin />} />
            <Route path="results" element={<Results />} />
            
            {/* Protected Voter Routes */}
            <Route element={<ProtectedRoute role="voter" />}>
              <Route path="dashboard" element={<VoterDashboard />} />
              <Route path="vote/:id" element={<VotingPage />} />
              <Route path="confirmation" element={<Confirmation />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute role="admin" />}>
              <Route path="admin" element={<AdminDashboard />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
