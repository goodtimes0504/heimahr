// import router from './router'
// import store from './store'
// import { Message } from 'element-ui'
// import NProgress from 'nprogress' // progress bar
// import 'nprogress/nprogress.css' // progress bar style
// import { getToken } from '@/utils/auth' // get token from cookie
// import getPageTitle from '@/utils/get-page-title'
// // 进度条设置
// NProgress.configure({ showSpinner: false }) // NProgress Configuration

// const whiteList = ['/login'] // no redirect whitelist

// router.beforeEach(async(to, from, next) => {
//   // start progress bar
//   NProgress.start()

//   // set page title
//   document.title = getPageTitle(to.meta.title)

//   // determine whether the user has logged in
//   const hasToken = getToken()

//   if (hasToken) {
//     if (to.path === '/login') {
//       // if is logged in, redirect to the home page
//       next({ path: '/' })
//       NProgress.done()
//     } else {
//       const hasGetUserInfo = store.getters.name
//       if (hasGetUserInfo) {
//         next()
//       } else {
//         try {
//           // get user info
//           await store.dispatch('user/getInfo')

//           next()
//         } catch (error) {
//           // remove token and go to login page to re-login
//           await store.dispatch('user/resetToken')
//           Message.error(error || 'Has Error')
//           next(`/login?redirect=${to.path}`)
//           NProgress.done()
//         }
//       }
//     }
//   } else {
//     /* has no token*/

//     if (whiteList.indexOf(to.path) !== -1) {
//       // in the free login whitelist, go directly
//       next()
//     } else {
//       // other pages that do not have permission to access are redirected to the login page.
//       next(`/login?redirect=${to.path}`)
//       NProgress.done()
//     }
//   }
// })

// router.afterEach(() => {
//   // finish progress bar
//   NProgress.done()
// })
// 上面的模板自带的权限验证，下面是自己写的
// 权限验证
// 引入路由
import router from './router'
// 引入进度条插件
import nprogress from 'nprogress'
// 引入进度条样式
import 'nprogress/nprogress.css'
// 引入vuex
import store from '@/store'
/**
 * 前置守卫
 * 前置守卫的作用是：在每次路由切换之前都会执行，一般用于登录验证、页面拦截等
 * 守卫里参数是回调函数，next()是必须的，next()是放行，next('/login')是跳转到登录页
 * to: 要进入的目标路由对象
 * from: 当前导航正要离开的路由对象
 * next: 调用该方法后，才会进入下一个钩子函数
 */
// 声明一个白名单的路径列表 如果在白名单之内 就直接放过 白名单一般是不需要登录就可以访问的页面
const whiteList = ['/login', '/404']
router.beforeEach((to, from, next) => {
  nprogress.start()// 开启进度条
  // 看看是否有token
  if (store.getters.token) {
    // 有token 判断一下目标是否是登录页

    if (to.path === '/login') {
      // 如果目标是登录页，就跳转到主页 达到有token的用户不让去主页的效果
      next('/')// 如果next()传入参数，则跳转到该参数的页面 这种情况下并不会执行后置守卫
      nprogress.done()// 由于next传参了 不执行afterEach后置守卫了 所以需要手动关闭进度条
    } else {
      next()// 直接放行
    }
  } else {
    // 没有token
    // 如果目标在白名单之内 就直接放过
    // whiteList.includes(to.path) 是判断to.path是否在白名单之内
    // 或者用whiteList.indexOf(to.path)!== -1 来判断to.path是否在白名单之内
    if (whiteList.includes(to.path)) {
      next()// 如果目标在白名单之内 就直接放过
    } else {
      // 如果目标不在白名单之内 就跳转到登录页
      next('/login')
      nprogress.done()// 由于next传参了 不执行afterEach后置守卫了 所以需要手动关闭进度条
    }
  }
})
/**
 * 后置守卫
 * 后置守卫的作用是：在每次路由切换完成后都会执行，一般用于关闭进度条
 * to: 要进入的目标路由对象
 * from: 当前导航正要离开的路由对象
 * next: 调用该方法后，才会进入下一个钩子函数
 *
 * */
router.afterEach(() => {
  nprogress.done()
})
