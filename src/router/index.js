import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CategoryView from '../views/CategoryView.vue'
import CategoryItemsView from '../views/CategoryItemsView.vue'
import SearchView from '../views/SearchView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/category',
    name: 'category',
    component: CategoryView
  },
  {
    path: '/category-items',
    name: 'category-items',
    component: CategoryItemsView
  },
  {
    path: '/search',
    name: 'search',
    component: SearchView
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
