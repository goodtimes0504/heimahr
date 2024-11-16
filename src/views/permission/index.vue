<template>
  <div class="container">
    <div class="app-container">
      <!-- 权限管理 -->
      <el-button class="btn-add" size="mini" type="primary" @click="openDialogAdd(0,1)">添加权限</el-button>
      <el-table :data="list" row-key="id" :default-expand-all="true">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" size="mini" type="text" @click="openDialogAdd(row.id,2)">添加</el-button>
            <el-button size="mini" type="text" @click="openDialogEdit(row.id)">编辑</el-button>
            <el-button size="mini" type="text" @click="delPermission(row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <permissionDialog ref="childComponent" :show-permission-dialog.sync="showPermissionDialog" :edit-id="editId" @update:showPermissionDialog="showPermissionDialog = $event" @refreshList="getPermissionList" />
  </div>
</template>
<script>
// 引入获取权限列表接口
import { getPermissionList } from '@/api/permission'
// 引入转化树形结构的函数
import { transListToTreeData } from '@/utils/index'
// 引入添加权限对话框组件
import permissionDialog from './components/permission-dialog.vue'
// 引入删除权限接口
import { delPermission } from '@/api/permission'

export default {
  name: 'Permission',
  components: {
    permissionDialog
  },
  data() {
    return {
      editId: 0, // 编辑权限的id
      list: [], // 权限列表
      showPermissionDialog: false, // 控制添加权限对话框的显示与隐藏
      formData: { // 表单数据
        name: '', // 名称
        code: '', // 标识
        description: '', // 描述
        type: '', // 类型 该类型 不需要显示 因为点击添加的时候已经知道类型了
        pid: '', // 因为做的是树 需要知道添加到哪个节点下了
        enVisible: '0' // 默认关闭
      }
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const result = await getPermissionList()
      // console.log(result[result.length - 1].pid)
      // result[result.length - 1].pid = 1// 因为返回数据的pid都是0 所以手动改一个形成树形结构
      // result[result.length - 1].type = 2
      this.list = transListToTreeData(result, 0)// 将列表数据转化成树形
      // console.log(this.list)
    },
    // addPermission(pid, type) {
    //   this.formData.pid = pid
    //   this.formData.type = type
    //   this.showPermissionDialog = true
    // },
    // async editPermission(id) {
    //   // 根据获取id获取详情
    //   this.formData = await getPermissionDetail(id)
    //   this.showPermissionDialog = true
    // },
    // 删除操作
    async delPermission(id) {
      try {
        await this.$confirm('确定要删除该数据吗')
        await delPermission(id)
        this.getPermissionList()
        this.$message.success('删除成功')
      } catch (error) {
        console.log(error)
      }
    },
    // 打开并判断是  新增还是编辑
    openDialogAdd(pid, type) {
      this.$refs.childComponent.add(pid, type)

      this.showPermissionDialog = true
    },
    openDialogEdit(id) {
      this.$refs.childComponent.edit(id)
      this.showPermissionDialog = true
    }
  }
}
</script>
<style>
.btn-add{
  margin:10px
}
</style>
