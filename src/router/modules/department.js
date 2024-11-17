import layout from '@/layout'

export default {
  // 路由信息
  path: '/department', // 路由地址
  name: 'department', // 路由名称
  component: layout, // 一级路由
  children: [
    {
      path: '', // 二级路由地址为空时 代表当前路由/department  就是二级路由的默认路由
      component: () => import('@/views/department'), // 二级路由组件
      name: 'department', // name可以用来跳转也可以标记路由
      meta: {
        // 路由元信息，存储数据的
        // 另外渲染左侧菜单时需要使用到

        icon: 'tree', // 菜单图标
        title: '组织' // 菜单标题

      }
    }
  ]
}
