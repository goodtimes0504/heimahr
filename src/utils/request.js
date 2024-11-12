// import axios from 'axios'
// import { MessageBox, Message } from 'element-ui'
// import store from '@/store'
// import { getToken } from '@/utils/auth'

// // create an axios instance
// const service = axios.create({
//   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
//   // withCredentials: true, // send cookies when cross-domain requests
//   timeout: 5000 // request timeout
// })

// // request interceptor
// service.interceptors.request.use(
//   config => {
//     // do something before request is sent

//     if (store.getters.token) {
//       // let each request carry token
//       // ['X-Token'] is a custom headers key
//       // please modify it according to the actual situation
//       config.headers['X-Token'] = getToken()
//     }
//     return config
//   },
//   error => {
//     // do something with request error
//     console.log(error) // for debug
//     return Promise.reject(error)
//   }
// )

// // response interceptor
// service.interceptors.response.use(
//   /**
//    * If you want to get http information such as headers or status
//    * Please return  response => response
//   */

//   /**
//    * Determine the request status by custom code
//    * Here is just an example
//    * You can also judge the status by HTTP Status Code
//    */
//   response => {
//     const res = response.data

//     // if the custom code is not 20000, it is judged as an error.
//     if (res.code !== 20000) {
//       Message({
//         message: res.message || 'Error',
//         type: 'error',
//         duration: 5 * 1000
//       })

//       // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
//       if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
//         // to re-login
//         MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
//           confirmButtonText: 'Re-Login',
//           cancelButtonText: 'Cancel',
//           type: 'warning'
//         }).then(() => {
//           store.dispatch('user/resetToken').then(() => {
//             location.reload()
//           })
//         })
//       }
//       return Promise.reject(new Error(res.message || 'Error'))
//     } else {
//       return res
//     }
//   },
//   error => {
//     console.log('err' + error) // for debug
//     Message({
//       message: error.message,
//       type: 'error',
//       duration: 5 * 1000
//     })
//     return Promise.reject(error)
//   }
// )

// export default service
// 上面是源码 下面自己写
import axios from 'axios'// 引入axios
import store from '@/store'// 因为这里不是组件里，所以需要引入store，才能获取到token
// 引入element-ui的message组件，用于提示错误信息
import { Message } from 'element-ui'// 引入element-ui的MessageBox组件，用于弹窗提示

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // 配置axios的baseURL
  // VUE_APP_BASE_API 是在.env文件中配置的变量，用于配置axios的baseURL，方便在开发环境和生产环境切换
  // 比如在开发环境中，你可以将VUE_APP_BASE_API设置为/api
  // 而在生产环境中，你可以将VUE_APP_BASE_API设置为/prod-api
  // 这样就可以在开发环境和生产环境中自动切换baseURL了，而不用手动修改baseURL
  timeout: 10000 // 请求超时时间，单位是毫秒
})
// 请求拦截器
// 成功执行第一个回调函数，失败执行第二个回调函数
service.interceptors.request.use((config) => {
  // 在发送请求之前做些什么
  // 注入token
  // store.getters.token && (config.headers.Authorization = `Bearer ${store.getters.token}`)
  // 上面是合并写法，等同于下面的写法
  if (store.getters.token) {
    config.headers.Authorization = `Bearer ${store.getters.token}`
  }
  // 拦截器一定要返回config，否则请求发不出去
  return config
}, (error) => {
  // 失败执行promise
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use((response) => {
  // axios的响应数据在response.data里 因为axios默认包裹了一层data
  // 对响应数据做点什么
  const { data, message, success } = response.data
  if (success) {
    return data
  } else {
    // 这里是响应成功但是业务失败的情况 就是服务器返回了200 但是业务逻辑失败了 比如token过期了
    // 提示错误信息 这里使用element-ui的message组件，用于提示错误信息
    Message({
      type: 'error',
      message
    })
    // debugger
    return Promise.reject(new Error(message))// 抛出错误，让调用接口的地方可以捕获到错误
  }
}, (error) => {
  // 这个error意思是，如果响应失败，就会走这个回调函数
  // debugger
  // error对象里有message属性
  Message({
    type: 'error',
    message: error.message
  })
  return Promise.reject(error)
})
export default service // 导出axios实例 这样在其他地方就可以使用service了
