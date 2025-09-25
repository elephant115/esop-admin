import Layout from '@/layout/index.vue'

export default [
    {
        path: '/data',
        component: Layout,
        redirect: '/data/stockList',
        name:'data',
        meta: {
            title: '数据',
            icon: 'personnel',
            roles: ['data:page']
        },
        children: [{
            path: '/data/stockList',
            name: 'stockList',
            component: () =>
                import ('@/views/data/stockList'),
            meta: {
                title: '股票列表',
                icon: 'personnel-manage',
                roles: ['data:page']
            }
        }, {
            path: '/data/systemList',
            name: 'systemList',
            component: () =>
                import ('@/views/data/systemList'),
            meta: {
                title: '系统股票列表',
                icon: 'personnel-manage',
                roles: ['data:page']
            }
        }]
    },

]