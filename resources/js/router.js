import VueRouter from 'vue-router'
import store from './store';

import Home from './pages/home'
import Register from './pages/register'
import Login from './pages/login'
import FavoriteMovie from './pages/user/favMovie'
import Movie from './pages/user/movie'
import MovieDetail from './pages/user/movie-detail.vue'
import AdminDashboard from './pages/admin/Dashboard'
import Forbidden from './pages/403.vue';

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
        path: '/favmovie',
        name: 'favorite-movie',
        component: FavoriteMovie,
        meta: {
            requiresAuth: true
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
                    name: 'home'
                }, 
                forbiddenRedirect: '/403'
            }
        }
    },
    {
        path: '/403',
        name: 'forbidden',
        component: Forbidden,
        meta: {
            requiresAuth: true
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

    // Check if the route requires authentication
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!isAuthenticated) {
            return next({ name: 'login' });
        }

        const routeAuth = to.meta.auth;
        if (routeAuth) {
            const allowedRoles = Array.isArray(routeAuth.roles) ? routeAuth.roles : [routeAuth.roles];
            if (!allowedRoles.includes(userRole)) {
                if (routeAuth.forbiddenRedirect) {
                    return next(routeAuth.forbiddenRedirect);
                } else {
                    return next(false); 
                }
            }
        }
    }

    if (from.name === to.name) {
        return next(false);
    }

    next();  
});



export default router