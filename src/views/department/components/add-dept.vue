<template>
  <el-dialog :title="showTitle" :visible="localShowDialog" @close="close">
    <!-- 放置弹层内容 -->
    <el-form ref="addDept" :model="formData" :rules="rules" label-width="120px">
      <el-form-item prop="name" label="部门名称">
        <el-input v-model="formData.name" placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item prop="code" label="部门编码">
        <el-input v-model="formData.code" placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item prop="manager" label="部门负责人">
        <el-select v-model="formData.managerId" placeholder="请选择负责人" style="width:80%" size="mini">
          <!-- 下拉选项 循环负责人id label是显示的字段 value是实际存储的字段-->
          <el-option v-for="item in managerList" :key="item.id" :label="item.username" :value="item.id">
            {{ item.username }}
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="introduce" label="部门介绍">
        <el-input v-model="formData.introduce" type="textarea" placeholder="1-100个字符" :rows="4" style="width:80%" />
      </el-form-item>
      <!-- 放置按钮 -->
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini" @click="btnOk">确认</el-button>
            <el-button size="mini" @click="close">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
// 调用获取部门列表的api
import { getDepartment } from '@/api/department'
// 调用获取负责人列表
import { getManagerList } from '@/api/department'
// 调用新增部门接口
import { addDepartment } from '@/api/department'
// 调用获取部门详情接口
import { getDepartmentDetail } from '@/api/department'
// 调用更新部门接口
import { updateDepartment } from '@/api/department'

export default {
  props: {
    showDialog: {
      type: Boolean,
      default: false
    },
    // 接收父组件传过来的部门id，用于提交数据时携带 父部门id 就是pid
    currentNodeId: {
      type: Number,
      default: null

    }
  },
  data() {
    return {
      managerList: [], // 存储负责人列表数据
      localShowDialog: this.showDialog, // 控制对话框显示与隐藏
      formData: {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: ''// 父部门id
      },
      rules: {
        code: [
          { required: true, message: '部门编码不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门编码长度为2-10个字符', trigger: 'blur' },
          { trigger: 'blur', validator: async(rule, value, callback) => {
            // 自定义校验模式 value是输入的编码 callback是回调函数
            let result = await getDepartment()
            // 判断是否是编辑模式
            if (this.formData.id) {
              result = result.filter(item => item.id !== this.formData.id)
            }
            // result数组中是否存在value对应的索引
            // some方法作用是遍历数组，如果数组中存在一个元素满足条件，则返回true，否则返回false
            if (result.some(item => item.code === value)) {
              callback(new Error('部门编码已存在,请重新输入'))
            } else {
              callback()
            }
          }
          }

        ], // 部门编码
        introduce: [
          { required: true, message: '部门介绍不能为空', trigger: 'blur' },
          { min: 1, max: 100, message: '部门介绍长度为1-100个字符', trigger: 'blur' }
        ], // 部门介绍
        manageId: [
          { required: true, message: '部门负责人id不能为空', trigger: 'blur' }
        ], // 部门负责人id
        name: [
          { required: true, message: '部门名称不能为空', trigger: 'blur' },
          { min: 2, max: 10, message: '部门名称长度为2-10个字符', trigger: 'blur' },
          { trigger: 'blur', validator: async(rule, value, callback) => {
            // 自定义校验模式 value是输入的编码 callback是回调函数
            let result = await getDepartment()
            // 如果是修改操作，需要排除当前修改的数据
            if (this.formData.id) {
              result = result.filter(item => item.id !== this.formData.id)
            }
            // result数组中是否存在value对应的索引
            // some方法作用是遍历数组，如果数组中存在一个元素满足条件，则返回true，否则返回false

            if (result.some(item => item.name === value)) {
              callback(new Error('部门名称已存在,请重新输入'))
            } else {
              callback()
            }
          }
          }
        ] // 部门名称
        // pid: []// 父部门id 不需要校验
      }
    }
  },
  computed: {
    showTitle() {
      return this.formData.id ? '编辑部门' : '新增部门'
    }
  },
  watch: {
    showDialog(newValue) {
      this.localShowDialog = newValue
    }
  },
  created() {
    this.getManagerList()
  },
  methods: {
    close() {
      // 重置表单数据
      // 但是只能重置模板中绑定的数据 不能重置没有绑定的 id
      // 所以推荐用重新赋值的方法

      this.formData = {
        code: '', // 部门编码
        introduce: '', // 部门介绍
        managerId: '', // 部门负责人id
        name: '', // 部门名称
        pid: ''// 父部门id
      }
      //   this.$refs.addDept.resetFields()
      // 要修改父组件的showDialog属性，所以需要使用$emit
      this.$emit('update:showDialog', false)
    },
    async getManagerList() {
      this.managerList = await getManagerList()
    },
    // 点击确定按钮
    btnOk() {
      // 校验函数是validate不是validator！！！！！
      this.$refs.addDept.validate(async(isOk) => {
        if (isOk) {
          let msg = '新增'
          // 通过this.formData.id判断是新增还是修改
          if (this.formData.id) {
            // 编辑模式 调用编辑接口
            msg = '编辑'
            await updateDepartment(this.formData)
          } else {
          // 新增模式 调用新增接口
            await addDepartment({ ...this.formData, pid: this.currentNodeId })
          }
          // 通知父组件更新
          this.$emit('updateDepartment')
          // 提示消息
          this.$message.success(`${msg}部门成功`)
          // 关闭弹层并重置表单
          this.close()
        }
      })
    },
    // 获取回显部门详情
    async getDepartmentDetail() {
      this.formData = await getDepartmentDetail(this.currentNodeId)
      //   console.log(result)
    }

  }
}
</script>

