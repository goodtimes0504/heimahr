<template>
  <div class="login-container">
    <div class="logo" />
    <div class="form">
      <h1>登录</h1>
      <el-card shadow="never" class="login-card">
        <!--登录表单-->
        <!-- ref="form" 绑定表单对象 后续可以使用this.$refs.form.validate()方法进行表单校验 -->
        <!-- el-form > el-form-item > el-input -->
        <el-form ref="form" :model="loginForm" :rules="loginRules">
          <el-form-item prop="mobile">
            <el-input v-model="loginForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" show-password placeholder="请输入密码" />
          </el-form-item>
          <el-form-item prop="isAgree">
            <el-checkbox v-model="loginForm.isAgree">
              用户平台使用协议
            </el-checkbox>
          </el-form-item>
          <el-form-item>
            <el-button style="width:350px" type="primary" @click="login">登录</el-button>
          </el-form-item>
          <!-- <el-button @click="test">测试</el-button> -->
        </el-form>
      </el-card>
    </div>
  </div>
</template>
<script>
// import axios from 'axios'
// import request from '@/utils/request'
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        mobile: process.env.NODE_ENV === 'development' ? '13800000002' : '',
        password: process.env.NODE_ENV === 'development' ? 'hm#qd@23!' : '',
        isAgree: process.env.NODE_ENV === 'development' // 勾选协议
      },
      loginRules: {
        mobile: [{
          required: true,
          message: '请输入手机号',
          trigger: 'blur'
        }, {
          pattern: /^1[3-9]\d{9}$/,
          message: '手机号格式不正确',
          trigger: 'blur'

        }],
        password: [{
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }, {
          min: 6,
          max: 16,
          message: '密码长度应该为6-16位之间',
          trigger: 'blur'

        }],
        // required只能检测 null undefined ""
        isAgree: [{
          validator: (rule, value, callback) => {
            // rule校验规则
            // value 校验的值
            // callback 函数 - promise resolve reject
            // callback() callback(new Error(错误信息))
            value ? callback() : callback(new Error('您必须勾选用户的使用协议'))
          }
        }]
      }
    }
  },
  // created() {
  //   alert(process.env.NODE_ENV)
  // },
  methods: {
    login() {
      this.$refs.form.validate(async(isOK) => {
        if (isOK) {
          // alert('校验通过')
          await this.$store.dispatch('user/login', this.loginForm)
          // 上面调用的是vuex里的action 返回一个promise 必须要等它成功才执行下面的跳转 可以用async await 如果不写await 也可以用.then 如果都不写 那么无论成功失败 都会执行下面的跳转 所以要加await 不然就不符合逻辑
          // 跳转主页
          this.$router.push('/')
        }
      })
    }
    // 测试axios
    // textAxios() {
    //   axios({
    //     // url: 'https://heimahr.itheima.net/api/sys/login',
    //     // 改成下面的就是匹配到vue.config.js中的proxy代理 用代理转发api 绕过浏览器的跨域限制
    //     url: '/api/sys/login', // 实际地址是http://localhost:9528/api/sys/login 这样会被代理识别并转发到https://heimahr.itheima.net/api/sys/login
    //     method: 'post',
    //     data: {
    //       username: 'admin',
    //       password: '123456'
    //     }
    //   })
    // }
    // test() {
    //   request({
    //     url: '/sys/login',
    //     method: 'post',
    //     data: {
    //       mobile: '13912345678',
    //       password: '123456'
    //     }
    //   })
    // }
  }
}
</script>
<style lang="scss">
.login-container {
  display: flex;
  align-items: stretch;
  height: 100vh;
  .logo {
    flex: 3;
    background: rgba(38, 72, 176) url(../../assets/common/login_back.png)
      no-repeat center / cover;
    border-top-right-radius: 60px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    padding: 0 100px;
    .icon {
      background: url(../../assets/common/logo.png) no-repeat 70px center /
        contain;
      width: 300px;
      height: 50px;
      margin-bottom: 50px;
    }
    p {
      color: #fff;
      font-size: 18px;
      margin-top: 20px;
      width: 300px;
      text-align: center;
    }
  }
  .form {
    flex: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-left: 176px;
    .el-card {
      border: none;
      padding: 0;
    }
    h1 {
      padding-left: 20px;
      font-size: 24px;
    }
    .el-input {
      width: 350px;
      height: 44px;
      .el-input__inner {
        background: #f4f5fb;
      }
    }
    .el-checkbox {
      color:#606266;
    }
  }
}
</style>
