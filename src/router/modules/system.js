import Layout from '@/layout/index.vue'

export default [
    {
        path: '/system',
        component: Layout,
        redirect: '/system/menu',
        name: 'system',
        meta: {
            title: '系统管理',
            icon: 'article',
            roles: ['resources:page']
        },
        children: [{
            path: '/system/role',
            name: 'systemRole',
            component: () =>
                import('@/views/system/role.vue'),
            meta: {
                title: '角色列表',
                icon: 'article',
            }
        }]
    }
]