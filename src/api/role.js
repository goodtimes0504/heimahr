import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params // 查询参数 这里面放页码 和每页条数
    // 查询参数是params 请求体是data 如post请求
  })
}
// 封装新增角色接口
export function addRole(data) {
  return request({
    url: '/sys/role',
    method: 'post',
    data
  })
}
// 封装更新角色接口
export function updateRole(data) {
  return request({
    url: `/sys/role/${data.id}`,
    method: 'put',
    data
  })
}
// 封装删除角色接口
export function delRole(id) {
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}
// 获取角色详情
export function getRoleDetail(id) {
  return request({
    url: `/sys/role/${id}`
  })
}
