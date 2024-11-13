<template>
  <div class="navbar">
    <hamburger
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggleClick="toggleSideBar"
    />

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <el-dropdown class="avatar-container" trigger="click">
        <div class="avatar-wrapper">
          <!-- 头像 -->
          <img v-if="avatar" :src="avatar" class="user-avatar">
          <span v-else class="username">{{ name?.charAt(0) }}</span>
          <!-- 用户名称 -->
          <span class="name">{{ name }}</span>
          <!-- 图标 -->
          <i class="el-icon-setting" />
        </div>
        <el-dropdown-menu slot="dropdown" class="user-dropdown">
          <router-link to="/">
            <el-dropdown-item> 首页 </el-dropdown-item>
          </router-link>
          <a target="_blank" href="https://github.com/goodtimes0504/heimahr">
            <el-dropdown-item>项目地址</el-dropdown-item>
          </a>
          <!-- prevent 阻止默认行为 -->
          <a target="_blank" @click.prevent="updatePassword">
            <el-dropdown-item>修改密码</el-dropdown-item>
          </a>
          <!-- native事件修饰符 注册组件的根元素的原生事件 -->
          <!-- el-dropdown-item是没有点击事件的 -->
          <el-dropdown-item @click.native="logout">
            <span style="display: block">退出登录</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!-- 放置dialog -->
    <!-- sync可以接收子组件传过来的事件和值 -->
    <el-dialog :visible.sync="showDialog" title="修改密码" width="500px" @close="btnCancel">
      <!-- 放置表单 -->
      <el-form
        ref="passForm"
        label-width="80px"
        :model="passForm"
        :rules="rules"
      >
        <el-form-item label="旧密码" prop="oldPassword">
          <!-- 不绑定数据的话 是无法输入内容的 -->
          <el-input v-model="passForm.oldPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passForm.newPassword" show-password size="small" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passForm.confirmPassword"
            show-password
            size="small"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            size="mini"
            type="primary"
            @click="btnOK"
          >确认修改</el-button>
          <el-button size="mini" @click="btnCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import { updatePassword } from '@/api/user'

export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  data() {
    return {
      showDialog: false, // 控制修改密码dialog的显示与隐藏
      passForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      rules: {
        oldPassword: [
          { required: true, message: '请输入旧密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '密码长度在6到16个字符之间',
            trigger: 'blur'
          },
          // 新老密码不能一样
          {
            validator: (rule, value, callback) => {
              if (value === this.passForm.oldPassword) {
                callback(new Error('新密码不能与旧密码相同'))
              } else {
                callback()
              }
            }
          }
        ],
        confirmPassword: [
          { required: true, message: '请输入确认密码', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (value !== this.passForm.newPassword) {
                callback(new Error('两次输入密码不一致'))
              } else {
                callback()
              }
            }
          }
        ]
      }
    }
  },
  computed: {
    // 引入头像和用户名
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  methods: {
    // 弹出dialog修改密码页面
    updatePassword() {
      // alert('修改密码')
      // 显示弹出dialog
      this.showDialog = true
    },
    // 切换侧边栏的显示与隐藏
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      // 调用退出登录action
      await this.$store.dispatch('user/logout')
      // 跳转到登录页 并携带当前页面的路径
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
      // alert('退出登录')
    },
    // 点击确定修改密码
    async btnOK() {
      await this.$refs.passForm.validate(async(isOK) => {
        if (isOK) {
          try {
            // 调用修改密码接口
            // await this.$store.dispatch('user/updatePassword', this.passForm)
            await updatePassword(this.passForm)

            // 重置表单
            // this.passForm = {
            //   oldPassword: '',
            //   newPassword: '',
            //   confirmPassword: ''
            // }
            this.$refs.passForm.resetFields()

            // // 关闭弹出dialog
            // this.showDialog = false
            // // 提示修改成功
            // this.$message.success('修改密码成功')
            this.btnCancel()
          } catch (error) {
            this.$message.error(error.message)
          }
        }
      })
    },
    // 点击取消修改密码
    btnCancel() {
      // 重置表单
      // 重置表单
      // this.passForm = {
      //   oldPassword: '',
      //   newPassword: '',
      //   confirmPassword: ''
      // }
      this.$refs.passForm.resetFields()
      // 关闭弹出dialog
      this.showDialog = false
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;
        display: flex;
        align-items: center;
        .name {
          margin-right: 10px; // 用户名和头像之间的距离
          font-size: 16px;
        }
        .username {
          width: 30px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background-color: #04c9be; // 没有图片时的用首字符代替的样式的背景颜色

          color: #fff;
          border-radius: 50%; // 圆形
          margin-right: 4px;
        }
        .el-icon-setting {
          font-size: 20px;
        }
        .user-avatar {
          cursor: pointer;
          width: 30px;
          height: 30px;
          border-radius: 50%;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
