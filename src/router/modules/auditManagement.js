import Layout from '@/layout/index.vue'

export default [
    {
        path: '/auditManagement',
        component: Layout,
        redirect: '/auditManagement/capExerciseRecord',
        name:'auditManagement',
        meta: {
            title: '审核管理',
            icon: 'personnel',
            roles: ['auditManagement:page']
        },
        children: [{
                path: '/auditManagement/cashWrite0ffAudit',
                name: 'cashWrite0ffAudit',
                component: () =>
                    import ('@/views/auditManagement/cashWrite0ffAudit'),
                meta: {
                    title: '现金核销审核',
                    icon: 'personnel-manage',
                    roles: ['auditManagement:page']
                }
            },
            {
                path: '/auditManagement/administrativeAudit',
                name: 'administrativeAudit',
                component: () =>
                    import ('@/views/auditManagement/administrativeAudit'),
                meta: {
                    title: 'OPTION⾏权审核',
                    icon: 'personnel-manage',
                    roles: ['auditManagement:page']
                }
            },
            {
                path: '/auditManagement/rsuExerciseRecord',
                name: 'rsuExerciseRecord',
                component: () =>
                    import ('@/views/auditManagement/rsuExerciseRecord'),
                meta: {
                    title: 'RSU行权记录',
                    icon: 'personnel-manage',
                    roles: ['auditManagement:page']
                }
            },
            {
                path: '/auditManagement/capExerciseRecord',
                name: 'capExerciseRecord',
                component: () =>
                    import ('@/views/auditManagement/capExerciseRecord'),
                meta: {
                    title: 'CAP行权记录',
                    icon: 'personnel-manage',
                    roles: ['auditManagement:page']
                }
            },
            {
                path: '/auditManagement/cbExerciseRecord',
                name: 'cbExerciseRecord',
                component: () =>
                    import ('@/views/auditManagement/cbExerciseRecord'),
                meta: {
                    title: 'CB行权记录',
                    icon: 'personnel-manage',
                    roles: ['auditManagement:page']
                }
            }
        ]
    },

]