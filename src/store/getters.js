const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.userInfo.staffPhoto, // 头像
  name: state => state.user.userInfo.username, // 用户名
  userId: state => state.user.userInfo.userId, // 用户id
  routes: state => state.user.routes // vuex里的动态路由
}
export default getters
