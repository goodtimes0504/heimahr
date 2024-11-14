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
// 封装获取部门详情api
export function getDepartmentDetail(id) {
  return request({
    url: `/company/department/${id}`
  })
}
// 封装更新部门详情api接口

export function updateDepartment(data) {
  return request({
    method: 'put',
    url: `/company/department/${data.id}`,
    data
  })
}
// 封装删除部门详情api接口
export function delDepartment(id) {
  return request({
    method: 'delete',
    url: `/company/department/${id}`
  })
}

