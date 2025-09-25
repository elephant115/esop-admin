import Layout from '@/layout/index.vue'

export default [
  {
    path: '/common',
    component: Layout,
    redirect: '/common/dialog',
    common: "common",
    meta: {
      title: '权限管理',
      icon: 'personnel',
      roles: ['common:page']
    },
    children: [
      // {
      //   path: '/common/dialog',
      //   name: 'dialog',
      //   component: () => import('@/views/common/dialog'),
      //   meta: {
      //     title: '角色管理',
      //     icon: 'personnel-manage',
      // roles: ['common:page']
      //   }
      // },
      {
        path: '/common/form',
        name: 'commonform',
        component: () => import('@/views/common/form'),
        meta: {
          title: '用户管理',
          icon: 'personnel-manage',
          roles: ['common:page']
        }
      }
    ]
  },

]
