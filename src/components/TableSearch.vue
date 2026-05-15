<template>
  <el-form ref="formRef" class="table-search" :model="formData">
    <el-row class="search-fields" :gutter="24">
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
    <el-row class="search-actions">
      <el-button type="primary" :icon="Search" @click="handleSearch">查询</el-button>
      <el-button :icon="Refresh" @click="handleReset">重置</el-button>
    </el-row>
  </el-form>
</template>

<script setup lang="ts">
import {reactive,computed,ref} from 'vue'
import { ElInput, ElSelect } from 'element-plus'
import { Refresh, Search } from '@element-plus/icons-vue'
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
.table-search {
  margin-bottom: 20px;
  padding: 18px 20px;
  border: 1px solid #e5edf7;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 12px 28px rgba(15, 23, 42, 0.045);

  .search-fields {
    row-gap: 4px;
  }

  .search-actions {
    gap: 10px;
    margin-top: 2px;
  }

  :deep(.el-form-item) {
    margin-bottom: 16px;
  }

  :deep(.el-form-item__label) {
    color: #475569;
    font-weight: 600;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    border-radius: 8px;
    background: #fbfdff;
    box-shadow: 0 0 0 1px #dbe6f4 inset;
  }

  :deep(.el-input__wrapper:hover),
  :deep(.el-select__wrapper:hover) {
    box-shadow: 0 0 0 1px #bfdbfe inset;
  }
}

@media (max-width: 768px) {
  .table-search {
    padding: 16px;

    .search-actions {
      width: 100%;

      :deep(.el-button) {
        flex: 1;
      }
    }
  }
}
</style>
