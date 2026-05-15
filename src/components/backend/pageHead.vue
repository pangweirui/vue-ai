<template>
  <div class="page-head">
    <div class="page-title">{{ title }}</div>
    <div class="action-btn">
      <slot name="buttons"></slot>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: ''
  }
})
</script>
<style lang="scss" scoped>
.page-head{
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 42px;
  margin-bottom: 20px;
  .page-title{
    position: relative;
    padding-left: 14px;
    font-size: 22px;
    font-weight: 700;
    line-height: 1.3;
    color: #0f172a;
    letter-spacing: 0;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: 4px;
      height: 20px;
      border-radius: 4px;
      background: linear-gradient(180deg, #6366f1 0%, #14b8a6 100%);
      transform: translateY(-50%);
    }
  }

  .action-btn {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}

@media (max-width: 768px) {
  .page-head {
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;

    .page-title {
      font-size: 20px;
    }
  }
}
</style>
