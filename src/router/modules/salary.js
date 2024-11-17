import layout from '@/layout'
export default {
  path: '/salary',
  component: layout,
  name: 'salary',
  children: [{
    path: '',
    name: 'defaultSalary',
    component: () => import('@/views/salary'),
    meta: {
      title: '工资',
      icon: 'money'
    }
  }]
}
