import layout from '@/layout'
export default {
  path: '/employee',
  name: 'employee',
  component: layout,
  children: [{
    path: '',
    name: 'employee',
    component: () => import('@/views/employee'),
    meta: {
      title: '员工',
      icon: 'people'
    }
  }, {
    path: '/employee/detail/:id?', // 员工详情的地址 :id 是动态参数 如果不加:id 就是静态路由 如果后面push跳转的时候传参了 就会自动匹配到这个路由 如果不加:id 就不会匹配到这个路由 就会报错404
    // 然后最后加一个？ 表示这个参数是可选的 可以传也可以不传 不然不带id的跳转也会报错比如新增员工的时候
    component: () => import('@/views/employee/detail'),
    hidden: true, // 不显示在左侧菜单
    meta: {
      title: '员工详情'// 显示在导航的文本

    }
  }]
}
// 如果只想让左侧菜单显示一级菜单的话 让二级路由只有一个显示在左侧菜单
