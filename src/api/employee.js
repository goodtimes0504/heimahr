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