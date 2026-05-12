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
          }else{
          }
        }
      })
    }
  })
}
</script>

<style lang="scss" scoped>
.container {
  width: 384px;
  .title{
    .backHome{
      margin-bottom: 20px;
    }
    .text{
      text-align: center;      
      h2{
        font-size: 36px;
        margin-bottom: 10px;
      }
      p{
        font-size: 18px;
        color: #666;
      }
    }
  }
  .form-container{
    width: 100%;
    margin-top: 20px;
    .footer{
      width: 100%;
      text-align: center;
      .btn{
        width: 100%;
        margin-top: 40px;
        margin-bottom: 20px;
      }

    }
  }
}
</style>