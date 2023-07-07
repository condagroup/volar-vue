import Vue from 'vue'
import VueRouter from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChatView from '../views/ChatView.vue'
import LoginView from '../views/LoginView.vue'
import ProfileView from '../views/ProfileView.vue'
import SuccessView from '../views/SuccessView.vue'
import TranscribeView from '../views/TranscribeView.vue'
import store from '../store.js';

Vue.use(VueRouter)

const requireAuth = (to, from, next) => {
  if (store.state.user) {
    next();
  } else {
    next('/login'); // redirect to login page if not logged in
  }
};

const router = new VueRouter({
  mode: 'history',
  base: import.meta.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/chat',
      name: 'chat',
      component: ChatView
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfileView
    },
    {
      path: '/success',
      name: 'success',
      component: SuccessView
    },
    {
      path: '/transcribe',
      name: 'transcribe',
      component: () => import('../views/TranscribeView.vue'),
      beforeEnter: requireAuth,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue')
    },
    {
      path: '/subscribe',
      name: 'subscribe',
      component: () => import('../views/PaymentView.vue'),
      beforeEnter: requireAuth,
    },
  ],
    scrollBehavior(to, from, savedPosition) {
      if (to.hash) {
          return {
              selector: to.hash,
              behavior: 'smooth',
          };
      }
      return { x: 0, y: 0 };
  },
})

export default router
