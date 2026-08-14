import { Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/LoginPage'
import ControlPanelLayout from '@/components/ControlPanelLayout'
import RequireAuth from '@/components/RequireAuth'
import AllFlightsPage from '@/pages/AllFlightsPage'
import SortFlightsPage from '@/pages/SortFlightsPage'
import AddFlightPage from '@/pages/AddFlightPage'
import DeleteFlightPage from '@/pages/DeleteFlightPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route
        path="/controlpanel"
        element={
          <RequireAuth>
            <ControlPanelLayout />
          </RequireAuth>
        }
      >
        <Route index element={<AllFlightsPage />} />
        <Route path="sort" element={<SortFlightsPage />} />
        <Route path="add" element={<AddFlightPage />} />
        <Route path="delete" element={<DeleteFlightPage />} />
      </Route>
    </Routes>
  )
}
