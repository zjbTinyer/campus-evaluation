import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import LoginPage from './pages/auth/LoginPage'
import SearchPage from './pages/search/SearchPage'
import EvaluationsPage from './pages/evaluations/EvaluationsPage'
import HonorsPage from './pages/honors/HonorsPage'
import TasksPage from './pages/tasks/TasksPage'
import LeavesPage from './pages/leaves/LeavesPage'
import LeaveFormPage from './pages/leaves/LeaveFormPage'
import ActivitiesPage from './pages/activities/ActivitiesPage'
import ArchivesPage from './pages/archives/ArchivesPage'
import ProfilePage from './pages/profile/ProfilePage'

export default function App() {
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return (
      <AuthLayout>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthLayout>
    )
  }

  return (
    <MainLayout>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/evaluations" element={<EvaluationsPage />} />
        <Route path="/honors" element={<HonorsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/leaves" element={<LeavesPage />} />
        <Route path="/leaves/new" element={<LeaveFormPage />} />
        <Route path="/activities" element={<ActivitiesPage />} />
        <Route path="/archives" element={<ArchivesPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </MainLayout>
  )
}
