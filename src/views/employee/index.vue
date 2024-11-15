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
        <el-table :data="list">
          <el-table-column prop="staffPhoto" align="center" label="头像">
            <template v-slot="{row}">
              <el-avatar
                v-if="row.staffPhoto"
                :src="row.staffPhoto"
                :size="30"
              />
              <span v-else class="username">{{ row.username.charAt(0) }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="username"
            label="姓名"
          />
          <el-table-column prop="mobile" label="手机号" sortable />
          <el-table-column prop="workNumber" label="工号" sortable />
          <el-table-column prop="formOfEmployment" label="聘用形式">
            <template v-slot="{row}">
              <span v-if="row.formOfEmployment === 1">正式</span>
              <span v-else-if="row.formOfEmployment === 2">非正式</span>
              <span v-else>无</span>
            </template>
          </el-table-column>
          <el-table-column prop="departmentName" label="部门" />
          <el-table-column prop="timeOfEntry" label="入职时间" sortable="" />
          <el-table-column label="操作" width="280px">
            <template>
              <el-button type="text" size="mini">查看</el-button>
              <el-button type="text" size="mini">角色</el-button>
              <el-button type="text" size="mini">删除</el-button>
            </template>
          </el-table-column>

        </el-table>

      </div>
    </div>
    <!-- 分页 -->
    <!-- align意思是垂直居中 flex是水平排列 justify 是水平右侧对齐 -->
    <el-row style="height:60px" align="middle" type="flex" justify="end">
      <el-pagination layout="total,prev, pager, next" :total="1000" />
    </el-row>
  </div>

</template>

<script>
// 导入获取组织架构api
import { getDepartment } from '@/api/department'

// 引入转化树形数据的方法
import { transListToTreeData } from '@/utils/index'

// 引入获取员工api
import { getEmployeeList } from '@/api/employee'
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
      },
      // 存储员工列表数据
      list: []
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
      // 这个时候 参数才记录了id  所以此时才可以调用获取员工列表的方法
      this.getEmployeeList()
    },
    selectNode(node) {
      // console.log(node)
      this.queryParams.departmentId = node.id // 重新记录了查询id
      this.getEmployeeList()// 重新获取员工列表
    },
    // 获取员工列表方法
    async getEmployeeList() {
      const { rows } = await getEmployeeList(this.queryParams)
      this.list = rows
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
