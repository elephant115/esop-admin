import Layout from '@/layout/index.vue'

export default [
    {
        path: '/resources',
        component: Layout,
        redirect: '/resources/index',
        name: 'resources',
        meta: {
            title: '规则配置',
            icon: 'article',
            roles: ['resources:page']
        },
        children: [{
            path: '/resources/index',
            name: 'resourcesIndex',
            component: () =>
                import('@/views/resources/index.vue'),
            meta: {
                title: '规则配置',
                icon: 'article',
                roles: ['resources:page']
            }
        }]
    }
]