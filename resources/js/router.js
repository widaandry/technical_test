import VueRouter from 'vue-router'
import store from './store';

import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import Movie from './pages/user/movie'
import MovieDetail from './pages/user/movie-detail.vue'
import AdminDashboard from './pages/admin/Dashboard'

const routes = [
    {
        path: '/',
        name: 'home',
        component: Home,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/register',
        name: 'register',
        component: Register,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: {
            requiresAuth: false
        }
    },
    {
        path: '/movie',
        name: 'movie',
        component: Movie,
        meta: {
            requiresAuth: true
        }
    },
    {
        path: '/movie/detail/:id',
        name: 'movie-detail',
        component: MovieDetail,
        params: true,
        meta: {
            requiresAuth: true
        },
    },
    {
        path: '/admin',
        name: 'admin.dashboard',
        component: AdminDashboard,
        meta: {
            requiresAuth: true,
            auth: {
                roles: -1, 
                redirect: {
                    name: 'login'
                }, 
                forbiddenRedirect: '/403'
            }
        }
    },
]
const router = new VueRouter({
    history: true,
    mode: 'history',
    routes,
})

router.beforeEach((to, from, next) => {
    const isAuthenticated = store.getters['auth/isAuthenticated'];
    const userRole = store.getters['auth/role']; 

    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            if (to.name !== 'login') {
                return next({ name: 'login' });
            }
        }
    }
    if (from.name === to.name) {
        return next(false);
    }

    next();  
});



export default router