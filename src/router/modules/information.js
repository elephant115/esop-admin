import Layout from '@/layout/index.vue'

export default [
  {
    path: '/information',
    component: Layout,
    redirect: '/information/index',
    name:'information',
    meta: {
      title: '信息资讯',
      icon: 'article',
      roles: ['information:page']
    },
    children: [
      {
        path: '/information/index',
        name: 'informationIndex',
        component: () => import('@/views/information/index'),
        meta: {
          title: '新闻',
          icon: 'article',
          roles: ['information:page']
        }
      },
      {
        path: '/information/announcement',
        name: 'announcement',
        component: () => import('@/views/information/announcement'),
        meta: {
          title: '公告',
          icon: 'article',
          roles: ['information:page']
        }
      }
    ]
  },
 
]
