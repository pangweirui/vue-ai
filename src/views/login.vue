<template>
  <div class="container">
    <div class="title">
      <div class="backHome">
        <el-icon><Back/></el-icon>
        <span>返回首页</span>
      </div>
      <div class="text">
        <h2>登录您的账户</h2>
        <p>登录您的账号，开始使用心理AI助手</p>
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
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" placeholder="请输入密码" type="password"></el-input>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button class="btn" size="large" type="primary" @click="submitForm(ruleFormRef)">登录</el-button>
        <p>还没有账户？<router-link to="/register">去注册</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import {router} from '@/router'
import { login } from '@/apis/admin'
import { ElMessage } from 'element-plus'

const ruleFormRef = ref(null)

const formData = reactive({
  username:'',
  password: ''
})

const rules = reactive({
  username: {required: true, message: '请输入用户名', trigger: 'blur'},
  password: {required: true, message: '请输入密码', trigger: 'blur'}
})

//登录
const submitForm = async (form) => {
  if(!form) return
  await form.validate((valid) => {
    if(valid){
      login(formData).then(data=>{
        console.log(data)
        if(!data.token){
          ElMessage.error(data.msg)
          return
        }else{
          localStorage.setItem('token', data.token)
          localStorage.setItem('username', JSON.stringify(data.username))
          if(data.userInfo.userType===2){
            router.push('/back/dashboard')
            ElMessage.success('登录成功')
          }else{
          }
        }
      })
    }
  })
}

document.addEventListener('keydown', (e) => {
  if(e.key==='Enter'){
    submitForm(ruleFormRef.value)
  }
})
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
