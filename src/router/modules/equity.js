import Layout from '@/layout/index.vue'

export default [
    {
        path: '/equity',
        component: Layout,
        redirect: '/equity/index',
        name:'equity',
        meta: {
            title: '权益',
            icon: 'article',
            roles: ['equity:page']
        },
        children: [{
            path: '/equity/index',
            name: 'equityIndex',
            component: () =>
                import ('@/views/equity/index'),
            meta: {
                title: '权益列表',
                icon: 'article',
                roles: ['equity:page']
            }
        }]
    },

]