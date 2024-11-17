import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

// set ElementUI lang to EN 设置eliment-ui的语言为EN 如果想用中文，请把locale的值改为zh-CN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI)
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false
// 注册自定义指令 控制功能权限 别的地方就可以用v-permission来使用这个指令了
Vue.directive('permission', {
  // 会在指令作用的元素插入dom之后执行
  inserted(el, binding) {
    // el:指令作用的元素 当前指令作用的dom元素对象
    // binding:指令相关的一些信息 binding是v-permission="表达式"中的表达式
    // console.log(el, binding)
    // 拿到当前用户的权限点 写?是可选链操作符 防止报错 当userInfo不存在时 就不会往下执行
    const points = store.state.user.userInfo?.roles?.points || []
    // 拿到points数组之后判断数组里是否有binding.value中的值 如果有就说明有权限 没有就说明没有权限
    if (!points.includes(binding.value)) {
      // 没有权限 就删除或者禁用
      el.remove()
      // el.disabled = true // 禁用
    }
  }
})

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
