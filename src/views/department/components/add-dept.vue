<template>
  <el-dialog title="添加部门" :visible="localShowDialog" @close="close">
  <!-- 防止弹层内容 -->
  </el-dialog></template>
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

