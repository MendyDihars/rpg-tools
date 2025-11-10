import { Navigate, Route, Routes } from 'react-router-dom'
import { DEFAULT_ROUTE, ROUTES } from './routes.jsx'

function Router() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={DEFAULT_ROUTE.path} replace />} />
      {ROUTES.map((route) => (
        <Route key={route.id} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<Navigate to={DEFAULT_ROUTE.path} replace />} />
    </Routes>
  )
}

export default Router

