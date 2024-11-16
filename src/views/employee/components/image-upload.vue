<template>
  <el-upload
    class="avatar-uploader"
    action=""
    :show-file-list="false"
    :http-request="uploadImage"
    :before-upload="beforeAvatarUpload"
  >
    <!-- action是上传的地址 人资项目不需要 自动上传才需要action 手动上传不需要action 但是哪怕action不用也要给一个空字符串 不给会报错 :show-file-list="false"不展示列表 :on-success="handleAvatarSuccess"上传成功时的方法 :before-upload="beforeAvatarUpload"上传前的检查方法-->
    <img v-if="value" :src="value" class="avatar">
    <i v-else class="el-icon-plus avatar-uploader-icon" />
  </el-upload>
</template>

<script>
// 引入腾讯云cos存储桶上传sdk
import COS from 'cos-js-sdk-v5'
export default {
  props: {
    value: {
      type: String, // 图片地址
      default: ''
    }

  },
  methods: {
    // handleAvatarSuccess(res, file) {
    //   this.imageUrl = URL.createObjectURL(file.raw)
    // },
    beforeAvatarUpload(file) {
      // 判断文件的类型或者大小 函数返回true继续上传 false 停止上传
      // 支持jpeg png gif bmp类型

      const isJPG = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'].includes(file.type)
      const isLt5M = file.size / 1024 / 1024 < 5// 文件大小小于5MB 文件是以字节为单位的 1M=1024KB 1KB=1024B Byte就是字节

      if (!isJPG) {
        this.$message.error('上传头像图片只能是 JPG png gif bmp格式!')
      }
      if (!isLt5M) {
        this.$message.error('上传头像图片大小不能超过 5MB!')
      }
      return isJPG && isLt5M
    },
    // 选择图片上传
    uploadImage(params) {
    //   console.log(params.file)
      const cos = new COS({
        SecretID: '',
        SecretKey: ''
      })// 完成cos对象的初始化
      cos.putObject({
        Bucket: 'test-1258365177', // 存储桶名称
        Region: 'ap-guangzhou', // 存储桶所在地域
        Key: params.file.name, // 文件名
        Body: params.file, // 上传文件对象
        StorageClass: 'STANDARD' // 上传文件时，指定文件上传的格式  form-data
      }, (err, data) => {
        // console.log(err || data)
        if (err) {
          this.$message.error(err.Message)
        } else {
          // 上传成功之后 把图片地址赋值给父组件的value属性
          this.$emit('input', 'http://' + data.Location)
          this.$message.success('上传成功')
        }
      })
    }
  }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
