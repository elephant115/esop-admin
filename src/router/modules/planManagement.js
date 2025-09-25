import Layout from '@/layout/index.vue'

export default [
    {
        path: '/planManagement',
        component: Layout,
        redirect: '/planManagement/planAllocation',
        name:'planManagement',
        meta: {
            title: '计划管理',
            icon: 'personnel',
            roles: ['planManagement:page']
        },
        children: [{
            path: '/planManagement/planAllocation',
            name: 'planAllocation',
            component: () =>
                import ('@/views/planManagement/planAllocation'),
            meta: {
                title: '计划配置',
                icon: 'personnel-manage',
                roles: ['planManagement:page']
            }
        }, {
            path: '/planManagement/userPlan',
            name: 'userPlan',
            component: () =>
                import ('@/views/planManagement/userPlan'),
            meta: {
                title: '用户计划',
                icon: 'personnel-manage',
                roles: ['planManagement:page']
            }
        }]
    },

]