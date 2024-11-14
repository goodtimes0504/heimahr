<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary"> 添加角色 </el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <el-table-column prop="name" align="center" width="200px" label="角色" />
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- 自定义列结构 -->
          <template v-slot="{row}">
            <!-- {{ row }}的值{ "id": 1, "name": "系统管理员", "description": "管理整合平台，可以操作企业所有功能", "state": 1 } -->
            <!-- {{ row.state===1?"已启用":"未启用" }}这么写判断不了 row.state不等于1或者0的情况 所以要用下面的写法 -->
            <span>{{ row.state===1?"已启用":row.state===0?"未启用":"无" }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述" />
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 template不产生任何实质内容 但是有标签的作用-->
          <template>
            <el-button size="mini" type="text">分配权限</el-button>
            <el-button size="mini" type="text">编辑</el-button>
            <el-button size="mini" type="text">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <!-- 最后不要写逗号 不然白屏了就 -->
        <el-pagination layout="prev,pager,next" />
      </el-row>
    </div>
  </div>
</template>
<script>
// 导入获取角色列表的接口
import { getRoleList } from '@/api/role'

export default {
  name: 'Role',
  data() {
    return {
      list: []
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows } = await getRoleList()// 如果不传页码和页容量等params参数，默认是第一页，每页10条数据
      this.list = rows
    }
  }
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
