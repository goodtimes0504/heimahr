<template>
  <div class="container">
    <div class="app-container">
      <div class="left">
        <el-input
          v-model="queryParams.keyword"
          style="margin-bottom:10px"
          type="text"
          prefix-icon="el-icon-search"
          size="small"
          placeholder="输入员工姓名全员搜索"
          @input="changeValue"
        />
        <!-- 树形组件 -->
        <el-tree ref="deptTree" :data="depts" :props="defaultProps" :default-expand-all="true"	:expand-on-click-node="false" :highlight-current="true" node-key="id" @current-change="selectNode" />
      </div>
      <div class="right">
        <el-row class="opeate-tools" type="flex" justify="end">
          <el-button size="mini" type="primary" @click="$router.push('/employee/detail')">添加员工</el-button>
          <el-button size="mini" @click="showExcelDialog=true">excel导入</el-button>
          <el-button size="mini" @click="exportEmployee">excel导出</el-button>
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
            <template v-slot="{row}">
              <el-button type="text" size="mini" @click="$router.push('/employee/detail/'+row.id)">查看</el-button>
              <el-button type="text" size="mini">角色</el-button>
              <el-popconfirm
                title="确认删除该行数据吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </el-table-column>

        </el-table>
        <!-- 分页 -->
        <!-- align意思是垂直居中 flex是水平排列 justify 是水平右侧对齐 -->
        <el-row style="height:60px" align="middle" type="flex" justify="end">
          <el-pagination layout="total,prev, pager, next" :total="total" :current-page="queryParams.page" :pase-size="queryParams.size" @current-change="changePage" />
        </el-row>
      </div>
    </div>
    <!-- 放置导入excel功能的弹窗组件 -->
    <ImportExcel :show-excel-dialog.sync="showExcelDialog" @uploadSuccess="getEmployeeList" />
  </div>

</template>

<script>
// 导入获取组织架构api
import { getDepartment } from '@/api/department'

// 引入转化树形数据的方法
import { transListToTreeData } from '@/utils/index'

// 引入获取员工api
import { getEmployeeList } from '@/api/employee'
// 引入导出员工excel的api
import { exportEmployee } from '@/api/employee'
// 引入npm包file-saver
import FileSaver from 'file-saver'
// 引入导入excel的弹窗组件
import ImportExcel from './components/import-excel.vue'
// 引入删除员工的api
import { delEmployee } from '@/api/employee'
export default {
  name: 'Employee',
  components: {
    ImportExcel
  },
  data() {
    return {
      depts: [], // 组织架构数据
      defaultProps: {
        children: 'children',
        label: 'name'
      },
      // 存储查询对象 根据接口文档放属性
      queryParams: {
        departmentId: null, // 部门id
        page: 1, // 当前页码
        pageSize: 10, // 每页条数
        keyword: '' // 关键字
      },
      // 存储员工列表数据
      list: [],
      // 记录员工总数
      total: 0,
      // 控制导入excel弹窗显示与隐藏
      showExcelDialog: false
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
      // 切换部门的时候应该重新把page重置为1  否则会出现数据错乱
      this.queryParams.page = 1
      // console.log(node)
      this.queryParams.departmentId = node.id // 重新记录了查询id
      this.getEmployeeList()// 重新获取员工列表
    },
    // 获取员工列表方法
    async getEmployeeList() {
      const { rows, total } = await getEmployeeList(this.queryParams)
      this.list = rows
      this.total = total
    },
    // 分页组件的页码改变时触发
    changePage(newPage) {
      // alert(newPage)
      this.queryParams.page = newPage // 赋值新页码给查询参数对象
      this.getEmployeeList() // 重新按照最新的页码获取员工列表
    },
    // 左上角模糊搜索框值改变时触发
    changeValue() {
      // 防抖 单位时间之内只执行最后一次
      // this.timer表示给当前组件实例动态添加一个属性timer
      clearTimeout(this.timer)
      this.timer = setTimeout(() => {
        this.queryParams.page = 1 // 重置页码为1
        this.getEmployeeList() // 重新获取员工列表
      }, 300)
      // console.log(this.queryParams.keyword)
    },
    // 导出员工excel
    async exportEmployee() {
      const result = await exportEmployee() // 导出员工数据的接口函数
      // console.log(result)
      // FileSaver.saveAs(blob对象,文件名称)
      FileSaver.saveAs(result, '员工信息表.xlsx')// 将返回的blob对象保存为员工信息表.xlsx
    },
    async confirmDel(id) {
      // 调用删除员工的接口
      await delEmployee(id)
      if (this.list.length === 1) {
        // 当删除的是最后一页的最后一条数据 并且当前页大于1  此时应该将当前页减1  否则会出现数据错乱
        if (this.queryParams.page > 1) {
          this.queryParams.page--
        }
      }
      this.getEmployeeList() // 重新获取员工列表
      this.$message.success('删除成功')
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
