<template>
  <div class="container">
    <div class="app-container">
      <!-- 组织架构 -->
      <el-tree :expand-on-click-node="false" :data="depts" :props="defaultProps" :default-expand-all="true">
        <!-- 节点结构 实际上是类似v-for循环产生下面的template 有多少数据就生成多少个-->
        <!-- v-slot="{ node, data }"只能作用在template标签里
         这里的写法看element ui的文档 获取到node和data的方法和插槽的写法一样
         使用 scoped slot 会传入两个参数node和data，分别表示当前节点的 Node 对象和当前节点的数据 -->
        <template v-slot="{ data }">
          <el-row style="width:100%;height:40px" type="flex" justify="space-between" align="middle">
            <el-col>{{ data.name }}</el-col>
            <el-col :span="4">
              <span class="tree-manager">{{ data.managerName }}</span>
              <!-- $event实参 默认表示类型 默认自带的 @command="operateDept($event)"和@command="operateDept"是一样的 -->
              <el-dropdown @command="operateDept($event,data.id)">
                <!-- 显示区域内容 -->
                <span class="el-dropdown-link ">
                  操作<i class="el-icon-arrow-down el-icon--right" />
                </span>
                <!-- 下拉菜单选项 -->
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item command="add">添加子部门</el-dropdown-item>
                  <el-dropdown-item command="edit">编辑部门</el-dropdown-item>
                  <el-dropdown-item command="del">删除</el-dropdown-item>

                </el-dropdown-menu>
              </el-dropdown>
            </el-col>
          </el-row>
        </template>

      </el-tree>
    </div>
    <!-- 防止弹层组件 -->
    <!-- .sync表示会接收子组件的事件 update:showDialog -->
    <!-- :xxx="xxx"前面是属性名 后面是变量的值 -->
    <!-- ref既可以获取dom对象也可以获取自定义组件的示例对象 -->
    <AddDept ref="addDept" :show-dialog="showDialog" :current-node-id="currentNodeId" @update:showDialog="showDialog = $event" @updateDepartment="getDepartment" />
  </div>
</template>
<script>
// 引入获取部门api
import { getDepartment } from '@/api/department'
import { transListToTreeData } from '@/utils'
// 引入删除部门api
import { delDepartment } from '@/api/department'
// 引入弹窗组件
import AddDept from './components/add-dept.vue'
export default {
  name: 'Department',
  components: { AddDept },
  data() {
    return {
      currentNodeId: null, // 当前点击的节点id
      showDialog: false, // 控制弹窗的显示与隐藏
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
      this.depts = transListToTreeData(result, 0)
    },
    // 部门相关操作
    operateDept(type, id) {
      console.log(type, id)
      if (type === 'add') {
        // 添加部门场景
        // 显示弹层组件
        this.showDialog = true
        this.currentNodeId = id
      } else if (type === 'edit') {
        // 编辑部门场景
        this.showDialog = true
        this.currentNodeId = id// 记录id 用它获取弹层数据 然后回显
        // 子组件里prop获取currentNodeId 是异步操作得等他更新完才能执行下面函数 此处没有写await的地方所以用了nextTick
        this.$nextTick(() => {
          // 父组件调用子组件方法获取数据
          this.$refs.addDept.getDepartmentDetail() // 获取子组件示例对象this.$refs.addDept等同于子组件的this
        })
      } else {
        // 删除部门场景
        this.$confirm('确定要删除该部门吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async() => {
          // 点击确认之后调取接口删除 并提示用户 并重新拉取数据
          await delDepartment(id)
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getDepartment()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
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
  width: 80px;
  display:inline-block;
  margin:10px
}
</style>
