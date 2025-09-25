import Layout from '@/layout/index.vue'

export default [
    {
        path: '/contract',
        component: Layout,
        redirect: '/contract/list',
        name:'contract',
        meta: {
            title: '合约管理',
            icon: 'personnel',
            roles: ['contract:page']
        },
        children: [{
            path: '/contract/list',
            name: 'contractList',
            component: () =>
                import ('@/views/contract/list'),
            meta: {
                title: '合约列表',
                icon: 'personnel-manage',
                roles: ['contract:page']
            }
        }]
    },

]