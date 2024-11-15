<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input style="margin-bottom:10px" type="text" prefix-icon="el-icon-search" size="small" placeholder="输入员工姓名全员搜索" />
        <!-- 树形组件 -->
        <el-tree ref="deptTree" :data="depts" :props="defaultProps" :default-expand-all="true"	:expand-on-click-node="false" :highlight-current="true" node-key="id" @current-change="selectNode" />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary">添加员工</el-button>
          <el-button size="mini">excel导入</el-button>
          <el-button size="mini">excel导出</el-button>
        </el-row>
        <!-- 表格组件 -->
        <!-- 分页 -->
      </div>
    </div>
  </div>
</template>

<script>
// 导入获取组织架构api
import { getDepartment } from '@/api/department'

// 引入转化树形数据的方法
import { transListToTreeData } from '@/utils/index'
export default {
  name: 'Employee',
  data() {
    return {
      depts: [], // 组织架构数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 存储查询对象 根据接口文档放属性
      queryParams: {
        departmentId: null
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    // 定义获取组织架构的方法
    async getDepartment() {
      // 递归方法可以将列表转化成树形结构
      this.depts = transListToTreeData(await getDepartment(), 0)
      // console.log(this.depts[0])
      this.queryParams.departmentId = this.depts[0].id
      // 选中某个树形节点
      // 数组件渲染是异步的 得等它渲染完之后才能选中
      this.$nextTick(() => {
        // 此时意味着树的渲染完毕了
        this.$refs.deptTree.setCurrentKey(this.queryParams.departmentId)
      })
    },
    selectNode(node) {
      // console.log(node)
      this.queryParams.departmentId = node.id
    }
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  background: #fff;
  display: flex;
  .left {
    width: 280px;
    padding: 20px;
    border-right: 1px solid #eaeef4;
  }
  .right {
    flex: 1;
    padding: 20px;
    .opeate-tools {
      margin:10px ;
    }
    .username {
      height: 30px;
      width: 30px;
      line-height: 30px;
      text-align: center;
      border-radius: 50%;
      color: #fff;
      background: #04C9BE;
      font-size: 12px;
      display:inline-block;
    }
  }
}

</style>
