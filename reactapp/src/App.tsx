import { Navigate, Route, Routes } from 'react-router-dom';

import AppLayout from './components/layout/AppLayout';
import ProtectedRoute from './components/routing/ProtectedRoute';
import PortfolioDashboard from './pages/PortfolioDashboard';
import EmployeeTimelinePage from './pages/EmployeeTimelinePage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ProjectsPage from './pages/ProjectsPage';
import TeamsPage from './pages/TeamsPage';
import AIChatPage from './pages/AIChatPage';
import AIRecommendationsPage from './pages/AIRecommendationsPage';
import SettingsRolesPage from './pages/SettingsRolesPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={(
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        )}
      >
        <Route index element={<Navigate to="/projects" replace />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="/dashboard" element={<PortfolioDashboard />} />
        <Route path="/teams">
          <Route index element={<TeamsPage />} />
          <Route path=":employeeId" element={<EmployeeTimelinePage />} />
        </Route>
        <Route path="/ai">
          <Route index element={<Navigate to="/ai/chat" replace />} />
          <Route path="chat" element={<AIChatPage />} />
          <Route path="recommendations" element={<AIRecommendationsPage />} />
        </Route>
        <Route path="/settings">
          <Route index element={<Navigate to="/settings/roles-lcats" replace />} />
          <Route path="roles-lcats" element={<SettingsRolesPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/projects" replace />} />
    </Routes>
  );
}

