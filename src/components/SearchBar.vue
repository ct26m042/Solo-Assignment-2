<script setup lang="ts">
defineProps<{ modelValue: string }>()
defineEmits<{ 'update:modelValue': [value: string] }>()
</script>

<template>
  <input
    class="search-bar"
    type="search"
    :value="modelValue"
    @input="$emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    placeholder="Suchen ..."
    aria-label="Notizen durchsuchen"
  >
</template>

<style scoped>
.search-bar {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #d6d0c6;
  border-radius: 10px;
  background: #fff;
}
</style>
