<template>
  <div class="card">
    <div v-if="$slots.header" class="card-header">
      <slot name="header" />
    </div>
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card {
  background: #fffdf8;
  border: 1px solid #e7e1d6;
  border-radius: 12px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 14px 16px;
  background: #f7f3eb;
  border-bottom: 1px solid #e7e1d6;
  font-weight: 650;
}

.card-body {
  padding: 16px;
}
</style>
