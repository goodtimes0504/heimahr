import request from '@/utils/request'

// 获取角色列表
export function getRoleList(params) {
  return request({
    url: '/sys/role',
    method: 'get',
    params // 查询参数 这里面放页码 和每页条数
  })
}