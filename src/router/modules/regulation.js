import Layout from '@/layout/index.vue'

export default [
    {
        path: '/regulation',
        component: Layout,
        redirect: '/regulation/list',
        name: 'regulation',
        meta: {
            title: '协议管理',
            icon: 'personnel',
            roles: ['regulation:page']
        },
        children: [{
            path: '/regulation/list',
            name: 'regulationList',
            component: () =>
                import('@/views/regulation/regulation.vue'),
            meta: {
                title: '协议管理',
                icon: 'article',
                roles: ['regulation:page']
            }
        },
        {
            path: '/regulation/aboutUs',
            name: 'regulationAboutUs',
            component: () =>
                import('@/views/regulation/aboutUs.vue'),
            meta: {
                title: '关于我们',
                icon: 'article',
                roles: ['regulation:page']
            }
        }
        ]
    }
]