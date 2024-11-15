<template>
  <el-dialog
    width="500px"
    title="员工导入"
    :visible="showExcelDialog"
    @close="$emit('update:showExcelDialog', false)"
  >
    <el-row type="flex" justify="center">
      <div class="upload-excel">
        <input
          ref="excel-upload-input"
          class="excel-upload-input"
          type="file"
          accept=".xlsx, .xls"
          @change="uploadChange"
        >
        <div class="drop">
          <i class="el-icon-upload" />
          <el-button type="text" @click="getTemplate">下载导入模板</el-button>
          <span>将文件拖到此处或
            <el-button type="text" @click="handleUpload">点击上传</el-button>
          </span>
        </div>
      </div>
    </el-row>
    <el-row type="flex" justify="end">
      <!-- update:props属性名，值 直接修改 .sync修饰符的属性值 -->
      <el-button size="mini" type="primary" @click="$emit('update:showExcelDialog', false)">取消</el-button>
    </el-row>
  </el-dialog>
</template>
<script>
// 导入下载模板api接口
import { getExportTemplate } from '@/api/employee'
// 引入npm包file-saver
import FileSaver from 'file-saver'
// 导入上传excel的api接口
import { uploadExcel } from '@/api/employee'
export default {
  props: {
    showExcelDialog: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    async getTemplate() {
    // 下载模板
      const result = await getExportTemplate()
      //   console.log(result)
      // 将下载的二进制流文件保存到本地
      FileSaver.saveAs(result, '员工导入模板.xlsx')
    },
    // 上传文件 弹出文件选择器 只有一种方式 通过input type="file"来触发  选择文件后  触发input的change事件
    // 所以我们可以通过监听input的change事件 来获取用户选择的文件
    //   // 1.获取input元素
    //   const input = this.$refs['excel-upload-input']
    //   // 2.调用input的click方法 触发input的点击事件  弹出文件选择器
    //   input.click()
    //   // 3.监听

    handleUpload() {
      this.$refs['excel-upload-input'].click() // this.$refs['excel-upload-input']和this.$refs.属性名是等价的
    },
    // 监听input的change事件 就是说用户选择了文件后 触发change事件
    async  uploadChange(event) {
      // 1.获取用户选择的文件
      //   const file = this.$refs['excel-upload-input'].files[0]
      const file = event.target.files // file是一个文件对象 可以获取到文件的相关信息

      if (file.length > 0) {
        const data = new FormData()
        data.append('file', file[0]) // 将文件对象添加到FormData中 第一个参数是名字 第二个是值
        try {
          await uploadExcel(data)
          // await之后一定是成功的
          this.$emit('uploadSuccess')// 通知父组件 我上传成功了
          this.$emit('update:showExcelDialog', false) // 关闭弹层
        } catch (error) {
          this.$message.error(`${error},上传失败`)
        } finally {
          // 无论成功失败都会执行finally
          this.$refs['excel-upload-input'].value = '' // 清空input的值
        }
      }
    }
  }
}
</script>

  <style scoped lang="scss">
      .upload-excel {
        display: flex;
        justify-content: center;
        margin: 20px;
        width: 360px;
        height: 180px;
        align-items: center;
        color: #697086;
        .excel-upload-input {
          display: none;
          z-index: -9999;
        }
        .btn-upload,
        .drop {
          border: 1px dashed #dcdfe6;
          width: 100%;
          height: 100%;
          text-align: center;
          line-height: 160px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .drop {
          line-height: 40px;
          color: #bbb;
          i {
            font-size: 60px;
            display: block;
            color: #c0c4cc;
          }
        }
      }
  </style>
