<template>
  <div class="container">
    <div class="title">
      <div class="backHome" @click="router.push('/front/home')">
        <el-icon><Back/></el-icon>
        <span>返回首页</span>
      </div>
      <div class="text">
        <h2>创建账户</h2>
        <p>注册账号后即可使用心晴倾听</p>
      </div>
    </div>
    <div class="form-container">
      <el-form
        ref="ruleFormRef"
        :model="formData"
        :rules="rules"
        label-position="top"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入邮箱"></el-input>
        </el-form-item> 
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="formData.nickname" placeholder="请输入昵称"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="formData.confirmPassword" placeholder="请再次输入密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">注册</el-button>
        <p>已有账户？<router-link to="/auth/login">去登录</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {router} from '@/router'
import { register } from '@/apis/frontend'
import { ElMessage } from 'element-plus'

const ruleFormRef = ref(null)

const formData = reactive({
  username: '',
  email:'',
  nickname:'',
  phone:'',
  password: '',
  confirmPassword: '',
  gender:1,
  userType:1,
})

const validateConfirmPassword = (_rule, value, callback) => {
  if (value !== formData.password) {
    callback(new Error('两次输入的密码不一致'))
    return
  }

  callback()
}

const rules = reactive({
  username: {required: true, message: '请输入用户名', trigger: 'blur'},
  email: {required: true, message: '请输入邮箱', trigger: 'blur'},
  nikname: {required: true, message: '请输入昵称', trigger: 'blur'},
  phone: {required: true, message: '请输入手机号', trigger: 'blur'},
  password: {required: true, message: '请输入密码', trigger: 'blur'},
  confirmPassword: [
    {required: true, message: '请再次输入密码', trigger: 'blur'},
    {validator: validateConfirmPassword, trigger: 'blur'}
  ]
})

const submitForm = async (form) => {
  if(!form) return
  await form.validate((valid) => {
    if(valid){
      const registerData = {
        username: formData.username,
        email:formData.email,
        nickname:formData.nickname,
        phone:formData.phone,
        gender:2,
        userType:1,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
      }
      register(registerData).then((data) => {
        if(data.code ==="BUSINESS_ERROR"){
          ElMessage.error('注册失败，请检查用户名、邮箱、昵称、手机号是否重复')
        } 
        else{
          ElMessage.success('注册成功，请登录')
          router.push('/auth/login')
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  width: min(420px, 100%);
  padding: 38px;
  border: 1px solid #e5edf7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 18px 44px rgba(15, 23, 42, 0.08);
  .title{
    .backHome{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      height: 36px;
      padding: 0 12px;
      margin-bottom: 30px;
      border: 1px solid #dbe6f4;
      border-radius: 8px;
      color: #475569;
      font-size: 14px;
      font-weight: 600;
      background: #fbfdff;
      cursor: pointer;
      transition: color 0.18s ease, border-color 0.18s ease, background-color 0.18s ease;

      &:hover {
        color: #2563eb;
        border-color: #bfdbfe;
        background: #f8fbff;
      }
    }
    .text{
      text-align: left;      
      h2{
        margin-bottom: 10px;
        color: #0f172a;
        font-size: 34px;
        line-height: 1.2;
        letter-spacing: 0;
      }
      p{
        color: #64748b;
        font-size: 16px;
        line-height: 1.7;
      }
    }
  }
  .form-container{
    width: 100%;
    margin-top: 30px;

    :deep(.el-form-item) {
      margin-bottom: 20px;
    }

    :deep(.el-form-item__label) {
      color: #334155;
      font-weight: 700;
    }

    :deep(.el-input__wrapper) {
      min-height: 46px;
      border-radius: 8px;
      background: #fbfdff;
      box-shadow: 0 0 0 1px #dbe6f4 inset;
      transition: box-shadow 0.18s ease, background-color 0.18s ease;
    }

    :deep(.el-input__wrapper:hover) {
      box-shadow: 0 0 0 1px #bfdbfe inset;
    }

    :deep(.el-input__wrapper.is-focus) {
      background: #ffffff;
      box-shadow: 0 0 0 1px #3b82f6 inset, 0 0 0 3px rgba(59, 130, 246, 0.12);
    }

    .footer{
      width: 100%;
      text-align: center;
      .btn{
        width: 100%;
        height: 46px;
        margin-top: 22px;
        margin-bottom: 20px;
        border: 0;
        border-radius: 8px;
        font-weight: 700;
        background: linear-gradient(135deg, #2563eb 0%, #14b8a6 100%);
        box-shadow: 0 14px 26px rgba(37, 99, 235, 0.2);
      }

      p {
        color: #64748b;
        font-size: 14px;
      }

      a {
        color: #2563eb;
        font-weight: 700;
      }
    }
  }
}

@media (max-width: 560px) {
  .container {
    padding: 30px 22px;
    border: 0;
    box-shadow: none;

    .title .text h2 {
      font-size: 28px;
    }
  }
}
</style>
