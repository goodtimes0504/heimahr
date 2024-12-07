<template>
  <div class="dashboard-container">
    <div class="app-container">
      <div class="edit-form">
        <el-form ref="userForm" :model="userInfo" :rules="rules" label-width="220px">
          <!-- 姓名 部门 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="姓名" prop="username">
                <el-input v-model="userInfo.username" size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 工号 入职时间 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="工号" prop="workNumber">
                <el-input v-model="userInfo.workNumber" disabled size="mini" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!--手机 聘用形式  -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="手机" prop="mobile">
                <!--:disabled="!!$route.params.id"意思是路由参数有id的时候不能修改手机号 $route.params.id是字符串前面加俩叹号意思是把字符串变成布尔值 原理是先取反再取反 -->
                <el-input v-model="userInfo.mobile" size="mini" class="inputW" :disabled="!!$route.params.id" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="部门" prop="departmentId">
                <!-- 放置及联部门组件 -->
                <!-- inputW样式会给到selectTree中 template第一层的组件 -->
                <SelectTree v-model="userInfo.departmentId" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="聘用形式" prop="formOfEmployment">
                <el-select v-model="userInfo.formOfEmployment" size="mini" class="inputW">
                  <el-option label="正式" value="1" />
                  <el-option label="非正式" value="2" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="入职时间" prop="timeOfEntry">
                <el-date-picker
                  v-model="userInfo.timeOfEntry"
                  size="mini"
                  type="date"
                  value-format="yyyy-MM-dd"
                  class="inputW"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="转正时间" prop="correctionTime">
                <el-date-picker v-model="userInfo.correctionTime" size="mini" type="date" class="inputW" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 员工照片 -->
          <el-row>
            <el-col :span="12">
              <el-form-item label="员工头像">
                <!-- 放置上传图片 -->
                <ImageUpload v-model="userInfo.staffPhoto" />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 保存个人信息 -->
          <el-row type="flex">
            <el-col :span="12" style="margin-left: 220px">
              <el-button size="mini" type="primary" @click="saveData">保存更新</el-button>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// 引入级联选择器组件
import SelectTree from './components/select-tree.vue'
// 引入新增员工接口
import { addEmployee } from '@/api/employee'
// 引入获取员工详情接口
import { getEmployeeDetail } from '@/api/employee'
// 引入编辑员工接口
import { updateEmployee } from '@/api/employee'
// 引入封装的头像上传组件
import ImageUpload from './components/image-upload.vue'
export default {
  components: {
    SelectTree,
    ImageUpload
  },
  data() {
    return {
      userInfo: {
        username: '', // 用户名
        mobile: '', // 手机号
        workNumber: '', // 工号
        formOfEmployment: null, // 聘用形式
        departmentId: null, // 部门id
        timeOfEntry: '', // 入职时间
        correctionTime: '', // 转正时间
        staffPhoto: '' // 员工照片 测试https://img2.baidu.com/it/u=1090452517,2487311686&fm=253&fmt=auto&app=120&f=JPEG?w=500&h=501
      },
      rules: {
        username: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          {
            min: 1,
            max: 4,
            message: '姓名为1-4位'
          }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          {
            //   pattern 正则表达式
            pattern: /^1[3-9]\d{9}$/,
            message: '手机号格式不正确',
            trigger: 'blur'
          }
        ],
        formOfEmployment: [
          { required: true, message: '请选择聘用形式', trigger: 'blur' }
        ],
        departmentId: [
          { required: true, message: '请选择部门', trigger: 'blur' }
        ],
        timeOfEntry: [
          { required: true, message: '请选择入职时间', trigger: 'blur' }
        ],
        correctionTime: [
          { required: true, message: '请选择转正时间', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (this.userInfo.timeOfEntry) {
                if (new Date(this.userInfo.timeOfEntry) > new Date(value)) {
                  callback(new Error('转正时间不能小于入职时间'))
                  return
                }
              }
              callback()
            }
          }
        ]
      }
    }
  },
  created() {
    // 获取路由参数的id方法是this.$route.params.id
    if (this.$route.params.id) {
      this.getEmployeeDetail()
    }
  },
  methods: {
    async getEmployeeDetail() {
      this.userInfo = await getEmployeeDetail(this.$route.params.id)
    },
    saveData() {
      this.$refs.userForm.validate(async(isOk) => {
        if (isOk) {
          // 校验通过 调用接口
          // 根据路由参数的id判断是新增还是编辑 有id就是编辑 没有id就是新增
          if (this.$route.params.id) {
            // 编辑
            await updateEmployee(this.userInfo)
            this.$message.success('更新员工成功')
          } else {
            // 新增
            await addEmployee(this.userInfo)
            this.$message.success('新增员工成功')
          }

          this.$router.push('/employee')
        }
      })
    }
  }
}
</script>

  <style scoped lang="scss">
.edit-form {
  background: #fff;
  padding: 20px;
  .inputW {
    width: 380px;
  }
}
</style>
