<template>
  <!-- element ui组件 -->
  <el-cascader size="mini" :options="treeData" :props="props" separator="-" :value="value" @change="changeValue" />
</template>
<script>
// 引入获取组织数据api
import { getDepartment } from '@/api/department'
// 引入转化树形结构
import { transListToTreeData } from '@/utils'
export default {
  props: {
    value: {
      type: Number, // 存储的是部门的id
      default: null

    }
  },
  data() {
    return {
      treeData: [], // 赋值给级联组件options
      props: {
        label: 'name', // 要展示的字段
        value: 'id' // 根据哪个字段进行匹配
      }
    }
  },
  created() {
    this.getDepartment()
  },
  methods: {
    async getDepartment() {
    //   const result = await getDepartment()
    //   //   console.log(result)
    //   this.treeData = transListToTreeData(result, 0)
    // //   console.log(this.treeData)
      this.treeData = transListToTreeData(await getDepartment(), 0)// 将获取的组织架构转成树形结构
    },
    changeValue(list) {
      // 取到数组最后一位
      if (list.length > 0) {
        this.$emit('input', list[list.length - 1])// 将最后一位的id取出来传给父组件
      } else {
        this.$emit('input', null)// 如果长度为0 说明值为空
      }
    }
  }
}
</script>
