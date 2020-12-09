import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const devRouters = [
    {
        path: '/icon',
        name: 'icon',
        component: () => import('@/views/icons')
    },
]

const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home'),
        redirect: '/projects',
        children: [
            {
                path: 'projects',
                component: () => import('@/views/projects'),
                name: 'projects',
                meta: { title: 'projects'}
            },
            {
                path: 'projects/:id',
                component: () => import('@/views/mock-data'),
                name: 'mockData',
                meta: { title: 'mockData'}
            },
            {
                path: 'template',
                component: () => import('@/views/mock-template'),
                name: 'template',
                meta: { title: 'template'}
            },
            {
                path: 'guide',
                component: () => import('@/views/guide'),
                name: 'guide',
                meta: { title: 'guide'}
            }
        ]
    
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes: process.env.NODE_ENV === 'development' ? [...devRouters, ...routes] : routes
});

export default router
