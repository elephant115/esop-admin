import Layout from '@/layout/index.vue'

export default 
[
  {
    path: '/version',
    component: Layout,
    redirect: '/version/index',
    name:'version',
    meta: {
      title: 'APP',
      icon: 'article',
      roles: ['version:page']
    },
    children: [
      {
        path: '/version/index',
        name: 'versionIndex',
        component: () => import('@/views/version/index'),
        meta: {
          title: 'APP热更新',
          icon: 'article',
          roles: ['version:page']
        }
      }
    ]
  },
 
]
