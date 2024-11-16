<template>
  <!-- 权限弹窗组件 -->
  <el-dialog
    ref="dialog"
    :visible="showPermissionDialog"
    :title="`${showText}权限点弹窗`"
    width="50%"
    @close="btnCancel"
  >
    <el-form ref="perForm" :model="formData" :rules="rules" label-width="120px">
      <el-form-item label="权限名称" prop="name">
        <el-input v-model="formData.name" placeholder="请输入权限名称" size="mini" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限标识" prop="code">
        <el-input v-model="formData.code" placeholder="请输入权限标识" size="mini" style="width:90%" />
      </el-form-item>
      <el-form-item label="权限描述" prop="description">
        <el-input v-model="formData.description" placeholder="请输入权限描述" size="mini" type="textarea" :rows="3" style="width:90%" />
      </el-form-item>
      <el-form-item label="开启状态" prop="enVisible">
        <el-switch
          v-model="formData.enVisible"
          active-value="1"
          inactive-value="0"
        />
      </el-form-item>
    </el-form>
    <el-row slot="footer" type="flex" justify="center">
      <el-col :span="6">
        <el-button size="small" type="primary" @click="btnOK">确定</el-button>
        <el-button size="small" @click="btnCancel">取消</el-button>
      </el-col>
    </el-row>
  </el-dialog>

</template>

<script>
// 引入查询权限详情接口
import { getPermissionDetail } from '@/api/permission'
// 引入新增  更新权限的api接口

import { updatePermission, addPermission } from '@/api/permission'
export default {
  props: {
    showPermissionDialog: {
      type: Boolean,
      default: false
    },
    editId: {
      type: Number,
      default: -1
    }
  },

  data() {
    return {
      formData: { // 表单数据
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 默认关闭
      },
      rules: {
        name: [{ required: true, message: '权限名称不能为空', trigger: 'blur' }],
        code: [{ required: true, message: '权限标识不能为空', trigger: 'blur' }]
      }
    }
  },
  computed: {
    showText() {
      return this.formData.id ? '新增' : '编辑'
    }

  },
  // watch: {
  //   editId(newValue, oldValue) {
  //     if (newValue !== null && newValue !== oldValue) {
  //       // 当editId有新值且与旧值不同时（说明发生了改变），调用获取数据的接口
  //       this.addOrEdit()
  //     }
  //   }
  // },
  // created() {
  //   this.addOrEdit()
  // },
  methods: {
    handleCloseDialog() {
      this.$emit('update:showPermissionDialog', false)
    },
    btnOK() {
      this.$refs.perForm.validate().then(async() => {
        if (this.formData.id) {
          await updatePermission(this.formData)
          this.$message.success('修改成功')
          this.handleCloseDialog()
          this.$emit('refreshList')
        } else {
          await addPermission(this.formData)
          this.$message.success('新增成功')
          this.handleCloseDialog()
          this.$emit('refreshList')
        }
      })
    },
    btnCancel() {
      this.formData = {
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 默认关闭
      }
      this.$refs.perForm.resetFields()
      this.handleCloseDialog()
    },

    add(pid, type) {
      // console.log(this.formData.pid, this.formData.type)

      this.formData.pid = pid
      this.formData.type = type

      // console.log(this.formData.pid, this.formData.type)
    },
    async edit(id) {
      this.formData = await getPermissionDetail(id)
    }
  }
}
</script>

<style>

</style>
