<template>
  <div class="container">
    <div class="app-container">
      <!-- 角色管理内容 -->
      <div class="role-operate">
        <el-button size="mini" type="primary" @click="showDialog = true">
          添加角色
        </el-button>
      </div>
      <!-- 放置table组件 -->
      <el-table :data="list">
        <el-table-column prop="name" align="center" width="200px" label="角色">
          <template v-slot="{ row }">
            <!-- 条件判断 -->
            <el-input v-if="row.isEdit" v-model="row.editRow.name" size="mini" />
            <span v-else>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="state" align="center" width="200px" label="启用">
          <!-- 自定义列结构 -->
          <template v-slot="{ row }">
            <!-- {{ row }}的值{ "id": 1, "name": "系统管理员", "description": "管理整合平台，可以操作企业所有功能", "state": 1 } -->
            <el-switch v-if="row.isEdit" v-model="row.editRow.state" :active-value="1" :inactive-value="0" />
            <!-- {{ row.state===1?"已启用":"未启用" }}这么写判断不了 row.state不等于1或者0的情况 所以要用下面的写法 -->
            <span v-else>{{
              row.state === 1 ? "已启用" : row.state === 0 ? "未启用" : "无"
            }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="description" align="center" label="描述">
          <template v-slot="{ row }">
            <el-input v-if="row.isEdit" v-model="row.editRow.description" type="textarea" size="mini" />
            <span v-else>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <!-- 放置操作按钮 template不产生任何实质内容 但是有标签的作用-->
          <template v-slot="{ row }">
            <template v-if="row.isEdit">
              <!-- 编辑状态 -->
              <el-button type="primary" size="mini" @click="btnEditOk(row)">确定</el-button>
              <el-button size="mini" @click="btnEditCancel(row)">取消</el-button>
            </template>
            <template v-else>
              <!-- 非编辑状态 -->
              <el-button size="mini" type="text">分配权限</el-button>
              <el-button
                size="mini"
                type="text"
                @click="btnEditRow(row)"
              >编辑</el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="confirmDel(row.id)"
              >
                <el-button slot="reference" style="margin-left:10px" size="mini" type="text">删除</el-button>
              </el-popconfirm>
            </template>
          </template>
        </el-table-column>
      </el-table>
      <!-- 放置分页组件 -->
      <el-row type="flex" justify="end" align="middle" style="height: 60px">
        <!-- 最后不要写逗号 不然白屏了就 -->
        <el-pagination
          :page-size="pageParams.pagesize"
          :total="pageParams.total"
          :current-page="pageParams.page"
          layout="prev,pager,next"
          @current-change="changePage"
        />
      </el-row>
    </div>
    <!-- 这里如果不加.sync就无法点击右上角的叉叉来关闭弹窗 因为父组件是这个index.vue子组件是弹窗 不加.sync修饰符 就无法通过子组件来给父组件传递数据来关闭弹窗 -->
    <el-dialog
      width="500px"
      title="新增角色"
      :visible.sync="showDialog"
      @close="btnCancel"
    >
      <!-- 表单内容  -->
      <el-form
        ref="roleForm"
        :model="roleForm"
        :rules="rules"
        label-width="120px"
      >
        <el-form-item label="角色名称" prop="name">
          <el-input v-model="roleForm.name" style="width: 300px" size="mini" />
        </el-form-item>
        <!-- 下面这个不需要校验 所以就不用写prop="state"属性 但是如果要重置表单 就又需要prop了 所以还是得写-->
        <el-form-item label="启用" prop="state">
          <!-- 当使用冒号 : 时，如 :active-value="1"，active-value 会被正确地解析为一个动态的数据绑定表达式，它会根据组件实例中相应数据属性的值来动态地确定 el-switch 处于激活状态时所对应的真实值。这样，el-switch 就能与 v-model 以及组件中的数据进行正确的交互，实现预期的功能。如果前面不加冒号 那么它就是字符串了 不能正确的跟随v-model的值来变化了 -->
          <el-switch
            v-model="roleForm.state"
            :active-value="1"
            :inactive-value="0"
            size="mini"
          />
        </el-form-item>
        <el-form-item label="角色描述" prop="description">
          <el-input
            v-model="roleForm.description"
            type="textarea"
            :rows="3"
            style="width: 300px"
            size="mini"
          />
        </el-form-item>
        <el-form-item>
          <el-row type="flex" justify="center">
            <el-col :span="12">
              <el-button
                type="primary"
                sizi="mini"
                @click="btnOk"
              >确认</el-button>
              <el-button sizi="mini" @click="btnCancel">取消</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
<script>
// 导入获取角色列表的接口
import { getRoleList } from '@/api/role'
// 导入新增角色的接口
import { addRole } from '@/api/role'
// 导入更新角色的接口
import { updateRole } from '@/api/role'
// 导入删除角色的接口
import { delRole } from '@/api/role'
export default {
  name: 'Role',
  data() {
    return {
      list: [],
      // 控制新增角色弹窗的显示和隐藏
      showDialog: false,
      // 将分页信息放到一个对象里
      pageParams: {
        page: 1, // 当前页码
        pagesize: 5, // 每页显示条数
        total: 0 // 初始值是0
      },
      // 新增角色表单数据
      roleForm: {
        name: '',
        description: '',
        state: '0'// number类型 默认未启用 0代表未启用 1代表启用
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 2, max: 10, message: '长度在 2 到 10 个字符', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入角色描述', trigger: 'blur' },
          { min: 1, max: 100, message: '长度在 1 到 100 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    async getRoleList() {
      const { rows, total } = await getRoleList(this.pageParams)// 如果不传页码和页容量等params参数，默认是第一页，每页10条数据
      this.list = rows
      this.pageParams.total = total
      // 针对每一行数据添加一个编辑标记
      this.list.forEach(item => {
        // item.isEdit = false
        // 数据响应式的问题 数据变化 视图更新 但是添加的属性不具备响应式特点
        // this.$set(目标对象,属性名,初始属性值) 可以针对目标对象添加的属性 添加响应式
        this.$set(item, 'isEdit', false)
        // 声明缓存数据
        this.$set(item, 'editRow', {
          name: item.name,
          description: item.description,
          state: item.state
        }
        )
      }
      )
    },
    changePage(newPage) {
    // alert(newPage)
    // 当页码发生变化的时候 重新获取数据
      this.pageParams.page = newPage
      this.getRoleList()
    },
    btnOk() {
      this.$refs.roleForm.validate(async valid => {
        if (valid) {
        // 校验通过
        // 发送请求
          await addRole(this.roleForm)
          // 因为前面封装的时候直接获取的data 获取不到code了 所以直接给成功提示吧
          // 如果状态码是40001 意思是后端返回数据 并提示成功
          this.$message.success('添加成功')// 给客户提示
          this.getRoleList()// 重新获取数据
          this.btnCancel()// 关闭弹框并重置表单
        // } else {
        //   this.$message.error('添加失败')// 客户端返回数据并提示失败的情况下提示客户添加失败
        // }
        } else {
          this.$message.error('校验失败')// 校验不通过的情况下提示校验失败
        }
      })
    },
    btnCancel() {
      this.$refs.roleForm.resetFields()// 重置表单
      this.showDialog = false// 关闭弹框
    },
    btnEditRow(row) {
    // 点击编辑按钮的时候 给当前行添加一个编辑标记
      row.isEdit = true
      // console.log(row)
      // 更新缓存数据 解决退出编辑模式再次进入编辑时还是上一次编辑时的数据的bug
      row.editRow.name = row.name
      row.editRow.description = row.description
      row.editRow.state = row.state
    },
    // 编辑模式时点击确定
    async btnEditOk(row) {
      if (row.editRow.name && row.editRow.description) {
        // 校验通过
        await updateRole({ ...row.editRow, id: row.id })
        // 更新成功 提示用户
        this.$message.success('更新角色成功')
        // 更新显示数据 该行退出编辑状态
        // eslint-disable-next-line require-atomic-updates
        // row.name = row.editRow.name // eslint的校验 误判 它认为等待更新的变量在更新之前被使用了 所以报错
        // Object.assign() 方法用于将所有可枚举属性的值从一个或多个源对象复制到目标对象。它将返回目标对象。
        Object.assign(row, {
          ...row.editRow,
          isEdit: false// 退出编辑模式
          // 上面这么写是规避eslint的误判
        })
      } else {
        // 校验不通过
        this.$message.error('角色和描述不能为空')
        return
      }
    },
    // 编辑时点击取消
    btnEditCancel(row) {
      row.isEdit = false
    },
    // 删除按钮确定
    async confirmDel(id) {
      // alert(id)
      await delRole(id)
      this.$message.success('删除成功')
      // 删除的如果是最后一个
      if (this.list.length === 1) {
        this.pageParams.page--
      }
      this.getRoleList()
    }
  }}

</script>
<style scoped>
.role-operate {
  padding: 10px;
}
</style>
