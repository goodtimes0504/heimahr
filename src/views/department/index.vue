<template>
  <div class="container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-tree :data="depts" :props="defaultProps" :default-expand-all="true">
        <!-- 节点结构 实际上是循环产生下面的template 有多少数据就生成多少个-->
        <!-- v-slot="{ node, data }"只能作用在template标签里
         这里的写法看element ui的文档 获取到node和data的方法和插槽的写法一样
         使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据 -->
        <template v-slot="{ data }">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <el-dropdown>
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link ">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>添加子部门</el-dropdown-item>
                  <el-dropdown-item>编辑部门</el-dropdown-item>
                  <el-dropdown-item>删除</el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>

      </el-tree>
    </div>
  </div>
</template>
<script>
// 引入获取部门api
import { getDepartment } from '@/api/department'
export default {
  name: 'Department',
  data() {
    return {
      depts: [], // 数据属性

      defaultProps: {
        label: 'name', // 要显示的字段的名字
        children: 'children'// 读取子节点的字段名
      }
    }
  },
  created() {
    this.getDepartment()// 在页面创建的时候调用这个方法
  },

  methods: {
    // 提前封装好一个获取部门的方法方便后期复用

    async getDepartment() {
      const result = await getDepartment()
      this.depts = result
    }
  }
}
</script>
<style scoped>
.app-container{
  padding:30px 140px;
  font-size: 14px;
}
.tree-manager{
  width: 80px;
  display:inline-block;
  margin:10px
}
</style>
