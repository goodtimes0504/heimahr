<template>
  <el-dialog title="添加部门" :visible="localShowDialog" @close="close">
    <!-- 放置弹层内容 -->
    <el-form label-width="120px">
      <el-form-item label="部门名称">
        <el-input placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门编码">
        <el-input placeholder="2-10个字符" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门负责人">
        <el-select placeholder="请选择负责人" style="width:80%" size="mini" />
      </el-form-item>
      <el-form-item label="部门介绍">
        <el-input type="textarea" placeholder="1-100个字符" :rows="4" style="width:80%" />
      </el-form-item>
      <!-- 放置按钮 -->
      <el-form-item>
        <el-row type="flex" justify="center">
          <el-col :span="12">
            <el-button type="primary" size="mini">提交</el-button>
            <el-button size="mini">取消</el-button>
          </el-col>
        </el-row>
      </el-form-item>

    </el-form>
  </el-dialog>
</template>
<script>
export default {
  props: {
    showDialog: {
      type: Boolean,
      required: false

    }
  },

  data() {
    return {
      localShowDialog: this.showDialog
    }
  },
  watch: {
    showDialog(newValue) {
      this.localShowDialog = newValue
    }
  },
  methods: {
    close() {
      // 要修改父组件的showDialog属性，所以需要使用$emit
      this.$emit('update:showDialog', false)
    }
  }
}
</script>

