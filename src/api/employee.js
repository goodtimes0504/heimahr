import request from '@/utils/request'

// 获取员工列表
export function getEmployeeList(params) {
  return request({
    url: '/sys/user',
    params // 地址参数 查询参数
  })
}
// 导出员工excel的 接口
export function exportEmployee() {
  return request({
    url: '/sys/user/export',
    // 改变接收数据的类型
    responseType: 'blob' // blob是二进制数据 使用blob接收二进制文件流
  })
}
// 下载导入模板的接口
export function getExportTemplate() {
  return request({
    url: '/sys/user/import/template',
    responseType: 'blob'// 改变接收数据的类型 接收二进制文件流

  })
}
// 上传excel的接口
export function uploadExcel(data) {
  return request({
    url: '/sys/user/import',
    method: 'post',
    data // 上传的excel文件 是form-data类型的数据

  })
}
// 删除员工
export function delEmployee(id) {
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}
// 新增员工

export function addEmployee(data) {
  return request({
    url: '/sys/user',
    method: 'post',
    data
  })
}
// 获取员工详情
export function getEmployeeDetail(id) {
  return request({
    url: `/sys/user/${id}`
  })
}
// 修改员工详情
export function updateEmployee(data) {
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}
// 获取已启用的角色
export function getEnabledRoleList() {
  return request({
    url: '/sys/role/list/enabled',
    method: 'get'
  })
}
// 分配员工角色接口
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    method: 'put',
    data
  })
}
