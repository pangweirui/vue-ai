<template>
  <el-dialog
    title="新增文章"
    v-model="dialogVisible"
    width="50%"
  >
  <el-form :model="formData" :rules="rules" ref="formRef">
    <el-form-item label="文章标题" prop="title">
      <el-input 
        v-model="formData.title" 
        placeholder="请输入文章标题" 
        maxlength="200" 
        show-word-limit 
      ></el-input>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
      <el-input v-model="formData.content" placeholder="请输入文章内容"></el-input>
    </el-form-item>
    <el-form-item label="分类" prop="categoryId">
      <el-select v-model="formData.categoryId" placeholder="请选择分类">
        <el-option v-for="item in props.categories" :key="item.value" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="文章摘要" prop="summary" maxlength="1000" show-word-limit :rows="4">
      <el-input type="textarea" v-model="formData.summary" placeholder="请输入文章摘要"></el-input>
    </el-form-item>
    <el-form-item label="文章标签" prop="tags" maxlength="1000" show-word-limit :rows="4">
      <el-select v-model="formData.tags" multiple placeholder="请输入文章标签" filterable allow-create style="width: 100%">
        <el-option v-for="item in props.tagArray" :key="item" :label="item" :value="item"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="封面图片">
      <div class="avatar-uploader">
        <el-upload
          class="avatar-uploader"
          action="#"
          :before-upload="beforeUpLoad"
          :http-request="handleUploadRequest"
          :show-file-list="false"
          accept="image/*"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar" style="width: 250px;height: 250px;" />
          <el-icon v-else class="avatar-uploader-icon"><Plus /></el-icon>
      </el-upload>
      <div
        v-if="imageUrl"
      >
        <el-button type="danger" size="small" @click="handleRemove">移除封面</el-button>
      </div>
      </div>
    </el-form-item>
    <el-form-item label="文章内容" prop="content">
    </el-form-item>
  </el-form>
  </el-dialog>
</template>

<script setup>
import { computed, reactive ,ref} from 'vue'
import { uploadFile } from '@/apis/admin'
import { fileBaseUrl } from '@/config/index'
import { ElMessage } from 'element-plus'

const props=defineProps({
  modelValue:{
    type:Boolean,
    default:false
  },
  categories:{
    type:Array,
    default:()=>[]
  },
  tagArray:{
    type:Array,
    default:()=>[]
  }
})
const emit=defineEmits(['update:modelValue'])

//弹窗状态
const dialogVisible=computed({
  get:()=>props.modelValue,
  set:(value)=>emit('update:modelValue',value)
})
//表单数据
const formData=reactive({
  title:'',
  content:'',
  coverImage:"",
  categoryId:'',
  summary:'',
  tags:[],
  id:""
})

//表单校验规则
const rules=reactive({
  title:[{required:true,message:'请输入文章标题',trigger:'blur'}],
  content:[{required:true,message:'请输入文章内容',trigger:'blur'}],
  categoryId:[{required:true,message:'请选择分类',trigger:'change'}],
  summary:[{message:'请输入文章摘要',trigger:'blur'}],
})

//上传封面图片
const imageUrl=ref('')
const handleAvatarSuccess = (
  response,
  uploadFile
) => {
  imageUrl.value = URL.createObjectURL(uploadFile.raw)
}

const beforeAvatarUpload = (rawFile) => {
  if (rawFile.type !== 'image/jpeg') {
    ElMessage.error('Avatar picture must be JPG format!')
    return false
  } else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

//上传封面图片
const handleUploadRequest=async ({file}) => {
  const businessId=crypto.randomUUID()
  const res=await uploadFile(file,{businessId})
  imageUrl.value=fileBaseUrl+res.filePath
  formData.coverImage=fileBaseUrl+res.filePath
}

//移除封面图片
const handleRemove=()=>{
  imageUrl.value=''
  formData.coverImage=''
}
</script>

<style lang="scss" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
