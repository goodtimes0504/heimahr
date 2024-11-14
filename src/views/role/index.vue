<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary"> 添加角色 </el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table>
        <el-table-column align="center" width="200px" label="角色" />
        <el-table-column align="center" width="200px" label="启用" />
        <el-table-column align="center" label="描述" />
        <el-table-column align="center" label="操作" />
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
export default {
  name: 'Role'
}
</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
