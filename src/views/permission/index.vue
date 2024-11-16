<template>
  <div class="container">
    <div class="app-container">
      <!-- 权限管理 -->
      <el-button class="btn-add" size="mini" type="primary">添加权限</el-button>
      <el-table :data="list" row-key="id" :default-expand-all="true">
        <el-table-column label="名称" prop="name" />
        <el-table-column label="标识" prop="code" />
        <el-table-column label="描述" prop="description" />
        <el-table-column label="操作">
          <template v-slot="{row}">
            <el-button v-if="row.type===1" size="mini" type="text">添加</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>
<script>
// 引入获取权限列表接口
import { getPermissionList } from '@/api/permission'
// 引入转化树形结构的函数
import { transListToTreeData } from '@/utils/index'
export default {
  name: 'Permission',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getPermissionList()
  },
  methods: {
    async getPermissionList() {
      const result = await getPermissionList()
      // console.log(result[result.length - 1].pid)
      result[result.length - 1].pid = 1// 因为返回数据的pid都是0 所以手动改一个形成树形结构
      result[result.length - 1].type = 2
      this.list = transListToTreeData(result, 0)// 将列表数据转化成树形
      console.log(this.list)
    }
  }
}
</script>
<style>
.btn-add{
  margin:10px
}
</style>
