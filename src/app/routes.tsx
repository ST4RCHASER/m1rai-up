import { useRoutes } from 'react-router-dom'

import Error404 from '@/pages/404'
import Home from '@/pages/home'

export const AppRoutes = () => {
  return useRoutes([
    { path: '/', element: <Home /> },
    { path: '*', element: <Error404 /> },
  ])
}
