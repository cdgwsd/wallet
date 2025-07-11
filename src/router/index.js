import { createRouter, createWebHistory } from 'vue-router'
import AccountList from '../views/AccountList.vue'
import StatisticsPage from '../views/StatisticsPage.vue'
import AddAccountPage from '../views/AddAccountPage.vue'
import EmptyComponent from '../components/EmptyComponent.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: AccountList
    },
    {
      path: '/statistics',
      name: 'statistics',
      component: StatisticsPage
    },
    {
      path: '/add-account',
      name: 'add-account',
      components: {
        default: EmptyComponent,
        background: AccountList,
        modal: AddAccountPage
      }
    },
    {
      path: '/edit-account/:id',
      name: 'edit-account',
      components: {
        default: EmptyComponent,
        background: AccountList,
        modal: AddAccountPage
      },
      props: {
        modal: true
      }
    }
  ]
})

export default router