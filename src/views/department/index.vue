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
              <span class="tree-manager">{{ data.manageName }}</span>
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
export default {
  name: 'Department',
  data() {
    return {
      depts: [
        { name: 'Heima', manageName: '刘备', children: [
          { name: '总裁办', manageName: '张三' },
          { name: '行政部', manageName: '李四' },
          { name: '人事部', manageName: '王五' }

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
.tree-manager{
  width: 50px;
  display:inline-block;
  margin:10px
}
</style>
