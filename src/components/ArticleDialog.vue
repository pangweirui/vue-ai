<template>
  <el-dialog
    :title="isEdit?'编辑文章':'新增文章'"
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
          :before-upload="beforeAvatarUpload"
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
      <RichTextEditor 
        v-model="formData.content" 
        ref="editorRef"
        placeholder="请输入文章内容"
        :maxCharCount="1000"
        @change="handleContentChange"
        @created="handleEditorCreated"
        />
    </el-form-item>
  </el-form>
  <div v-if="btnPreview">
    <h3>文章内容预览</h3>
    <div v-html="formData.content"></div>
  </div>
  <template #footer>
      <el-button @click="btnPreview=!btnPreview">{{ btnPreview?'隐藏预览':'预览' }}</el-button>
      <el-button @click="handleClose">取消</el-button>
      <el-button type="primary" @click="handleSubmit" >{{ isEdit?'编辑':'新增' }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed,ref,reactive,nextTick,watch } from 'vue'
import { uploadFile,createArticle,updateArticle } from '@/apis/admin'
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
  },
  currentArticle:{
    type:Object,
    default:()=>({})
  }
})
const emit=defineEmits(['update:modelValue'])

//弹窗状态
const dialogVisible=computed({
  get:()=>props.modelValue,
  set:(value)=>emit('update:modelValue',value)
})
//表单数据
const getEmptyFormData=()=>({
  title:'',
  content:'',
  coverImage:"",
  categoryId:'',
  summary:'',
  tags:[],
  id:""
})
const formData=reactive(getEmptyFormData())

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
  if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const businessId=ref('')
const getPreviewImageUrl=(url)=>{
  if(!url){
    return ''
  }
  if(/^https?:\/\//.test(url)||url.startsWith('blob:')||url.startsWith('data:')){
    return url
  }
  return `${fileBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`
}
const getStoredCoverImage=(url)=>{
  if(!url){
    return ''
  }
  return url.startsWith(fileBaseUrl) ? url.slice(fileBaseUrl.length) : url
}
const normalizeTagsToArray=(tags)=>{
  if(Array.isArray(tags)){
    return tags
  }
  if(typeof tags === 'string'){
    return tags ? tags.split(',').filter(Boolean) : []
  }
  return []
}
const normalizeTagsToString=(tags)=>{
  return Array.isArray(tags) ? tags.join(',') : tags || ''
}
//上传封面图片
const handleUploadRequest=async ({file}) => {
  businessId.value=businessId.value||crypto.randomUUID()
  const res=await uploadFile(file,{businessId:businessId.value})
  imageUrl.value=getPreviewImageUrl(res.filePath)
  formData.coverImage=res.filePath
}

//移除封面图片
const handleRemove=()=>{
  imageUrl.value=''
  formData.coverImage=''
}

//文章内容改变时触发
const handleContentChange=(data)=>{
  formData.content=data.html
}

//编辑文章时，回填文章内容到富文本编辑器
const editorRef=ref(null)
const handleEditorCreated=(editor)=>{
  editorRef.value=editor
  if(formData.content&&editor){
    nextTick(()=>{
      editor.setHtml?.(formData.content)
    })
  }
}
//是否编辑文章
const isEdit=computed(()=>!!props.currentArticle.id)

watch(()=>props.currentArticle,
  (newVal)=>{
    if(newVal){
      Object.assign(formData,getEmptyFormData(),newVal)
      formData.tags=normalizeTagsToArray(newVal.tags)
      businessId.value=newVal.id
      imageUrl.value=getPreviewImageUrl(newVal.coverImage)
    }
})
//预览文章内容
const btnPreview=ref(false)

const formRef=ref(null)
const loading=ref(false)

//提交表单
const handleSubmit= () => {
  formRef.value.validate(async (valid) => {
    if(valid){
      loading.value=true
      const submitData={
        ...formData,
        tags:normalizeTagsToString(formData.tags),
        coverImage:getStoredCoverImage(formData.coverImage)
      }
      if(isEdit.value){
        await updateArticle(formData.id,submitData)
      }else{
        await createArticle(submitData)
      }
      ElMessage.success('新增成功')
      dialogVisible.value=false
      loading.value=false
    }
  })
}

//关闭弹窗
const handleClose=()=>{
  formRef.value.resetFields()
  businessId.value=''
  handleRemove()
  dialogVisible.value=false
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
