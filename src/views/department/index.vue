<template>
  <div class="container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-tree :data="depts" :props="defaultProps" :default-expand-all="true"	/>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Department',
  data() {
    return {
      depts: [
        { name: 'Heima', children: [
          { name: '总裁办' },
          { name: '市场部' },
          { name: '财务部' },
          { name: '技术部' },
          { name: '运营部' },
          { name: '人事部' }

        ]
        }

      ], // 数据属性
      defaultProps: {
        label: 'name', // 要显示的字段的名字
        children: 'children'// 读取子节点的字段名
      }
    }
  }
}
</script>
<style scoped>
.app-container{
  padding:30px 140px;
  font-size: 14px;
}
</style>
