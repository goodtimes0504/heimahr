import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}
export function getUserInfo() {
  return request({
    url: '/sys/profile',
    method: 'get'// 可以不写 默认就是get
  })
}

// 更新密码
export function updatePassword(data) {
  return request({
    url: '/sys/user/updatePass',
    method: 'put',
    data
  })
}
