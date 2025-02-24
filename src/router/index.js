import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'bai1',
    component: () => import(/* webpackChunkName: "about" */ '../views/Bai1View.vue')
  },
  {
    path: '/bai3',
    name: 'bai3',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/Bai3View.vue')
  },
  {
    path: '/bai2',
    name: 'bai2',

    component: () => import(/* webpackChunkName: "about" */ '../views/Bai2View.vue')
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
