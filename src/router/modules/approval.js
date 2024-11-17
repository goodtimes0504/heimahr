import layout from '@/layout'
export default {
  path: '/approval',
  name: 'approval',
  component: layout,
  children: [{
    path: '',
    name: 'defaultApproval',
    component: () => import('@/views/approval'),
    meta: {
      title: '审批',
      icon: 'tree-table'
    }
  }]
}
