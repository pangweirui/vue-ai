<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      title="情绪日志详情"
      width="70%"
    >
      <description>
        <el-descriptions :column="2" :data="record" />
        <el-descriptions :column="2" :data="record" />
        <el-descriptions :column="2" :data="record" />
      </description>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref,computed } from 'vue'

const props=defineProps({
  dialogVisible: {
    type: Boolean,
    default: false
  }
})

const emit=defineEmits(['update:dialogVisible'])

const dialogVisible=computed({
  get:()=>props.dialogVisible,
  set:(val)=>emit('update:dialogVisible',val)
})
</script>

<style lang="scss" scoped>

</style>