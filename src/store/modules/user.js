// import { login, logout, getInfo } from '@/api/user'
// import { getToken, setToken, removeToken } from '@/utils/auth'
// import { resetRouter } from '@/router'

// const getDefaultState = () => {
//   return {
//     token: getToken(),
//     name: '',
//     avatar: ''
//   }
// }

// const state = getDefaultState()

// const mutations = {
//   RESET_STATE: (state) => {
//     Object.assign(state, getDefaultState())
//   },
//   SET_TOKEN: (state, token) => {
//     state.token = token
//   },
//   SET_NAME: (state, name) => {
//     state.name = name
//   },
//   SET_AVATAR: (state, avatar) => {
//     state.avatar = avatar
//   }
// }

// const actions = {
//   // user login
//   login({ commit }, userInfo) {
//     const { username, password } = userInfo
//     return new Promise((resolve, reject) => {
//       login({ username: username.trim(), password: password }).then(response => {
//         const { data } = response
//         commit('SET_TOKEN', data.token)
//         setToken(data.token)
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // get user info
//   getInfo({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       getInfo(state.token).then(response => {
//         const { data } = response

//         if (!data) {
//           return reject('Verification failed, please Login again.')
//         }

//         const { name, avatar } = data

//         commit('SET_NAME', name)
//         commit('SET_AVATAR', avatar)
//         resolve(data)
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // user logout
//   logout({ commit, state }) {
//     return new Promise((resolve, reject) => {
//       logout(state.token).then(() => {
//         removeToken() // must remove  token  first
//         resetRouter()
//         commit('RESET_STATE')
//         resolve()
//       }).catch(error => {
//         reject(error)
//       })
//     })
//   },

//   // remove token
//   resetToken({ commit }) {
//     return new Promise(resolve => {
//       removeToken() // must remove  token  first
//       commit('RESET_STATE')
//       resolve()
//     })
//   }
// }

// export default {
//   namespaced: true,
//   state,
//   mutations,
//   actions
// }
// 上面是源码 下面重写
// ··································
// 引入cookies插件相关的方法
import { setToken, getToken, removeToken } from '@/utils/auth.js'
// 引入接口
import { login, getUserInfo } from '@/api/user.js'
// 引入静态路由
import { constantRoutes } from '@/router'
// 引入重置路由方法
import { resetRouter } from '@/router'
const state = {
  // state用来存放数据
  token: getToken() || '', // 应该从本地读取初始值，如果没有则为空字符串
  // 定义一个变量，用来存储用户基本资料
  userInfo: {},
  // 定义一个数组用来存储所有路由 默认初始值是静态路由  动态路由是根据用户权限动态生成的
  routes: constantRoutes
}
const mutations = {
  // mutations用来修改数据
  setToken(state, token) {
    // 修改token
    state.token = token
    // 存储token到本地
    setToken(token)
  },
  // 登出
  removeToken(state) {
    state.token = ''
    removeToken()
  },
  // mutation第一个参数是state，第二个参数是payload，即传递给mutation的参数对象
  // state参数是一个对象，它包含了state中的所有属性
  // payload是一个对象，它包含了传递给mutation的参数对象
  setUserInfo(state, userInfo) {
    state.userInfo = userInfo
  },
  // 设置动态路由
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  // actions用来处理异步操作
  // 第一个参数是context，它包含了state、mutations、actions、getters、commit、dispatch等属性
  // 第二个参数是payload，即传递给action的参数对象
  async login(context, payload) {
    // context.commit('mutations中的方法名', payload)
    // context.dispatch('actions中的方法名', payload)
    // context.state.属性名
    // context.getters.属性名
    // context.rootState.属性名
    // context.rootGetters.属性名
    // console.log(payload)
    // todo: 调用登录接口，获取token
    const token = await login(payload)
    context.commit('setToken', token)// 修改token
  },
  // 获取用户基本资料
  async getUserInfo(context, payload) {
    // console.log('调用action中的getUserInfo方法')
    const result = await getUserInfo()
    context.commit('setUserInfo', result)
    return result// 返回数据
    // console.log('获取用户基本资料成功')
  },
  // 退出登录的action
  logout(context) {
    context.commit('removeToken')// 移除token
    context.commit('setUserInfo', {})// 清空用户信息
    // 调用重置路由方法
    resetRouter()
  }
}
export default {
  // 写了命名空间之后 就可以通过this.$store.dispatch('user/login', this.loginForm)这种方式来调用暴漏的方法和属性
  namespaced: true, // 命名空间
  // 开启命名空间后，在组件中调用mapState、mapMutations、mapActions时，需要加上模块名
  state,
  mutations,
  actions
}
