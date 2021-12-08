import {
  Uim,
  Adm,
  Cim,
  Dashboard,
  Om,
  Category,
} from '../components/Content/index'

const Routes = [
  {
    path: '/home/category',
    component: Category,
  },
  {
    path: '/home/adm',
    component: Adm,
  },
  {
    path: '/home/cim',
    component: Cim,
  },
  {
    path: '/home/uim',
    component: Uim,
  },
  {
    path: '/home/om',
    component: Om,
  },
  {
    path: '/home/dashboard',
    component: Dashboard,
  },
  {
    path: '/home',
    component: Dashboard,
  },
]

export default Routes
