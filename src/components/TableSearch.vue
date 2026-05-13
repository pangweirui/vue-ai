<template>
  <el-form ref="formRef" :model="formData">
    <el-row :gutter="24">
      <template 
      v-for="item in formItemAttr"
      :key="item.prop"
      >
        <el-col v-bind="item.col">
          <el-form-item 
            :label="item.label"
            :prop="item.prop"
          >
            <component 
              :is="isComp(item.comp)" 
              :placeholder="item.placeholder" 
              v-model="formData[item.prop]"
            >
            <template v-if="item.comp==='select'">
              <el-option label="全部" value="all"></el-option>
              <el-option
                v-for="option in item.options ?? []"
                :key="option.value"
                :label="option.label"
                :value="option.value"
              ></el-option>
            </template>
            </component>
          </el-form-item>
        </el-col>
        
      </template>
    </el-row>
    <el-row>
      <el-button type="primary" @click="handleSearch">查询</el-button>
      <el-button type="primary" @click="handleReset">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import {reactive,computed,ref} from 'vue'
import { ElInput, ElSelect } from 'element-plus'
import type { FormInstance } from 'element-plus'
import 'element-plus/es/components/input/style/css'
import 'element-plus/es/components/select/style/css'
import 'element-plus/es/components/option/style/css'

const emit = defineEmits(['search','reset'])

const formRef = ref<FormInstance>()
const formData = reactive<Record<string, OptionValue>>({})

type OptionValue = string | number
type SearchOption = {
  label: string
  value: OptionValue
}
type FormItem = {
  comp: string
  prop: string
  label: string
  placeholder?: string
  options?: SearchOption[]
}
const props=withDefaults(defineProps<{
  formItem?: FormItem[]
}>(), {
  formItem: () => [],
})

const formItemAttr=computed(()=>{
  const {formItem}=props
  return formItem.map(item=>({
    ...item,
    col:{xs:24,sm:12,md:8,lg:6,xl:4}
  }))
})

const componentMap = {
  input: ElInput,
  select: ElSelect,
} as const
type ComponentName = keyof typeof componentMap
const isComp = (comp: string) => {
  return componentMap[comp as ComponentName]
}

const handleSearch = () => {
  emit('search', formData)
}

const handleReset = () => {
  formRef.value?.resetFields()
  emit('reset')
}
</script>

<style lang="scss" scoped>

</style>
