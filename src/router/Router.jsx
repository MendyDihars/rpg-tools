import PropTypes from 'prop-types'
import { Navigate, Route, Routes } from 'react-router-dom'

function Router({ routes, defaultRoute }) {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={defaultRoute.path} replace />} />
      {routes.map((route) => (
        <Route key={route.id} path={route.path} element={route.element} />
      ))}
      <Route path="*" element={<Navigate to={defaultRoute.path} replace />} />
    </Routes>
  )
}

Router.propTypes = {
  routes: PropTypes.array.isRequired,
  defaultRoute: PropTypes.object.isRequired,
}

export default Router

