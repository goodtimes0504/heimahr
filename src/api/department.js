import request from '@/utils/request'
// 获取部门列表
export function getDepartment() {
  return request({
    url: '/company/department'

  })
}
// 获取部门负责人列表
export function getManagerList() {
  return request({
    url: '/sys/user/simple'
  })
}
// 新增部门
export function addDepartment(data) {
  return request({
    method: 'post',
    url: '/company/department',
    data
  })
}
