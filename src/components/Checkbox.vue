<script setup lang="ts">
import { Check } from 'lucide-vue-next';

defineProps<{ modelValue: boolean }>();
defineEmits(['update:modelValue']);
</script>

<template>
  <div class="relative">
    <input type="checkbox" :value="modelValue"
      @input="$emit('update:modelValue', ($event.target as HTMLInputElement).checked)">
    <Check v-if="modelValue" class="absolute left-0 top-0 right-0 bottom-0" width="20" height="20" stroke-width="3" />
  </div>
</template>
