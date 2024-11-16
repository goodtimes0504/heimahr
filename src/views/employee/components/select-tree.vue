<template>
  <!-- element ui组件 -->
  <el-cascader size="mini" :options="treeData" :props="props" separator="-" />
</template>
<script>
// 引入获取组织数据api
import { getDepartment } from '@/api/department'
// 引入转化树形结构
import { transListToTreeData } from '@/utils'
export default {
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
    }
  }
}
</script>
